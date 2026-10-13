import { Check } from 'lucide-react'
import { useState } from 'react'
import { TODAY, formatDay } from '../data/calendar'
import type { DayView } from '../data/days'
import { ModalSheet } from './ModalSheet'

// What the plan says about a day, as a dot under its number: orange for a rehabilitation session, blue
// for a recovery day, coral when the reading needs attention, a neutral dash for a session that never
// happened. A day the plan says nothing about, and a day already completed, carry no dot: completion is
// told by the number's own green circle, so no day ever wears two marks.
const dots: Partial<Record<DayView['state'], string>> = {
  active: 'size-1.5 rounded-full bg-planned',
  upcoming: 'size-1.5 rounded-full bg-planned',
  rest: 'size-1.5 rounded-full bg-rest',
  attention: 'size-1.5 rounded-full bg-concern',
  missed: 'h-0.5 w-2 rounded-full bg-ink-faint',
}

// How the number itself is dressed. Selected wins over today, which wins over a completed day, so a
// single circle always carries the day's most important state.
function circleClass(day: DayView, isToday: boolean, isSelected: boolean) {
  if (isSelected) return 'bg-accent font-semibold text-white'
  if (isToday) return 'font-semibold text-accent ring-[1.5px] ring-accent'
  if (day.state === 'completed') return day.outcome === 'partial' ? 'text-positive ring-[1.5px] ring-positive' : 'bg-positive-soft font-semibold text-positive'
  if (day.state === 'open') return 'text-ink-faint'
  if (day.state === 'rest' || day.state === 'upcoming') return 'text-ink-soft'
  return 'text-ink'
}

// One cell: the number, and directly under it the slot its status lives in. The slot is always there,
// so every date in the month sits on the same baseline whether or not it has anything to say.
function DayCell({ day, isToday, isSelected, onSelect }: { day: DayView; isToday: boolean; isSelected: boolean; onSelect: () => void }) {
  const dot = isSelected && day.state === 'completed' ? undefined : dots[day.state]
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${formatDay(day.date)}: ${day.activity.label}${isToday ? ', today' : ''}`}
      aria-current={isToday ? 'date' : undefined}
      aria-pressed={isSelected}
      className="flex h-13 flex-col items-center gap-1 rounded-2xl pt-1.5 transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span
        className={`flex size-9 items-center justify-center rounded-full text-[15px] tabular-nums ${circleClass(day, isToday, isSelected)}`}
      >
        {day.date.getDate()}
      </span>
      <span className="flex h-1.5 w-2 items-center justify-center" aria-hidden>
        {dot && <span className={dot} />}
      </span>
    </button>
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
              {days.map((day) => (
                <DayCell
                  key={day.date.getDate()}
                  day={day}
                  isToday={day.offset === 0}
                  isSelected={day.date.getTime() === (picked ?? selected).getTime()}
                  onSelect={() => {
                    setPicked(day.date)
                    dismiss(() => onSelect(day.date))
                  }}
                />
              ))}
            </div>
          </div>

          {/* The legend shows the same marks the grid does, at the same size. */}
          <div className="flex shrink-0 items-center justify-center gap-5 px-6 pt-3 text-caption text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-2 items-center justify-center" aria-hidden>
                <span className={dots.upcoming} />
              </span>
              Session
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-2 items-center justify-center" aria-hidden>
                <span className={dots.rest} />
              </span>
              Recovery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-positive-soft" aria-hidden>
                <Check className="size-3 text-positive" strokeWidth={3} />
              </span>
              Completed
            </span>
          </div>
        </>
      )}
    </ModalSheet>
  )
}
