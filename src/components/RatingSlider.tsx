import type { CSSProperties } from 'react'

type Props = {
  id: string
  // The question this answers, as the control's accessible name.
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  // What each end of the scale means, shown under it and read out at the ends.
  minLabel: string
  maxLabel: string
}

// One slider for everything the session rates, so pain and difficulty are answered the same way.
// The number is stated in full above the track: the value is never left to the colour or the position
// of the thumb alone.
export function RatingSlider({ id, label, value, onChange, min = 0, max = 10, minLabel, maxLabel }: Props) {
  const fill = ((value - min) / (max - min)) * 100
  const ends = value === min ? `, ${minLabel}` : value === max ? `, ${maxLabel}` : ''

  return (
    <div>
      <p className="flex items-baseline gap-1.5 tabular-nums">
        <span className="text-[34px] leading-none font-semibold tracking-[-0.02em] text-ink">{value}</span>
        <span className="text-[17px] text-ink-soft">/ {max}</span>
      </p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${value} out of ${max}${ends}`}
        style={{ '--fill': `${fill}%` } as CSSProperties}
        className="rating-slider mt-2.5 focus-visible:outline-none"
      />
      <div className="flex justify-between text-caption text-ink-soft">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
