import type { DayState, DayView } from '../data/days'
import { dayTheme } from '../utils/dayTheme'

// Where each photo's subject sits, so faces stay clear of the text and the wave.
const focus: Record<DayState, string> = {
  active: '35% 60%',
  completed: '62% 30%',
  upcoming: '50% 55%',
  rest: '62% 30%',
  attention: '68% 28%',
}

type Props = {
  day: DayView
  index: number
  count: number
  onSelect: (index: number) => void
  dayName: (index: number) => string
}

// The top of one day: its photo, when it is, and the pagination, easing into the plan card through the wave.
export function DailyHero({ day, index, count, onSelect, dayName }: Props) {
  const tint = dayTheme[day.state].tint
  return (
    <div className="relative h-[clamp(270px,38dvh,320px)] shrink-0">
      <img
        src={day.image}
        alt=""
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: focus[day.state] }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 via-black/15 to-black/0" aria-hidden />

      <div className="relative px-5 pt-[max(env(safe-area-inset-top),3rem)] pr-20 text-white">
        <p className="text-[15px] font-medium text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.25)]">{day.eyebrow}</p>
        <p className="mt-0.5 text-[32px] leading-tight font-bold tracking-[-0.025em] [text-shadow:0_1px_12px_rgb(0_0_0/0.25)]">
          {day.title}
        </p>
      </div>

      {/* Dots: each hit area is a full 44 px, overlapping so the dots themselves sit close together. */}
      <div className="absolute inset-x-0 bottom-[46px] flex justify-center">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show ${dayName(i)}`}
            aria-current={i === index ? 'true' : undefined}
            className="-mx-4 flex size-11 items-center justify-center"
          >
            <span
              className={`h-1.5 rounded-full bg-white transition-all ${i === index ? 'w-4 opacity-100' : 'w-1.5 opacity-55'}`}
            />
          </button>
        ))}
      </div>

      <svg
        className="absolute inset-x-0 -bottom-px h-[56px] w-full"
        viewBox="0 0 390 56"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path className="fill-white/40" d="M0 18 C 70 2, 150 4, 230 22 C 300 38, 350 34, 390 22 L 390 56 L 0 56 Z" />
        <path style={{ fill: tint }} d="M0 28 C 80 10, 160 14, 236 32 C 300 46, 352 44, 390 34 L 390 56 L 0 56 Z" />
      </svg>
    </div>
  )
}
