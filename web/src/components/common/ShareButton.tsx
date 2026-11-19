"use client";

import { useState } from "react";
import { button } from "@/components/ui/styles";

/** Native share sheet on phones, copy-link fallback on desktop. */
export function ShareButton({ title, text, path }: { title: string; text?: string; path: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      await navigator.share({ title, text, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={share} className={button("secondary")}>
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
