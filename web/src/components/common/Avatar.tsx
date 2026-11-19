export function Avatar({ name, url, size = 40 }: { name: string; url: string | null; size?: number }) {
  const style = { width: size, height: size };
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element -- Google avatars; next/image would need a remote domain config
    <img src={url} alt="" style={style} referrerPolicy="no-referrer" className="rounded-full border border-line object-cover" />
  ) : (
    <span style={style} className="flex items-center justify-center rounded-full border border-line bg-card-2 font-display text-beige">
      {name.trim().charAt(0).toUpperCase() || "E"}
    </span>
  );
}
