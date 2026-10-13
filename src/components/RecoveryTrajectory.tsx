type Props = {
  // Pain at each recent check-in, oldest first.
  values: number[]
  // The person's own range across those check-ins, drawn as the band behind the line.
  low: number
  high: number
  // Coral when the reading isn't on track; the brand's purple otherwise.
  tone: 'accent' | 'concern'
  label: string
}

const W = 300
const H = 54
const PAD = 10

// The recent check-ins as one quiet line inside the range they stayed in: how far apart they were, which
// way they went, and whether they held their pattern. No axes, no grid, no numbers — the sentence beside
// it says what it means, and the trend cards below hold the detail.
export function RecoveryTrajectory({ values, low, high, tone, label }: Props) {
  // A little room either side of the band, so a steady line still reads as a line rather than a rule.
  const top = Math.max(0, low - 1.5)
  const bottom = Math.min(10, high + 1.5)
  const y = (v: number) => PAD + ((v - top) / Math.max(bottom - top, 1)) * (H - PAD * 2)
  const x = (i: number) => PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2)
  const last = values.length - 1
  const line = tone === 'concern' ? 'stroke-concern' : 'stroke-accent'
  const dot = tone === 'concern' ? 'fill-concern' : 'fill-accent'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {/* The usual range, as the quiet ground the line sits on. */}
      <rect
        x={0}
        y={y(low)}
        width={W}
        height={Math.max(y(high) - y(low), 12)}
        rx={6}
        className="fill-white/80"
      />
      <polyline
        points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
        fill="none"
        className={line}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 4.5 : 3} className={`${dot} ${i === last ? 'stroke-white' : ''}`} strokeWidth={2} />
      ))}
    </svg>
  )
}
