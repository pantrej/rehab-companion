import type { ReactNode } from 'react'
import { Card } from './Card'

type Item = {
  label: string
  value: string
  icon?: ReactNode
}

// Stacked label-over-value rows in a card; long values wrap instead of squeezing beside the label.
export function DetailList({ items, className = '' }: { items: Item[]; className?: string }) {
  return (
    <Card className={`px-6 py-2 ${className}`}>
      <dl className="divide-y divide-line">
        {items.map((item) => (
          <div key={item.label} className={`relative py-3.5 ${item.icon ? 'pl-14' : ''}`}>
            <dt className="text-sm text-ink-soft">
              {item.icon && (
                <span
                  className="absolute top-1/2 left-0 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-accent-soft/70 text-accent"
                  aria-hidden
                >
                  {item.icon}
                </span>
              )}
              {item.label}
            </dt>
            <dd className="mt-0.5 text-base font-medium text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
