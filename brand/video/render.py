"""EatAtEzz 30-second intro, two vertical 15-second parts (1080x1920, 30 fps).

Every scene is drawn with PIL and piped straight into ffmpeg, one mp4 per scene.
  python3 render.py preview   -> a few full-size JPEG stills to check
  python3 render.py render    -> scene files, joined per part, with sound
"""
import math
import os
import random
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
OUT = os.path.dirname(os.path.abspath(__file__))

INK = (20, 17, 14)
CARD = (30, 26, 22)
CARD2 = (39, 34, 28)
LINE = (58, 50, 41)
CREAM = (246, 238, 220)
BEIGE = (220, 198, 160)
CARAMEL = (176, 141, 94)
MUTED = (168, 153, 138)
VEG = (63, 155, 79)
NONVEG = (192, 65, 47)

FONTS = "/usr/share/fonts/truetype/google-fonts/ofl/"
_cache = {}


def font(kind, size, weight=400):
    key = (kind, size, weight)
    if key not in _cache:
        if kind == "sans":
            f = ImageFont.truetype(FONTS + "dmsans/DMSans[opsz,wght].ttf", size)
            f.set_variation_by_axes([min(40, max(9, size)), weight])
        else:
            path = "gelasio/Gelasio-Italic[wght].ttf" if kind == "serif-i" else "gelasio/Gelasio[wght].ttf"
            f = ImageFont.truetype(FONTS + path, size)
            f.set_variation_by_axes([weight])
        _cache[key] = f
    return _cache[key]


# ---------- sprites ----------

def text(s, f, color, tracking=0):
    """Tight RGBA sprite of one line of text."""
    if tracking:
        parts = [text(ch, f, color) for ch in s]
        widths = [p.width if ch != " " else int(f.size * 0.3) for p, ch in zip(parts, s)]
        h = max(p.height for p in parts)
        img = Image.new("RGBA", (sum(widths) + tracking * (len(s) - 1), h), (0, 0, 0, 0))
        x = 0
        for p, w, ch in zip(parts, widths, s):
            if ch != " ":
                img.paste(p, (x, h - p.height), p)
            x += w + tracking
        return img
    l, t, r, b = f.getbbox(s)
    asc, desc = f.getmetrics()
    img = Image.new("RGBA", (r - l + 4, asc + desc + 4), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((2 - l, 2), s, font=f, fill=color)
    return img


def row(*sprites, gap=0):
    """Join sprites on one baseline-ish row (bottom aligned)."""
    w = sum(s.width for s in sprites) + gap * (len(sprites) - 1)
    h = max(s.height for s in sprites)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    x = 0
    for s in sprites:
        img.paste(s, (x, h - s.height), s)
        x += s.width + gap
    return img


def wordmark(size):
    return row(text("eatat", font("serif", size, 700), CREAM), text("ezz", font("serif-i", size, 700), CARAMEL), gap=int(size * 0.02))


def rounded(w, h, r, fill, outline=None):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=fill, outline=outline, width=2 if outline else 0)
    return img


def heart(size, color):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = size * 0.27
    d.ellipse((0, size * 0.12, 2 * r, size * 0.12 + 2 * r), fill=color)
    d.ellipse((size - 2 * r, size * 0.12, size, size * 0.12 + 2 * r), fill=color)
    d.polygon([(size * 0.02, size * 0.36), (size * 0.98, size * 0.36), (size / 2, size * 0.95)], fill=color)
    return img


def star(size, color):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    c, ro, ri = size / 2, size / 2, size / 4.6
    pts = [(c + (ro if i % 2 == 0 else ri) * math.sin(i * math.pi / 5), c - (ro if i % 2 == 0 else ri) * math.cos(i * math.pi / 5)) for i in range(10)]
    ImageDraw.Draw(img).polygon(pts, fill=color)
    return img


# ---------- motion ----------

def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = clamp(x)
    return 3 * x * x - 2 * x * x * x


def prog(t, start, dur):
    return clamp((t - start) / dur)


def enter_exit(t, t_in, t_out, d_in=0.4, d_out=0.3):
    """Opacity and rise for an element that enters at t_in and leaves at t_out."""
    a_in = ease_out(prog(t, t_in, d_in))
    a_out = 1 - ease_in_out(prog(t, t_out, d_out)) if t_out is not None else 1
    return a_in * a_out, (1 - a_in) * 60 - (1 - a_out) * 40


_bg = None


def background():
    global _bg
    if _bg is None:
        y, x = np.mgrid[0:H, 0:W]
        d = np.sqrt(((x - W / 2) / W) ** 2 + ((y - H * 0.42) / H) ** 2)
        k = np.clip(1 - d * 1.6, 0, 1)[..., None] ** 2
        arr = np.array(INK, float) * (1 - k) + np.array(CARD2, float) * k
        arr += np.random.default_rng(3).uniform(-1.5, 1.5, (H, W, 1))  # dither, so the glow doesn't band
        _bg = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    return _bg.copy()


def put(frame, spr, cx, cy, a=1.0, dy=0.0, scale=1.0, anchor="center"):
    if a <= 0.01:
        return
    s = spr
    if abs(scale - 1) > 0.002:
        s = spr.resize((max(1, int(spr.width * scale)), max(1, int(spr.height * scale))), Image.LANCZOS)
    if a < 0.999:
        s = s.copy()
        s.putalpha(s.getchannel("A").point(lambda v: int(v * a)))
    x = int(cx - s.width / 2) if anchor == "center" else int(cx)
    frame.paste(s, (x, int(cy - s.height / 2 + dy)), s)


def fade_all(frame, t, dur, length=0.3):
    """Fade the whole frame to ink at the end of a scene."""
    k = ease_in_out(prog(t, dur - length, length))
    if k > 0:
        return Image.blend(frame, Image.new("RGB", (W, H), INK), k)
    return frame


# ---------- part 1 ----------

def p1_hook(t, dur=3.0):
    f = background()
    eb = text("ROZ KA SAWAAL", font("sans", 40, 600), CARAMEL, tracking=8)
    a, dy = enter_exit(t, 0.0, None)
    put(f, eb, W / 2, 720, a, dy)
    for i, (word, y) in enumerate((("Kya", 900), ("khaun?", 1090))):
        a, dy = enter_exit(t, 0.3 + i * 0.35, None, 0.45)
        put(f, text(word, font("serif", 210, 700), CREAM), W / 2, y, a, dy, scale=0.92 + 0.08 * ease_out(prog(t, 0.3 + i * 0.35, 0.45)))
    a, dy = enter_exit(t, 1.6, None)
    put(f, text("…phir se.", font("serif-i", 64, 400), MUTED), W / 2, 1290, a, dy)
    return fade_all(f, t, dur)


PROBLEMS = [
    ("01", "Best thela?", "Apps pe hai hi nahi.", "Delivery apps skip the street."),
    ("02", "Recommendations?", "Chats mein kho gaye.", "Word of mouth doesn’t scale."),
    ("03", "Group decision?", "Aadha ghanta gaya.", "Nobody wants to pick."),
]


def p1_problems(t, dur=4.5):
    f = background()
    i = min(2, int(t // 1.5))
    lt = t - i * 1.5
    num, q, a_line, sub = PROBLEMS[i]
    out = 1.2 if i < 2 else None
    for k, (spr, y) in enumerate((
        (text(num, font("serif", 120, 700), CARAMEL), 690),
        (text(q, font("serif", 112, 700), CREAM), 880),
        (text(a_line, font("serif-i", 96, 400), BEIGE), 1020),
        (text(sub, font("sans", 46, 400), MUTED), 1170),
    )):
        a, dy = enter_exit(lt, 0.05 + k * 0.08, out, 0.35, 0.3)
        put(f, spr, W / 2, y, a, dy)
    # progress ticks so the three read as one list
    for k in range(3):
        col = CARAMEL if k <= i else LINE
        ImageDraw.Draw(f).rounded_rectangle((W / 2 - 150 + k * 110, 1420, W / 2 - 70 + k * 110, 1428), 4, fill=col)
    return fade_all(f, t, dur, 0.25)


def p1_reveal(t, dur=7.5):
    f = background()
    # "Ab nahi."
    a = ease_out(prog(t, 0.0, 0.4)) * (1 - ease_in_out(prog(t, 0.9, 0.3)))
    put(f, text("Ab nahi.", font("serif", 170, 700), CREAM), W / 2, 960, a, 0, scale=1 + 0.06 * prog(t, 0, 1.2))
    # wordmark rises in, then moves up at 4.2s
    wm = wordmark(200)
    up = ease_in_out(prog(t, 4.2, 0.6))
    wy = 900 - 330 * up
    wscale = 1 - 0.3 * up
    a, dy = enter_exit(t, 1.2, None, 0.5)
    put(f, wm, W / 2, wy, a, dy, scale=(0.94 + 0.06 * ease_out(prog(t, 1.2, 0.5))) * wscale)
    # underline sweep
    sweep = ease_out(prog(t, 1.7, 0.6))
    if sweep > 0:
        lw = int(wm.width * wscale * sweep)
        y = int(wy + 130 * wscale)
        ImageDraw.Draw(f).rounded_rectangle((W / 2 - wm.width * wscale / 2, y, W / 2 - wm.width * wscale / 2 + lw, y + 10), 5, fill=CARAMEL)
    # tagline
    a, dy = enter_exit(t, 2.3, None)
    put(f, text("Kya khaun? Sorted.", font("serif-i", 92, 400), BEIGE), W / 2, wy + 250 * wscale + 30 * up, a, dy)
    # what it is
    lines = [
        (text("Lucknow ka street food,", font("serif", 76, 700), CREAM), 1000),
        (text("Lucknow walon ki zubaani.", font("serif", 76, 700), CREAM), 1100),
        (text("504 spots  ·  60 areas  ·  24 playlists", font("sans", 46, 600), CARAMEL), 1260),
    ]
    for k, (spr, y) in enumerate(lines):
        a, dy = enter_exit(t, 4.7 + k * 0.25, None)
        put(f, spr, W / 2, y, a, dy)
    a, dy = enter_exit(t, 6.0, None)
    pill = rounded(560, 96, 48, None, LINE)
    put(f, pill, W / 2, 1560, a, dy)
    put(f, text("Part 2: kaise kaam karta hai  →", font("sans", 36, 600), MUTED), W / 2, 1560, a, dy)
    return fade_all(f, t, dur, 0.35)


# ---------- part 2 ----------

def title_block(f, t, title, sub, y=420):
    a, dy = enter_exit(t, 0.0, None, 0.4)
    put(f, text(title, font("serif", 120, 700), CREAM), W / 2, y, a, dy)
    a, dy = enter_exit(t, 0.15, None, 0.4)
    put(f, text(sub, font("sans", 46, 400), MUTED), W / 2, y + 120, a, dy)


def p2_numbers(t, dur=3.0):
    f = background()
    a, dy = enter_exit(t, 0.0, None)
    put(f, text("PART 2  ·  KAISE KAAM KARTA HAI", font("sans", 38, 600), CARAMEL, tracking=6), W / 2, 520, a, dy)
    for k, (n, label, y) in enumerate(((504, "food spots", 720), (60, "areas of Lucknow", 1110), (37, "famous dishes", 1500))):
        p = ease_out(prog(t, 0.3 + k * 0.2, 1.1))
        a, dy = enter_exit(t, 0.3 + k * 0.2, None)
        put(f, text(str(round(n * p)), font("serif", 220, 700), BEIGE), W / 2, y - 40, a, dy)
        put(f, text(label, font("sans", 48, 400), MUTED), W / 2, y + 130, a, dy)
    return fade_all(f, t, dur)


_rng = random.Random(7)
DOTS = [(_rng.uniform(0.06, 0.94), _rng.uniform(0.06, 0.94), _rng.random() < 0.45, _rng.uniform(0, 1.2)) for _ in range(70)]


def p2_explore(t, dur=3.0):
    f = background()
    title_block(f, t, "Explore", "Har thela, area, dish aur diet se.")
    a, dy = enter_exit(t, 0.2, None, 0.5)
    mx, my, ms = 110, 700, 860
    put(f, rounded(ms, ms, 40, CARD, LINE), mx, my + ms / 2, a, dy, anchor="left")
    d = ImageDraw.Draw(f)
    if a > 0.5:
        # streets
        for k in range(1, 6):
            d.line((mx + 20, my + k * ms / 6 + dy, mx + ms - 20, my + k * ms / 6 + 30 + dy), fill=LINE, width=3)
            d.line((mx + k * ms / 6, my + 20 + dy, mx + k * ms / 6 - 40, my + ms - 20 + dy), fill=LINE, width=3)
        for x, y, veg, delay in DOTS:
            p = ease_out(prog(t, 0.5 + delay, 0.3))
            if p <= 0:
                continue
            r = 12 * p
            cx, cy = mx + x * ms, my + y * ms + dy
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=VEG if veg else NONVEG)
        # pulsing pin on a chosen spot
        pp = ease_out(prog(t, 1.9, 0.4))
        if pp > 0:
            cx, cy = mx + ms * 0.55, my + ms * 0.48 + dy
            ring = 26 + 18 * (0.5 + 0.5 * math.sin((t - 1.9) * 8))
            d.ellipse((cx - ring, cy - ring, cx + ring, cy + ring), outline=CARAMEL, width=5)
            d.ellipse((cx - 18 * pp, cy - 18 * pp, cx + 18 * pp, cy + 18 * pp), fill=CARAMEL)
    # legend with words, not colour alone
    a2, dy2 = enter_exit(t, 0.9, None)
    leg = row(dot_label("Veg", VEG), dot_label("Non-veg", NONVEG), gap=60)
    put(f, leg, W / 2, 1660, a2, dy2)
    return fade_all(f, t, dur)


def dot_label(s, color):
    lab = text(s, font("sans", 42, 600), CREAM)
    img = Image.new("RGBA", (lab.width + 50, lab.height), (0, 0, 0, 0))
    ImageDraw.Draw(img).ellipse((0, lab.height / 2 - 14, 28, lab.height / 2 + 14), fill=color)
    img.paste(lab, (46, 0), lab)
    return img


DISHES = ["Basket chaat", "Awadhi biryani", "Kulfi falooda", "Makhan malai", "Nihari kulcha", "Tokri chaat", "Sheermal", "Galouti kebab"]


def p2_decide(t, dur=3.0):
    f = background()
    title_block(f, t, "Decide for me", "Ek tap. Ek jawab.")
    a, dy = enter_exit(t, 0.2, None, 0.5)
    cw, ch, cy = 900, 360, 1050
    put(f, rounded(cw, ch, 40, CARD, CARAMEL), W / 2, cy, a, dy)
    if a > 0.3:
        # a reel of dishes that slows and lands on the last one
        item_h = 280
        reel = DISHES * 3
        target = len(reel) - 1
        p = ease_out(prog(t, 0.4, 1.7))
        pos = p * target * item_h
        window = Image.new("RGBA", (cw - 40, ch - 40), (0, 0, 0, 0))
        for i, dish in enumerate(reel):
            y = i * item_h - pos + (ch - 40) / 2
            if -item_h < y < ch:
                landed = i == target and p > 0.98
                spr = text(dish, font("serif", 96, 700), CREAM if landed else BEIGE)
                window.paste(spr, (int((cw - 40 - spr.width) / 2), int(y - spr.height / 2)), spr)
        put(f, window, W / 2, cy, a, dy)
    a3, dy3 = enter_exit(t, 2.15, None, 0.35)
    put(f, text("Chowk  ·  Non-veg", font("sans", 44, 600), CARAMEL), W / 2, cy + 260, a3, dy3)
    put(f, text("Chalo, chalte hain.", font("serif-i", 72, 400), BEIGE), W / 2, cy + 420, a3, dy3)
    return fade_all(f, t, dur)


PLAYLISTS = [("Veg in Hazratganj", "12 spots", VEG), ("Underrated gems", "18 spots", CARAMEL), ("Late-night Lucknow", "15 spots", NONVEG)]


def p2_playlists(t, dur=3.0):
    f = background()
    title_block(f, t, "Food Playlists", "Save karo. Review karo. Share karo.")
    for k, (name, count, col) in enumerate(PLAYLISTS):
        a, dy = enter_exit(t, 0.35 + k * 0.22, None, 0.45)
        y = 860 + k * 250
        card = rounded(900, 210, 32, CARD, LINE)
        d = ImageDraw.Draw(card)
        d.rounded_rectangle((36, 40, 48, 170), 6, fill=col)
        n = text(name, font("serif", 64, 700), CREAM)
        card.paste(n, (84, 40), n)
        c = text(count, font("sans", 38, 400), MUTED)
        card.paste(c, (86, 130), c)
        for s in range(5):
            st = star(40, CARAMEL)
            card.paste(st, (600 + s * 50, 140), st)
        put(f, card, W / 2, y, a, dy)
    a, dy = enter_exit(t, 1.3, None)
    pill = rounded(420, 96, 48, None, CARAMEL)
    put(f, pill, W / 2, 1640, a, dy)
    label = text("Want to try", font("sans", 40, 600), BEIGE)
    hz = Image.new("RGBA", (34, label.height), (0, 0, 0, 0))
    hz.paste(heart(34, CARAMEL), (0, (label.height - 34) // 2 + 2))
    put(f, row(hz, label, gap=18), W / 2, 1640, a, dy)
    return fade_all(f, t, dur)


def p2_cta(t, dur=3.0):
    f = background()
    a, dy = enter_exit(t, 0.0, None, 0.5)
    put(f, wordmark(190), W / 2, 760, a, dy, scale=0.94 + 0.06 * ease_out(prog(t, 0, 0.5)))
    a, dy = enter_exit(t, 0.35, None)
    put(f, text("Kya khaun? Sorted.", font("serif-i", 92, 400), BEIGE), W / 2, 960, a, dy)
    a, dy = enter_exit(t, 0.8, None)
    put(f, rounded(760, 120, 60, CARAMEL), W / 2, 1200, a, dy)
    put(f, text("eatatezz.netlify.app", font("sans", 54, 700), INK), W / 2, 1200, a, dy)
    a, dy = enter_exit(t, 1.1, None)
    put(f, text("Free  ·  Web + App  ·  Lucknow se shuru", font("sans", 40, 400), MUTED), W / 2, 1360, a, dy)
    return fade_all(f, t, dur, 0.4)


PARTS = {
    "part1": [("hook", p1_hook, 3.0), ("problems", p1_problems, 4.5), ("reveal", p1_reveal, 7.5)],
    "part2": [("numbers", p2_numbers, 3.0), ("explore", p2_explore, 3.0), ("decide", p2_decide, 3.0), ("playlists", p2_playlists, 3.0), ("cta", p2_cta, 3.0)],
}

# ---------- sound ----------

SR = 44100


def soundtrack(cuts, dur, seed):
    """Soft 100 bpm pulse: pad, kick, hats, and a swell into each cut."""
    n = int(SR * dur)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    beat = 60 / 100
    chords = [(220.0, 261.6, 329.6), (196.0, 246.9, 293.7), (174.6, 220.0, 261.6), (196.0, 246.9, 329.6)]
    for i in range(int(dur / (beat * 4)) + 1):
        s = int(i * beat * 4 * SR)
        e = min(n, int((i + 1) * beat * 4 * SR))
        if s >= n:
            break
        seg = tt[s:e] - tt[s]
        env = np.minimum(1, seg / 0.4) * np.minimum(1, (beat * 4 - seg) / 0.4)
        for fr in chords[i % 4]:
            out[s:e] += 0.05 * env * (np.sin(2 * np.pi * fr * seg) + 0.3 * np.sin(2 * np.pi * fr * 2 * seg))
    rng = np.random.default_rng(seed)
    for k in range(int(dur / beat) + 1):
        s = int(k * beat * SR)
        if s >= n:
            break
        L = min(n - s, int(0.35 * SR))
        seg = np.arange(L) / SR
        freq = 110 * np.exp(-seg * 18) + 45
        out[s:s + L] += 0.45 * np.exp(-seg * 9) * np.sin(2 * np.pi * np.cumsum(freq) / SR)
        h = int((k + 0.5) * beat * SR)
        if h < n:
            L = min(n - h, int(0.05 * SR))
            noise = rng.standard_normal(L)
            noise = noise - np.concatenate(([0], noise[:-1]))
            out[h:h + L] += 0.04 * np.exp(-np.arange(L) / SR * 70) * noise
    for c in cuts:
        L = int(0.45 * SR)
        s = int(c * SR) - L
        if s < 0:
            continue
        noise = rng.standard_normal(L)
        k = np.ones(40) / 40
        noise = np.convolve(noise, k, mode="same")
        out[s:s + L] += 0.25 * np.linspace(0, 1, L) ** 2 * noise
    fade = int(0.6 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    out[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    out = out / max(1e-9, np.abs(out).max()) * 0.8
    return (out * 32767).astype(np.int16)


def write_wav(path, data):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


# ---------- render ----------

def encode_scene(name, fn, dur):
    final = os.path.join(OUT, "scenes", f"{name}.mp4")
    tmp = os.path.join(OUT, "scenes", f"{name}.part.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", tmp]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(int(round(dur * FPS))):
        p.stdin.write(fn(i / FPS, dur).tobytes())
    p.stdin.close()
    if p.wait() == 0:
        os.replace(tmp, final)
    else:
        sys.exit(f"ffmpeg failed on {name}")
    return final


def render():
    os.makedirs(os.path.join(OUT, "scenes"), exist_ok=True)
    for part, scenes in PARTS.items():
        files, cuts, t = [], [], 0.0
        for name, fn, dur in scenes:
            files.append(encode_scene(f"{part}-{name}", fn, dur))
            t += dur
            cuts.append(t)
        lst = os.path.join(OUT, "scenes", f"{part}.txt")
        with open(lst, "w") as fh:
            fh.writelines(f"file '{f}'\n" for f in files)
        silent = os.path.join(OUT, "scenes", f"{part}-silent.mp4")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", silent], check=True)
        wav = os.path.join(OUT, "scenes", f"{part}.wav")
        write_wav(wav, soundtrack(cuts[:-1], t, seed=1 if part == "part1" else 2))
        final = os.path.join(OUT, f"eatatezz-intro-{part}.mp4")
        tmp = final.replace(".mp4", ".part.mp4")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", tmp], check=True)
        os.replace(tmp, final)
        print(final)


def preview():
    shots = [("part1", 0, 1.6), ("part1", 1, 0.8), ("part1", 2, 3.0), ("part1", 2, 6.8),
             ("part2", 0, 2.0), ("part2", 1, 2.5), ("part2", 2, 2.6), ("part2", 3, 2.0), ("part2", 4, 2.0)]
    os.makedirs(os.path.join(OUT, "preview"), exist_ok=True)
    for part, idx, t in shots:
        name, fn, dur = PARTS[part][idx]
        path = os.path.join(OUT, "preview", f"{part}-{name}-{t}.jpg")
        fn(t, dur).save(path, quality=92)
        print(path)


if __name__ == "__main__":
    {"preview": preview, "render": render}[sys.argv[1]]()
