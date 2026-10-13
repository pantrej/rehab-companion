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

// What one day holds, in the same words the day itself uses on Home, so a date never reads two ways.
// Nothing is invented: a day the plan said nothing about says exactly that, and a check-in line appears
// only where a check-in was recorded.
function DayDetail({ day }: { day: DayView }) {
  const checkIn = day.calendar?.checkIn
  // A past day with nothing planned would otherwise say so twice; everywhere else the focus line adds something.
  const quiet = day.state === 'open' && day.offset < 0
  const lines = (quiet ? [day.activity.meta] : [day.activity.focus, day.activity.meta]).map((line) =>
    line.replace(/\.$/, ''),
  )

  return (
    <div className="rounded-2xl bg-canvas px-4 py-3">
      <p className="text-caption text-ink-soft">
        {formatDay(day.date)}
        {day.offset === 0 ? ' · Today' : ''}
      </p>
      <p className="mt-0.5 text-[17px] leading-snug font-semibold text-ink">{day.activity.label}</p>
      <p className="mt-0.5 text-[15px] leading-snug text-ink-soft">{lines.join(' · ')}</p>
      {checkIn && (
        <p className="mt-2 border-t border-line pt-2 text-[13px] leading-snug text-ink-soft tabular-nums">
          Check-in · Pain {checkIn.pain}/10 · Difficulty {checkIn.difficulty}/10 · {checkIn.movement}
        </p>
      )}
    </div>
  )
}

const weekdayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Picking a date does one of two things, and the screen that opens the calendar says which.
// 'navigate' (Home): the choice moves the screen behind the sheet to that day, so the sheet leaves with it.
// 'inspect' (Progress): the screen behind stays where it is, and the day answers inside the sheet.
export type CalendarMode = 'navigate' | 'inspect'

type Props = {
  // The whole month, built from the same day data as the carousel.
  days: DayView[]
  // The day the calendar opens on, where the screen behind it has one.
  selected?: Date
  mode?: CalendarMode
  onSelect?: (date: Date) => void
  onClose: () => void
}

// Navigation across the rehabilitation schedule: a modal bottom sheet over the screen, which stays
// visible behind it. One calendar serves both screens; only what a tap means changes.
export function DayCalendarSheet({ days, selected, mode = 'navigate', onSelect, onClose }: Props) {
  // The day tapped fills straight away, so the choice registers before the sheet leaves or answers.
  const [picked, setPicked] = useState<Date>()
  const month = TODAY.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const leading = (days[0].date.getDay() + 6) % 7 // Monday-first grid
  const active = picked ?? selected
  const detail = mode === 'inspect' && picked ? days.find((day) => day.date.getTime() === picked.getTime()) : undefined
  // The calendar stands the same height on both screens. Asking about a day grows the sheet by exactly
  // that answer, so no room is held open for a detail area that may never be needed.
  const height = detail ? 'h-[70%] max-h-[76%] min-h-[520px]' : 'h-[55%] max-h-[65%] min-h-[400px]'

  return (
    <ModalSheet title={month} onClose={onClose} closeLabel="Close calendar" heightClass={height}>
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
                  isSelected={!!active && day.date.getTime() === active.getTime()}
                  onSelect={() => {
                    if (mode === 'inspect') {
                      setPicked(day.date)
                      return
                    }
                    setPicked(day.date)
                    dismiss(() => onSelect?.(day.date))
                  }}
                />
              ))}
            </div>
          </div>

          {/* The day asked about answers here, directly under the grid it was tapped in. The region grows
              in place, so the calendar above it never moves. */}
          <div
            className={`grid shrink-0 px-5 transition-[grid-template-rows] duration-300 ease-out ${
              detail ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
            aria-live="polite"
          >
            <div className="overflow-hidden">{detail && <div className="pt-2"><DayDetail day={detail} /></div>}</div>
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
