import { CalendarDays, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { ChoiceOption } from '../components/ChoiceOption'
import { DailyHero } from '../components/DailyHero'
import { DailyPlanCard } from '../components/DailyPlanCard'
import { DayCalendarSheet } from '../components/DayCalendarSheet'
import { DayCarousel } from '../components/DayCarousel'
import { DaySummarySheet } from '../components/DaySummarySheet'
import { RecoveryStatus } from '../components/RecoveryStatus'
import { Sheet } from '../components/Sheet'
import { assess, currentAssessment } from '../data/assessment'
import { TODAY } from '../data/calendar'
import { buildDayMonth, buildDayWindow } from '../data/days'
import type { DayView } from '../data/days'
import { recentCheckIns } from '../data/progress'
import type { CheckInRecord } from '../types/progress'
import { firstName, initialsOf, useAccount } from '../utils/auth'
import { useCare } from '../utils/care'
import { dayTheme } from '../utils/dayTheme'
import { readStored, storageKeys, writeStored } from '../utils/storage'

// Prototype preview of worsening signals (/?state=attention), read by the same rules as real check-ins.
const worseningCheckIns: CheckInRecord[] = [
  { daysAgo: 1, pain: 6, difficulty: 8, movement: 'Worse' },
  { daysAgo: 3, pain: 4, difficulty: 7, movement: 'About the same' },
  { daysAgo: 5, pain: 3, difficulty: 6, movement: 'Better' },
]

const feelings = ['Better', 'About the same', 'Worse']
const dateKey = (d: Date) => d.toISOString().slice(0, 10)

// Home answers "what does my rehabilitation look like today?": one day at a time, swiping back to what
// happened and ahead to what's next. Photo, plan, action and state change together.
export function HomeScreen() {
  const { care, connected, professional } = useCare()
  const account = useAccount()
  const [params] = useSearchParams()
  // The carousel holds five days around `center`; the calendar is what moves the window. The count makes
  // every pick its own, so choosing the day the window is already built around still lands on it.
  const [center, setCenter] = useState({ date: TODAY, pick: 0 })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [swiped, setSwiped] = useState<{ center: string; index: number }>()
  const [summaryDay, setSummaryDay] = useState<DayView>()
  const [restDay, setRestDay] = useState<DayView>()
  const [restFeelings, setRestFeelings] = useState(() => readStored<Record<string, string>>(storageKeys.restFeelings, {}))
  // First visit: set up how rehabilitation is managed before showing today's plan.
  if (!care) return <Navigate to="/onboarding" replace />

  const name = account?.fullName ?? ''
  // A check-in saved today (on this device) means today's session is complete.
  const lastCheckInAt = readStored<{ at?: string } | null>(storageKeys.lastCheckIn, null)?.at
  const doneToday = !!lastCheckInAt && new Date(lastCheckInAt).toDateString() === new Date().toDateString()

  const preview = params.get('state') === 'attention'
  const records = preview ? worseningCheckIns : recentCheckIns
  const assessment = preview ? assess(worseningCheckIns, 'in the last 7 days') : currentAssessment(professional)
  const context = { firstName: firstName(name), connected, onTrack: assessment.onTrack, doneToday }
  const { days, index } = buildDayWindow({ ...context, center: center.date })
  const centerKey = `${dateKey(center.date)}-${center.pick}`
  // Swiping moves within the window; picking a date in the calendar rebuilds it around that day.
  const activeIndex = swiped?.center === centerKey ? swiped.index : index
  const dayName = (i: number) => `${days[i].time}, ${days[i].dateLabel}`
  // Today is one tap away wherever the person has got to: a slide away, it scrolls back; a month away,
  // the window is rebuilt around today. Either way it is the same selected day the calendar sets.
  const todayIndex = days.findIndex((day) => day.offset === 0)
  const backToToday = (goTo: (index: number) => void) => () => {
    if (todayIndex >= 0) goTo(todayIndex)
    else setCenter((previous) => ({ date: TODAY, pick: previous.pick + 1 }))
  }

  return (
    <div className="relative flex flex-col pb-8 [--hero-h:clamp(238px,38dvh,320px)]">
      <h1 className="sr-only">Today's rehabilitation</h1>

      <DayCarousel
        key={centerKey}
        count={days.length}
        initial={index}
        label="Your rehabilitation, day by day"
        slideLabel={(i) => `${days[i].time}, ${days[i].date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        onChange={(i) => setSwiped({ center: centerKey, index: i })}
        indicator={(active, goTo) => (
          // Below the wave, on the day's own surface, and in the same place whichever day is in view.
          // The marks take that surface's own colour, so they read as part of it rather than on top of it.
          <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--hero-h)-1.625rem)] flex items-center justify-center">
            <div className="pointer-events-auto flex items-center">
              {days.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${dayName(i)}`}
                  aria-current={i === active ? 'true' : undefined}
                  className="flex h-9 items-center justify-center px-2"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${dayTheme[days[active].state].dot} ${
                      i === active ? 'w-5' : 'w-1.5 opacity-30'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Away from today, the way back: plain text, positioned on its own so the dots stay centred
                whether it is there or not. They say where in the week you are; this says how to get home. */}
            <button
              type="button"
              onClick={backToToday(goTo)}
              aria-hidden={days[active].offset === 0}
              tabIndex={days[active].offset === 0 ? -1 : 0}
              className={`absolute right-3 inline-flex h-8 items-center gap-1 px-2 text-[13px] font-medium text-accent transition-opacity duration-200 ${
                days[active].offset === 0 ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
              }`}
            >
              Today
              <Undo2 className="size-3.5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        )}
      >
        {(i) => (
          <>
            <DailyHero day={days[i]} />
            <DailyPlanCard
              day={days[i]}
              professional={professional}
              onViewSummary={() => setSummaryDay(days[i])}
              onLogRest={() => setRestDay(days[i])}
              restFeeling={restFeelings[dateKey(days[i].date)]}
            />
          </>
        )}
      </DayCarousel>

      {/* Calendar and avatar sit above the carousel: one of each, whatever day is in view. */}
      <button
        type="button"
        aria-label="Open calendar"
        aria-haspopup="dialog"
        aria-expanded={calendarOpen}
        onClick={() => setCalendarOpen(true)}
        className="absolute top-[max(env(safe-area-inset-top),2.75rem)] right-[3.75rem] flex size-11 items-center justify-center"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-white/80 text-ink-soft backdrop-blur-sm">
          <CalendarDays className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </span>
      </button>

      <Link
        to="/profile"
        aria-label="Profile"
        className="absolute top-[max(env(safe-area-inset-top),2.75rem)] right-4 flex size-11 items-center justify-center"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-white/80 text-caption font-semibold text-ink-soft backdrop-blur-sm">
          {initialsOf(name) || '?'}
        </span>
      </Link>

      <div className="px-5 pt-4">
        <RecoveryStatus assessment={assessment} day={days[activeIndex]} records={records} />
      </div>

      {calendarOpen && (
        <DayCalendarSheet
          days={buildDayMonth(context)}
          selected={days[activeIndex].date}
          onClose={() => setCalendarOpen(false)}
          onSelect={(date) => {
            setCenter((previous) => ({ date, pick: previous.pick + 1 }))
            setCalendarOpen(false)
          }}
        />
      )}

      {summaryDay?.calendar && (
        <DaySummarySheet day={summaryDay.calendar} professional={professional} onClose={() => setSummaryDay(undefined)} />
      )}
      {restDay && (
        <RestFeelingSheet
          day={restDay}
          onClose={() => setRestDay(undefined)}
          onSave={(feeling) => {
            const next = { ...restFeelings, [dateKey(restDay.date)]: feeling }
            writeStored(storageKeys.restFeelings, next)
            setRestFeelings(next)
            setRestDay(undefined)
          }}
        />
      )}
    </div>
  )
}

// A rest day's check-in is one light question, kept on this device.
function RestFeelingSheet({ day, onClose, onSave }: { day: DayView; onClose: () => void; onSave: (feeling: string) => void }) {
  const [feeling, setFeeling] = useState<string>()
  return (
    <Sheet title={day.offset < 0 ? 'How did your rest day feel?' : 'How do you feel today?'} onClose={onClose}>
      <p className="mt-2 text-body text-ink-soft">Compared with your last session day.</p>
      <div role="radiogroup" aria-label="How you feel" className="mt-5 flex flex-col gap-3">
        {feelings.map((f) => (
          <ChoiceOption key={f} label={f} selected={feeling === f} onSelect={() => setFeeling(f)} />
        ))}
      </div>
      <Button className="mt-6" disabled={!feeling} onClick={() => feeling && onSave(feeling)}>
        Save
      </Button>
    </Sheet>
  )
}
