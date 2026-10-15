import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import type { Movement } from '../types/progress'

const marks: Record<Movement, { icon: typeof ArrowUp; className: string }> = {
  Better: { icon: ArrowUp, className: 'bg-positive-soft text-positive' },
  'About the same': { icon: Minus, className: 'bg-subtle text-ink-soft' },
  Worse: { icon: ArrowDown, className: 'bg-attention-soft text-attention' },
}

// Each check-in's movement comparison, oldest first. Shape carries the meaning as well as colour.
export function MovementMarks({ values }: { values: Movement[] }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label={`Movement at each check-in: ${values.join(', ')}`}>
      {values.map((v, i) => {
        const { icon: Icon, className } = marks[v]
        return (
          <li key={i} className={`flex size-7 items-center justify-center rounded-full ${className}`} aria-hidden>
            <Icon className="size-3.5" strokeWidth={2.5} />
          </li>
        )
      })}
      <li className="ml-1.5 text-caption text-ink-faint" aria-hidden>
        Latest →
      </li>
    </ol>
  )
}
