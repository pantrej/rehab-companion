import { TODAY, formatDay } from '../data/calendar'
import type { CalendarDay, DayStatus } from '../data/calendar'
import { Card } from './Card'

export const statusLabels: Record<DayStatus, string> = {
  completed: 'Completed',
  partial: 'Partially completed',
  skipped: 'Skipped',
  rest: 'Rest day',
  today: 'Today',
  upcoming: 'Upcoming',
}

// Subtle marks, told apart by shape as well as colour: dot, ring, dash, diamond.
// Every mark sits in the same 6px slot, so dates stay on one baseline.
function Mark({ status, appointment }: { status: DayStatus; appointment?: boolean }) {
  const shape = appointment
    ? 'size-1.5 rotate-45 bg-accent'
    : status === 'completed'
      ? 'size-1.5 rounded-full bg-positive'
      : status === 'partial'
        ? 'size-1.5 rounded-full ring-[1.5px] ring-positive'
        : status === 'skipped'
          ? 'h-0.5 w-2 rounded-full bg-ink-faint'
          : ''
  return (
    <span className="flex h-1.5 w-2 items-center justify-center" aria-hidden>
      {shape && <span className={shape} />}
    </span>
  )
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type Props = {
  days: CalendarDay[]
  onSelect: (day: CalendarDay) => void
  showAppointments: boolean
}

export function MonthCalendar({ days, onSelect, showAppointments }: Props) {
  const leading = (days[0].date.getDay() + 6) % 7 // Monday-first grid
  const month = TODAY.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const legend: { status: DayStatus; appointment?: boolean; label: string }[] = [
    { status: 'completed', label: 'Completed' },
    { status: 'partial', label: 'Partial' },
    { status: 'skipped', label: 'Skipped' },
    ...(showAppointments ? [{ status: 'rest' as const, appointment: true, label: 'Appointment' }] : []),
  ]

  return (
    <Card className="px-3 pt-5 pb-4">
      <p className="px-3 text-[17px] font-semibold text-ink">{month}</p>

      <div className="mt-4 grid grid-cols-7 text-center text-[12px] text-ink-faint" aria-hidden>
        {weekdays.map((d) => (
          <span key={d}>{d.slice(0, 1)}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-1">
        {Array.from({ length: leading }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden />
        ))}
        {days.map((day) => {
          const isToday = day.status === 'today'
          const muted = day.status === 'rest' || day.status === 'upcoming'
          const label = `${formatDay(day.date)}: ${statusLabels[day.status]}${day.appointment ? ', appointment' : ''}`
          return (
            <button
              key={day.date.getDate()}
              type="button"
              aria-label={label}
              aria-current={isToday ? 'date' : undefined}
              onClick={() => onSelect(day)}
              className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full text-[15px] tabular-nums ${
                  isToday
                    ? 'bg-accent-soft font-semibold text-accent'
                    : day.status === 'rest'
                      ? 'text-ink-faint'
                      : muted
                        ? 'text-ink-soft'
                        : 'text-ink'
                }`}
              >
                {day.date.getDate()}
              </span>
              <Mark status={day.status} appointment={day.appointment} />
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line px-3 pt-4 text-[13px] text-ink-soft">
        {legend.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <Mark status={item.status} appointment={item.appointment} />
            {item.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="text-ink-faint">12</span> Rest day
        </span>
      </div>
    </Card>
  )
}
