import { Check } from 'lucide-react'
import { useState } from 'react'
import { TODAY, formatDay } from '../data/calendar'
import type { DayView } from '../data/days'
import { ModalSheet } from './ModalSheet'

// One mark per day, in the colours the rest of the app already uses for these meanings: orange for a
// rehabilitation session, blue for a recovery day, a green tick for a session that ran. Recovery sits
// a size below a session, so the rhythm of the plan reads before its rest days do.
function Mark({ day }: { day: DayView }) {
  const shape =
    day.state === 'open'
      ? ''
      : day.state === 'completed'
      ? 'tick'
      : day.outcome === 'partial'
        ? 'size-1.5 rounded-full ring-[1.5px] ring-positive'
        : day.state === 'missed'
          ? 'h-0.5 w-2 rounded-full bg-ink-faint'
          : day.state === 'rest'
            ? 'size-1 rounded-full bg-rest'
            : day.state === 'attention'
              ? 'size-1.5 rounded-full bg-concern'
              : 'size-1.5 rounded-full bg-planned'
  return (
    <span className="flex h-3 w-3 items-center justify-center" aria-hidden>
      {shape === 'tick' ? <Check className="size-3 text-positive" strokeWidth={3} /> : shape && <span className={shape} />}
    </span>
  )
}

const weekdayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type Props = {
  // The whole month, built from the same day data as the carousel.
  days: DayView[]
  selected: Date
  onSelect: (date: Date) => void
  onClose: () => void
}

// Navigation across the rehabilitation schedule: a modal bottom sheet over Home, which stays visible
// behind it. The carousel remains the quick way between nearby days; this reaches the rest of the plan.
export function DayCalendarSheet({ days, selected, onSelect, onClose }: Props) {
  // The day tapped fills straight away, so the choice registers before the sheet leaves.
  const [picked, setPicked] = useState<Date>()
  const month = TODAY.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const leading = (days[0].date.getDay() + 6) % 7 // Monday-first grid

  return (
    <ModalSheet title={month} onClose={onClose} closeLabel="Close calendar" heightClass="h-[55%] max-h-[65%] min-h-[400px]">
      {(dismiss) => (
        <>
          <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4">
            <div className="grid grid-cols-7 text-center text-[12px] text-ink-faint" aria-hidden>
              {weekdayInitials.map((initial, i) => (
                <span key={i}>{initial}</span>
              ))}
            </div>

            <div className="mt-1.5 grid grid-cols-7">
              {Array.from({ length: leading }, (_, i) => (
                <span key={`blank-${i}`} aria-hidden />
              ))}
              {days.map((day) => {
                const isToday = day.offset === 0
                const isSelected = day.date.getTime() === (picked ?? selected).getTime()
                return (
                  <button
                    key={day.date.getDate()}
                    type="button"
                    onClick={() => {
                      setPicked(day.date)
                      dismiss(() => onSelect(day.date))
                    }}
                    aria-label={`${formatDay(day.date)}: ${day.activity.label}${isToday ? ', today' : ''}`}
                    aria-current={isToday ? 'date' : undefined}
                    aria-pressed={isSelected}
                    className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {/* Today is outlined; the day being viewed is filled. When they are the same day, the
                        filled circle keeps its outline, a ring out, so both still read. */}
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-[15px] tabular-nums ${
                        isSelected
                          ? `bg-accent font-semibold text-white${isToday ? ' ring-[1.5px] ring-accent ring-offset-2 ring-offset-surface' : ''}`
                          : isToday
                            ? 'font-semibold text-accent ring-[1.5px] ring-accent'
                            : day.state === 'open'
                              ? 'text-ink-faint'
                              : day.state === 'rest' || day.state === 'upcoming'
                                ? 'text-ink-soft'
                                : 'text-ink'
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    <Mark day={day} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex shrink-0 justify-center gap-5 px-6 pt-3 text-caption text-ink-soft">
            {legend.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <Mark day={item.day} />
                {item.label}
              </span>
            ))}
          </div>
        </>
      )}
    </ModalSheet>
  )
}

// The legend reads from the same marks as the grid, so the two can never drift apart.
const legend = [
  { label: 'Session', day: { state: 'upcoming' } as DayView },
  { label: 'Recovery', day: { state: 'rest' } as DayView },
  { label: 'Completed', day: { state: 'completed' } as DayView },
]
