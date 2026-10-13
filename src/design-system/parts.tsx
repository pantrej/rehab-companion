import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Swatch } from './foundations'

// Editorial presentation pieces for the design system page. They frame the real product
// components with type, space and dividers rather than boxes; none of them ship in the app.

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-semibold tracking-[0.18em] text-accent uppercase">{children}</p>
}

// A section opening: eyebrow, a confident heading and a short standfirst, kept to a narrow measure.
export function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="max-w-[34rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[34px] leading-[1.08] font-semibold tracking-[-0.025em] text-ink lg:text-[42px]">{title}</h2>
      {intro && <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">{intro}</p>}
    </header>
  )
}

// One component family: rationale on one side, a single large example on a tinted plane on the other,
// supporting states underneath. `flip` alternates the sides down the page.
export function Showcase({
  id,
  title,
  rationale,
  primary,
  states,
  flip = false,
}: {
  id: string
  title: string
  rationale: ReactNode
  primary: ReactNode
  states?: { label: string; node: ReactNode }[]
  flip?: boolean
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-24 gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
      <div className={`lg:col-span-4 ${flip ? 'lg:order-2 lg:col-start-9' : ''} lg:pt-6`}>
        <h3 id={`${id}-title`} className="text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h3>
        <div className="mt-4 flex flex-col gap-3 text-[17px] leading-relaxed text-ink-soft">{rationale}</div>
      </div>
      <div className={`flex min-w-0 flex-col gap-8 lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-6'}`}>
        <div className="rounded-[28px] bg-subtle/70 px-6 py-10 sm:px-12 sm:py-14">{primary}</div>
        {states && (
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {states.map((s) => (
              <figure key={s.label} className="flex flex-col gap-3">
                <figcaption className="text-[12px] font-semibold tracking-[0.14em] text-ink-faint uppercase">{s.label}</figcaption>
                {s.node}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Reads the live token, so the page can never drift from src/styles/index.css. Client-only page.
function useCssColor(token: string) {
  const [value] = useState(() => getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim())
  return value
}

// Colour as a continuous strip of paint chips, labelled underneath; no swatch cards.
export function ColourStrip({ swatches, tall = false }: { swatches: Swatch[]; tall?: boolean }) {
  return (
    <div>
      <div className={`flex overflow-hidden rounded-[22px] ring-1 ring-ink/5 ${tall ? 'h-44' : 'h-32'}`}>
        {swatches.map((s) => (
          <div key={s.token} className="flex-1" style={{ background: `var(--color-${s.token})` }} />
        ))}
      </div>
      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${swatches.length}, minmax(0, 1fr))` }}>
        {swatches.map((s) => (
          <SwatchLabel key={s.token} swatch={s} />
        ))}
      </div>
    </div>
  )
}

function SwatchLabel({ swatch }: { swatch: Swatch }) {
  const hex = useCssColor(swatch.token)
  return (
    <div className="min-w-0">
      <p className="truncate text-[15px] font-semibold text-ink">{swatch.name}</p>
      <p className="text-[12px] tracking-wide text-ink-faint tabular-nums">{hex.toUpperCase()}</p>
      <p className="mt-1 hidden text-[13px] leading-snug text-ink-soft sm:block">{swatch.usage}</p>
    </div>
  )
}

// A phone-sized frame for in-context compositions. Real components at real size.
export function PhoneFrame({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`flex w-full max-w-[340px] flex-col items-center gap-5 ${className}`}>
      <div className="w-full rounded-[44px] bg-ink/90 p-[7px] shadow-[0_40px_80px_-40px_rgb(29_28_33/0.45)]">
        <div className="flex h-[620px] flex-col gap-6 overflow-hidden rounded-[38px] bg-canvas px-5 pt-12 pb-5">{children}</div>
      </div>
      <figcaption className="text-[13px] font-medium text-ink-soft">{title}</figcaption>
    </figure>
  )
}
