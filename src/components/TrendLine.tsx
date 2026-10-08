import { useState } from 'react'
import type { TrendPoint } from '../types/progress'

type Props = {
  points: TrendPoint[]
  max: number
  // Accessible name of the chart, e.g. "Pain trend".
  label: string
  formatValue: (value: number) => string
}

const W = 300
const H = 76
const LEFT = 22 // room for the 0 and max tick labels
const RIGHT = 8
const TOP = 10
const BOTTOM = 10

// A single-series sparkline on a fixed 0–max scale, so "stable" honestly reads as flat.
// The readout shows the latest point and follows hover, tap or keyboard focus.
export function TrendLine({ points, max, label, formatValue }: Props) {
  const last = points.length - 1
  const [active, setActive] = useState(last)
  const activeIndex = Math.min(active, last)

  const x = (i: number) => LEFT + (last === 0 ? 0 : (i / last) * (W - LEFT - RIGHT))
  const y = (v: number) => TOP + (1 - v / max) * (H - TOP - BOTTOM)
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.value)}`).join(' ')
  const slot = (W - LEFT - RIGHT) / Math.max(last, 1)

  return (
    <div>
      <p className="text-[13px] text-ink-soft" aria-live="polite">
        {points[activeIndex].label} · <span className="font-medium text-ink">{formatValue(points[activeIndex].value)}</span>
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 block w-full overflow-visible"
        role="group"
        aria-label={label}
        onMouseLeave={() => setActive(last)}
      >
        {[0, max].map((tick) => (
          <g key={tick} aria-hidden>
            <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} className="stroke-line" strokeWidth={1} />
            <text x={0} y={y(tick)} dy="0.35em" className="fill-ink-faint text-[10px]">
              {tick}
            </text>
          </g>
        ))}

        <path
          d={path}
          fill="none"
          className="stroke-accent"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        />

        {points.map((p, i) => (
          <g
            key={i}
            tabIndex={0}
            role="img"
            aria-label={`${p.label}: ${formatValue(p.value)}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className="cursor-pointer outline-none"
          >
            {/* Hit target wider than the mark. */}
            <rect x={x(i) - slot / 2} y={0} width={slot} height={H} fill="transparent" />
            <circle
              cx={x(i)}
              cy={y(p.value)}
              r={i === activeIndex ? 5 : 4}
              className={`stroke-surface ${i === activeIndex ? 'fill-accent' : 'fill-[#a6a2c9]'}`}
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>

      <div className="mt-1.5 flex justify-between pl-[7%] text-[12px] text-ink-faint" aria-hidden>
        <span>{points[0].label}</span>
        <span>{points[last].label}</span>
      </div>
    </div>
  )
}
