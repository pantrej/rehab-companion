type Props = {
  values: number[]
  max?: number
  label: string
  // Hide "first → latest" when the surrounding row already states it.
  showRange?: boolean
  // The line follows the meaning around it, e.g. coral when something needs attention.
  tone?: keyof typeof tones
  // Wider where there is room for it, e.g. a trend module on Progress.
  width?: number
}

const tones = {
  accent: ['stroke-accent', 'fill-accent'],
  positive: ['stroke-positive', 'fill-positive'],
  rest: ['stroke-rest', 'fill-rest'],
  concern: ['stroke-concern', 'fill-concern'],
}

// A small inline line on a fixed 0–max scale, with the latest point marked and the first → latest values.
export function MiniTrend({ values, max = 10, label, showRange = true, tone = 'accent', width = 96 }: Props) {
  const [line, dot] = tones[tone]
  const W = width
  const H = 28
  const x = (i: number) => 4 + (i / Math.max(values.length - 1, 1)) * (W - 8)
  const y = (v: number) => 4 + (1 - v / max) * (H - 8)
  const last = values.length - 1
  return (
    <div className="flex items-center gap-3">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${values.join(', ')} out of ${max}`}>
        <polyline
          points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          fill="none"
          className={line}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={x(last)} cy={y(values[last])} r={3.5} className={`${dot} stroke-surface`} strokeWidth={2} />
      </svg>
      {showRange && (
        <span className="text-caption font-medium text-ink-soft tabular-nums" aria-hidden>
          {values[0]} → {values[last]}
        </span>
      )}
    </div>
  )
}
