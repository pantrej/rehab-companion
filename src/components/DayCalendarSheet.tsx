import { Check, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { TODAY, formatDay } from '../data/calendar'
import type { DayView } from '../data/days'
import { appFrameId } from '../layouts/MobileLayout'

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
// Far enough that a flick closes the sheet, short enough that a nudge doesn't.
const dismissAfter = 96

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
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const month = TODAY.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const leading = (days[0].date.getDay() + 6) % 7 // Monday-first grid

  // Leaving: the sheet slides back down to the bottom edge it came from, and the backdrop fades with it,
  // before the day it was opened over (or the day just picked) takes over.
  const [leaving, setLeaving] = useState(false)
  const [picked, setPicked] = useState<Date>()
  const dismiss = (then: () => void) => {
    if (leaving) return
    setLeaving(true)
    setDrag(sheetRef.current?.offsetHeight ?? 600)
    window.setTimeout(then, 220)
  }

  // Dragging the sheet down dismisses it; anything short of that springs back.
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const from = useRef<number | undefined>(undefined)
  const onPointerDown = (e: ReactPointerEvent) => {
    from.current = e.clientY
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (from.current !== undefined) setDrag(Math.max(0, e.clientY - from.current))
  }
  const endDrag = () => {
    if (from.current === undefined) return
    from.current = undefined
    setDragging(false)
    if (drag > dismissAfter) dismiss(onClose)
    else setDrag(0)
  }

  useEffect(() => {
    sheetRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(onClose)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // The handlers close over state that only ever moves one way: opened, then leaving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  return createPortal(
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      {/* Home stays visible underneath, dimmed and softened; the tab bar dims with it. */}
      <button
        type="button"
        aria-label="Close calendar"
        onClick={() => dismiss(onClose)}
        className={`animate-fade-in absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px] transition-opacity duration-200 ${
          leaving ? 'opacity-0' : ''
        }`}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ transform: drag ? `translateY(${drag}px)` : undefined, transition: dragging ? 'none' : undefined }}
        className={`relative flex h-[55%] max-h-[65%] min-h-[400px] flex-col rounded-t-[2rem] bg-surface pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-raised outline-none transition-transform duration-200 motion-reduce:transition-none ${
          leaving ? '' : 'animate-sheet-rise'
        }`}
      >
        {/* The handle and the title are the grab area: dragging either one pulls the sheet down. The close
            button sits outside it, so a tap on it is a tap, not the start of a drag. */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="shrink-0 touch-none pt-3"
        >
          <span className="mx-auto block h-1 w-9 rounded-full bg-line" aria-hidden />
          <h2
            id={titleId}
            className="flex h-11 items-center pt-2 pr-16 pl-6 text-[20px] leading-tight font-semibold tracking-[-0.015em] text-ink"
          >
            {month}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => dismiss(onClose)}
          aria-label="Close calendar"
          className="absolute top-5 right-3 flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>

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
      </div>
    </div>,
    document.getElementById(appFrameId) ?? document.body,
  )
}

// The legend reads from the same marks as the grid, so the two can never drift apart.
const legend = [
  { label: 'Session', day: { state: 'upcoming' } as DayView },
  { label: 'Recovery', day: { state: 'rest' } as DayView },
  { label: 'Completed', day: { state: 'completed' } as DayView },
]
