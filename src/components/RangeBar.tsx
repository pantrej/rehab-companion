type Props = {
  value: number
  low: number
  high: number
  max?: number
  // What is being measured, for the accessible name.
  label: string
}

// Where the latest value sits against the person's own usual range, on a fixed 0–max scale.
// It compares you with yourself, never with a population norm.
export function RangeBar({ value, low, high, max = 10, label }: Props) {
  const pct = (v: number) => `${(v / max) * 100}%`
  const within = value >= low && value <= high
  return (
    <div role="img" aria-label={`${label}: latest ${value} out of ${max}, usual range ${low} to ${high}`}>
      <div className="relative h-2.5 rounded-full bg-subtle">
        <span
          className="absolute inset-y-0 rounded-full bg-positive-soft ring-1 ring-positive/25"
          style={{ left: pct(low), width: `max(${pct(high - low)}, 0.75rem)` }}
          aria-hidden
        />
        <span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-[3px] ring-surface"
          style={{ left: pct(value) }}
          aria-hidden
        />
      </div>
      <div className="mt-2 flex justify-between text-caption text-ink-faint" aria-hidden>
        <span>0</span>
        <span>
          {within ? 'Within' : 'Outside'} your usual range · {low}–{'⁠'}
          {high}
        </span>
        <span>{max}</span>
      </div>
    </div>
  )
}
