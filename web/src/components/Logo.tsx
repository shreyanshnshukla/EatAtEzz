/** Text-only wordmark on dark. (The cream/beige icon is retired.) */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-semibold tracking-tight text-cream ${className}`}>
      eatat<span className="italic font-bold text-beige">ezz</span>
    </span>
  );
}
