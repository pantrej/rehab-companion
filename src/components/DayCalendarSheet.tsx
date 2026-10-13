import { TODAY, formatDay } from '../data/calendar'
import type { DayState, DayView } from '../data/days'
import { Sheet } from './Sheet'

// One mark per day state, in the same shapes and colours the rest of the app uses for these meanings:
// orange for a planned rehabilitation session, green for one that ran, blue for a recovery day.
const marks: Record<DayState, string> = {
  active: 'size-1.5 rounded-full bg-planned',
  attention: 'size-1.5 rounded-full bg-concern',
  upcoming: 'size-1.5 rounded-full bg-planned',
  completed: 'size-1.5 rounded-full bg-positive',
  rest: 'size-1.5 rounded-full bg-rest',
  missed: 'h-0.5 w-2 rounded-full bg-ink-faint',
}

// Every mark sits in the same 6px slot, so the dates stay on one baseline.
function Mark({ shape }: { shape: string }) {
  return (
    <span className="flex h-1.5 w-2 items-center justify-center" aria-hidden>
      <span className={shape} />
    </span>
  )
}

const markFor = (day: DayView) =>
  day.outcome === 'partial' ? 'size-1.5 rounded-full ring-[1.5px] ring-positive' : marks[day.state]

const weekdayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type Props = {
  // The whole month, built from the same day data as the carousel.
  days: DayView[]
  selected: Date
  onSelect: (date: Date) => void
  onClose: () => void
}

// Navigation across the rehabilitation schedule: the month, one tap to any day. The carousel stays the
// quick way between nearby days; this is how a day further out is reached.
export function DayCalendarSheet({ days, selected, onSelect, onClose }: Props) {
  const month = TODAY.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const leading = (days[0].date.getDay() + 6) % 7 // Monday-first grid

  return (
    <Sheet title={month} onClose={onClose}>
      <div className="mt-5 grid grid-cols-7 text-center text-[12px] text-ink-faint" aria-hidden>
        {weekdayInitials.map((initial, i) => (
          <span key={i}>{initial}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: leading }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden />
        ))}
        {days.map((day) => {
          const isToday = day.offset === 0
          const isSelected = day.date.getTime() === selected.getTime()
          return (
            <button
              key={day.date.getDate()}
              type="button"
              onClick={() => onSelect(day.date)}
              aria-label={`${formatDay(day.date)}: ${day.activity.label}${isToday ? ', today' : ''}`}
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={isSelected}
              className="flex h-11 flex-col items-center justify-center gap-1 rounded-xl transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span
                className={`flex size-8 items-center justify-center rounded-full text-[15px] tabular-nums ${
                  isSelected
                    ? 'bg-accent font-semibold text-white'
                    : isToday
                      ? 'bg-accent-soft font-semibold text-accent ring-[1.5px] ring-accent'
                      : day.state === 'rest' || day.state === 'upcoming'
                        ? 'text-ink-soft'
                        : 'text-ink'
                }`}
              >
                {day.date.getDate()}
              </span>
              <Mark shape={markFor(day)} />
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-caption text-ink-soft">
        <span className="flex items-center gap-1.5">
          <Mark shape={marks.upcoming} />
          Planned session
        </span>
        <span className="flex items-center gap-1.5">
          <Mark shape={marks.completed} />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <Mark shape={marks.rest} />
          Recovery day
        </span>
      </div>
    </Sheet>
  )
}
