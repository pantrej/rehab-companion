import { CalendarDays } from 'lucide-react'
import { TODAY, daysBetween, exercisesPerSession, formatDay } from '../data/calendar'
import type { CalendarDay } from '../data/calendar'
import { planDetails } from '../data/plan'
import type { Professional } from '../types/care'
import { Button } from './Button'
import { DetailList } from './DetailList'
import { statusLabels } from './MonthCalendar'
import { PlanUpdateNote } from './PlanUpdateNote'
import { ProfessionalAvatar } from './ProfessionalAvatar'
import { Sheet } from './Sheet'

type Props = {
  day: CalendarDay
  professional?: Professional
  onClose: () => void
}

const session = `${planDetails.focus} · ${planDetails.exerciseCount} exercises · about ${planDetails.durationMinutes} min`

// What happened (or is planned) on one day. Past days show the session and check-in; nothing is invented
// for days without a check-in.
export function DaySummarySheet({ day, professional, onClose }: Props) {
  const { status, checkIn } = day
  const isPast = daysBetween(day.date, TODAY) > 0
  const isTomorrow = daysBetween(TODAY, day.date) === 1
  const hadSession = status === 'completed' || status === 'partial' || status === 'skipped'

  return (
    <Sheet title={formatDay(day.date)} onClose={onClose}>
      <div className="mt-5 flex flex-col gap-4">
        {hadSession && (
          <DetailList
            items={[
              { label: 'Session status', value: statusLabels[status] },
              { label: 'Exercises', value: `${day.exercisesDone ?? 0} / ${exercisesPerSession}` },
              ...(checkIn
                ? [
                    { label: 'Pain', value: `${checkIn.pain}/10` },
                    { label: 'Difficulty', value: `${checkIn.difficulty}/10` },
                    { label: 'Movement', value: checkIn.movement },
                  ]
                : []),
            ]}
          />
        )}
        {hadSession && !checkIn && status !== 'skipped' && (
          <p className="px-1 text-[15px] text-ink-soft">No check-in recorded for this day.</p>
        )}

        {checkIn?.note && (
          <div className="rounded-2xl bg-canvas p-4">
            <p className="text-sm text-ink-soft">Your note</p>
            <p className="mt-1 text-base text-ink">“{checkIn.note}”</p>
          </div>
        )}

        {day.therapistNote && professional && (
          <div className="rounded-2xl bg-accent-soft/60 p-4">
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <ProfessionalAvatar professional={professional} size="sm" />
              Note from {professional.name}, {professional.credential}
            </p>
            <p className="mt-2 text-base leading-relaxed text-ink">{day.therapistNote}</p>
          </div>
        )}

        {status === 'rest' && <p className="px-1 text-[15px] text-ink-soft">A rest day in your plan.</p>}
        {status === 'today' && <p className="px-1 text-[15px] text-ink">Today’s session: {session}</p>}
        {status === 'upcoming' && <p className="px-1 text-[15px] text-ink">Planned: {session}</p>}
        {isTomorrow && professional && <PlanUpdateNote title="Plan updated for this day" />}

        {day.appointment && professional && (
          <p className="flex items-center gap-2 px-1 text-[15px] text-ink">
            <CalendarDays className="size-[18px] text-accent" strokeWidth={1.75} aria-hidden />
            {isPast ? 'Appointment' : 'Upcoming appointment'} with {professional.name}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-1">
        {status === 'today' && <Button to="/session">Start session</Button>}
        <Button variant={status === 'today' ? 'quiet' : 'primary'} onClick={onClose}>
          Done
        </Button>
      </div>
    </Sheet>
  )
}
