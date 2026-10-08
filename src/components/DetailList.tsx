import { Card } from './Card'

type Item = {
  label: string
  value: string
}

// Stacked label-over-value rows in a card; long values wrap instead of squeezing beside the label.
export function DetailList({ items, className = '' }: { items: Item[]; className?: string }) {
  return (
    <Card className={`px-6 py-2 ${className}`}>
      <dl className="divide-y divide-line">
        {items.map((item) => (
          <div key={item.label} className="py-3.5">
            <dt className="text-sm text-ink-soft">{item.label}</dt>
            <dd className="mt-0.5 text-base font-medium text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
