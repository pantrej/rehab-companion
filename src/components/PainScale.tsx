type Props = {
  value?: number
  onChange: (value: number) => void
  min: number
  max: number
  minLabel: string
  maxLabel: string
  labelledBy: string
}

// A 0–10 scale as two rows of large targets, so every number stays comfortably tappable at 390px.
export function PainScale({ value, onChange, min, max, minLabel, maxLabel, labelledBy }: Props) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const split = Math.ceil(values.length / 2)
  const rows = [values.slice(0, split), values.slice(split)]

  return (
    <div>
      <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row[0]} className="flex gap-2">
            {row.map((n) => {
              const selected = value === n
              const description = n === min ? `, ${minLabel}` : n === max ? `, ${maxLabel}` : ''
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${n}${description}`}
                  onClick={() => onChange(n)}
                  className={`h-14 flex-1 rounded-2xl border text-[17px] font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    selected
                      ? 'border-accent bg-accent text-white'
                      : 'border-line bg-surface text-ink hover:border-[#d9d4ca]'
                  }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[13px] text-ink-soft" aria-hidden>
        <span>
          {min} — {minLabel}
        </span>
        <span>
          {max} — {maxLabel}
        </span>
      </div>
    </div>
  )
}
