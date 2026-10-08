import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  // Quiet context on the right of the title, e.g. "Last 7 days".
  aside?: string
  children: ReactNode
}

// A titled group of content on a screen.
export function Section({ id, title, aside, children }: Props) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between px-1">
        <h2 id={id} className="text-lg font-semibold text-ink">
          {title}
        </h2>
        {aside && <span className="text-[13px] text-ink-faint">{aside}</span>}
      </div>
      {children}
    </section>
  )
}
