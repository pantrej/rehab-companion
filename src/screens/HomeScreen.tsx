import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { ChoiceOption } from '../components/ChoiceOption'
import { DailyHero } from '../components/DailyHero'
import { DailyPlanCard } from '../components/DailyPlanCard'
import { DayCarousel } from '../components/DayCarousel'
import { DaySummarySheet } from '../components/DaySummarySheet'
import { RecoveryStatus } from '../components/RecoveryStatus'
import { Sheet } from '../components/Sheet'
import { assess, currentAssessment } from '../data/assessment'
import { buildDays, dayOffsets } from '../data/days'
import type { DayView } from '../data/days'
import { recentCheckIns } from '../data/progress'
import type { CheckInRecord } from '../types/progress'
import { firstName, initialsOf, useAccount } from '../utils/auth'
import { useCare } from '../utils/care'
import { readStored, storageKeys, writeStored } from '../utils/storage'

// Prototype preview of worsening signals (/?state=attention), read by the same rules as real check-ins.
const worseningCheckIns: CheckInRecord[] = [
  { daysAgo: 1, pain: 6, difficulty: 8, movement: 'Worse' },
  { daysAgo: 3, pain: 4, difficulty: 7, movement: 'About the same' },
  { daysAgo: 5, pain: 3, difficulty: 6, movement: 'Better' },
]

const todayIndex = dayOffsets.indexOf(0)
const feelings = ['Better', 'About the same', 'Worse']
const dateKey = (d: Date) => d.toISOString().slice(0, 10)

// Home answers "what does my rehabilitation look like today?": one day at a time, swiping back to what
// happened and ahead to what's next. Photo, plan, action and state change together.
export function HomeScreen() {
  const { care, connected, professional } = useCare()
  const account = useAccount()
  const [params] = useSearchParams()
  const [activeIndex, setActiveIndex] = useState(todayIndex)
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
  const days = buildDays({ firstName: firstName(name), connected, onTrack: assessment.onTrack, doneToday })
  const dayName = (i: number) => (days[i].offset === 0 ? 'Today' : days[i].title)

  return (
    <div className="relative flex flex-col pb-8">
      <h1 className="sr-only">Today's rehabilitation</h1>

      <DayCarousel
        count={days.length}
        initial={todayIndex}
        label="Your rehabilitation, day by day"
        slideLabel={(i) => `${dayName(i)}, ${days[i].date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        onChange={setActiveIndex}
      >
        {(i, goTo) => (
          <>
            <DailyHero day={days[i]} index={i} count={days.length} onSelect={goTo} dayName={dayName} />
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

      {/* One avatar for every day, above the carousel. 44px target around the 36px avatar. */}
      <Link
        to="/profile"
        aria-label="Profile"
        className="absolute top-[max(env(safe-area-inset-top),2.75rem)] right-4 flex size-11 items-center justify-center"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-white/80 text-caption font-semibold text-ink-soft backdrop-blur-sm">
          {initialsOf(name) || '?'}
        </span>
      </Link>

      <div className="px-5 pt-5">
        <RecoveryStatus assessment={assessment} day={days[activeIndex]} records={records} />
      </div>

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
