import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Swatch } from './foundations'

// Presentation pieces for the design system page. They frame the real product components;
// they are not used in the app itself.

export function DSSection({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string
  index: string
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-14 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-14">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-caption font-semibold tracking-[0.12em] text-accent">{index}</p>
          <h2 id={`${id}-title`} className="mt-2 text-[30px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h2>
          <p className="mt-3 text-body text-ink-soft">{intro}</p>
        </header>
        <div className="flex min-w-0 flex-col gap-6">{children}</div>
      </div>
    </section>
  )
}

// A framed specimen: label, optional note, and the real component on the canvas it lives on.
export function Specimen({
  label,
  note,
  children,
  className = '',
  surface = 'canvas',
}: {
  label: string
  note?: string
  children: ReactNode
  className?: string
  surface?: 'canvas' | 'surface'
}) {
  return (
    <figure className={`overflow-hidden rounded-[24px] bg-surface shadow-card ${className}`}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-6 py-4">
        <span className="text-caption font-semibold tracking-[0.08em] text-ink uppercase">{label}</span>
        {note && <span className="text-caption text-ink-soft">{note}</span>}
      </figcaption>
      <div className={`p-6 ${surface === 'canvas' ? 'bg-canvas' : 'bg-surface'}`}>{children}</div>
    </figure>
  )
}

// A short usage rule under a specimen.
export function Rule({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

function useCssColor(token: string) {
  const [value, setValue] = useState('')
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim())
  }, [token])
  return value
}

export function SwatchTile({ swatch }: { swatch: Swatch }) {
  const hex = useCssColor(swatch.token)
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-surface shadow-card">
      <div
        className="flex h-24 items-end p-3 ring-1 ring-ink/5 ring-inset"
        style={{ background: `var(--color-${swatch.token})` }}
      >
        <span className={`text-caption font-semibold ${swatch.onDark ? 'text-white/90' : 'text-ink/70'}`}>
          {hex.toUpperCase()}
        </span>
      </div>
      <div className="px-3 py-3">
        <p className="text-[15px] font-semibold text-ink">{swatch.name}</p>
        <p className="text-caption text-ink-faint">{swatch.token}</p>
        <p className="mt-1 text-caption text-ink-soft">{swatch.usage}</p>
      </div>
    </div>
  )
}

// A phone-width frame for usage examples. Real components, real data, at real size.
export function PhoneFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="flex w-full max-w-[360px] flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-[40px] bg-canvas p-2 shadow-[0_30px_60px_-30px_rgb(29_28_33/0.35)] ring-1 ring-ink/10">
        <div className="flex h-[640px] flex-col gap-6 overflow-hidden rounded-[32px] bg-canvas px-4 pt-10 pb-4">{children}</div>
      </div>
      <figcaption className="text-caption font-medium text-ink-soft">{title}</figcaption>
    </figure>
  )
}
