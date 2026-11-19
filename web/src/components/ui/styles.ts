/** Shared Tailwind class recipes so every page uses the same buttons, cards and fields. */
const BUTTON = {
  primary: "border border-beige/50 bg-beige/10 text-beige hover:bg-beige/20",
  secondary: "border border-line text-cream hover:border-beige",
  danger: "border border-line text-muted hover:border-nonveg hover:text-cream",
  ghost: "text-muted underline-offset-4 hover:text-cream hover:underline",
} as const;

const SIZE = { sm: "px-3 py-2 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3.5 text-base" } as const;

export type ButtonVariant = keyof typeof BUTTON;
export type ButtonSize = keyof typeof SIZE;

export const button = (variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") =>
  `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON[variant]} ${SIZE[size]} ${extra}`;

export const card = "rounded-2xl border border-line bg-card";
export const cardLink = `${card} block transition hover:-translate-y-0.5 hover:border-caramel`;
export const field =
  "h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm text-cream placeholder:text-muted focus:border-beige focus:outline-none";
export const textarea =
  "w-full rounded-xl border border-line bg-ink p-3 text-sm text-cream placeholder:text-muted focus:border-beige focus:outline-none";
export const label = "text-sm text-muted";
