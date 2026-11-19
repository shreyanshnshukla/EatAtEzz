export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-semibold tracking-tight text-cream ${className}`}>
      eatat<span className="font-bold italic text-beige">ezz</span>
    </span>
  );
}
