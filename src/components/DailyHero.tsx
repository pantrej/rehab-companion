import type { DayState, DayView } from '../data/days'
import { dayTheme } from '../utils/dayTheme'

// Where each photo's subject sits, so faces stay clear of the text and the wave.
const focus: Record<DayState, string> = {
  active: '35% 60%',
  completed: '62% 30%',
  upcoming: '50% 55%',
  rest: '62% 30%',
  attention: '68% 28%',
  missed: '50% 55%',
  open: '62% 30%',
}

type Props = {
  day: DayView
}

// The top of one day: its photo and when it is, easing into the plan card through the wave. The hero
// carries only time — which day this is — and the plan card below says what happens on it. The pagination
// is not part of the photograph: it belongs to the carousel, below the wave.
export function DailyHero({ day }: Props) {
  const tint = dayTheme[day.state].tint
  return (
    <div className="relative h-[var(--hero-h,clamp(270px,38dvh,320px))] shrink-0">
      <img
        src={day.image}
        alt=""
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: focus[day.state] }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 via-black/15 to-black/0" aria-hidden />

      {/* The greeting keeps its row on every day, so the date block sits at the same height across slides. */}
      <div className="relative px-5 pt-[max(env(safe-area-inset-top),3rem)] pr-28 text-white">
        <p className="h-5 text-[15px] font-medium text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.25)]">
          {day.greeting ?? <span aria-hidden>&nbsp;</span>}
        </p>
        <p className="mt-1 text-[32px] leading-tight font-bold tracking-[-0.025em] [text-shadow:0_1px_12px_rgb(0_0_0/0.25)]">
          {day.time}
        </p>
        {/* The date is metadata: a quiet translucent pill, never competing with the day itself. */}
        <p className="mt-2 w-fit rounded-full bg-white/25 px-3.5 py-1.5 text-[14px] font-medium text-white ring-1 ring-white/25 backdrop-blur-md [text-shadow:0_1px_6px_rgb(0_0_0/0.3)]">
          {day.dateLabel}
        </p>
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
