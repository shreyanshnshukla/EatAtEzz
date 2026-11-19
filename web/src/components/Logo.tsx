/** EatAtEzz mark: italic serif E on a beige circle with rising steam (cream / beige / toast only). */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" aria-hidden="true">
      <rect width="240" height="240" rx="56" fill="#F6EEDC" />
      <circle cx="120" cy="142" r="74" fill="#DCC6A0" />
      <path
        d="M96 58c-8-10 8-18 0-28M120 58c-8-10 8-18 0-28M144 58c-8-10 8-18 0-28"
        fill="none"
        stroke="#B08D5E"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <text
        x="118"
        y="190"
        textAnchor="middle"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="130"
        fill="#7A5A36"
      >
        E
      </text>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-semibold tracking-tight ${className}`}>
      EatAt<span className="italic font-bold">E</span>
      <span className="italic font-bold text-beige">zz</span>
    </span>
  );
}
