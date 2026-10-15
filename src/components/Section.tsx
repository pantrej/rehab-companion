import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  // Quiet context on the right of the title, e.g. "Last 7 days".
  aside?: string
  children: ReactNode
}

// A titled group of content on a screen. The heading aligns with the card edge below it.
export function Section({ id, title, aside, children }: Props) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-section font-semibold text-ink">
          {title}
        </h2>
        {aside && <span className="text-caption text-ink-faint">{aside}</span>}
      </div>
      {children}
    </section>
  )
}
