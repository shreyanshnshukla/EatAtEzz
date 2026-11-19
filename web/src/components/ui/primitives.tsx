import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { button, type ButtonSize, type ButtonVariant } from "./styles";

type Look = { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant, size, className = "", ...props }: ComponentProps<"button"> & Look) {
  return <button type="button" className={button(variant, size, className)} {...props} />;
}

export function ButtonLink({ variant, size, className = "", ...props }: ComponentProps<typeof Link> & Look) {
  return <Link className={button(variant, size, className)} {...props} />;
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header>
      {eyebrow ? <p className="text-sm uppercase tracking-[0.2em] text-caramel">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-4xl text-cream md:text-5xl">{title}</h1>
      {children ? <div className="mt-3 max-w-2xl text-muted">{children}</div> : null}
    </header>
  );
}

export function Section({ id, title, aside, children }: { id: string; title: ReactNode; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-12" aria-labelledby={id}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className="font-display text-2xl text-beige md:text-3xl">{title}</h2>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">{children}</div>;
}

export function Grid({ children, cols = 3 }: { children: ReactNode; cols?: 3 | 4 }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3"}`}>{children}</div>
  );
}

export function FormMessage({ state }: { state: { ok: boolean; message?: string; error?: string } }) {
  const text = state.ok ? state.message : state.error;
  return (
    <p aria-live="polite" className={`text-sm ${state.ok ? "text-veg" : "text-nonveg"}`}>
      {text}
    </p>
  );
}

export function Stars({ value, className = "" }: { value: number; className?: string }) {
  const n = Math.round(value);
  return (
    <span className={`text-beige ${className}`} aria-label={`${value.toFixed(1)} out of 5`}>
      {"★".repeat(n)}
      <span className="text-line">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
