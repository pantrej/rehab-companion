import { ArrowRight, Check, ChevronRight, Play, RefreshCw } from 'lucide-react'
import { Link, Navigate } from 'react-router'
import { AssessmentLine } from '../components/AssessmentLine'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { Section } from '../components/Section'
import { StatusItem } from '../components/StatusItem'
import { currentAssessment } from '../data/assessment'
import { tomorrow } from '../data/plan'
import { recoveryInsight, recoverySignals, todayPlan } from '../data/today'
import { firstName, initialsOf, useAccount } from '../utils/auth'
import { useCare } from '../utils/care'
import { readStored, storageKeys } from '../utils/storage'

export function HomeScreen() {
  const { care, professional } = useCare()
  const account = useAccount()
  // First visit: set up how rehabilitation is managed before showing today's plan.
  if (!care) return <Navigate to="/onboarding" replace />

  const name = account?.fullName ?? ''
  // A check-in saved today (on this device) means today's session is complete.
  const lastCheckInAt = readStored<{ at?: string } | null>(storageKeys.lastCheckIn, null)?.at
  const doneToday = !!lastCheckInAt && new Date(lastCheckInAt).toDateString() === new Date().toDateString()

  return (
    <div className="flex flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-body text-ink-soft">Good morning{name ? `, ${firstName(name)}` : ''}</p>
          <h1 className="mt-1 text-title font-semibold text-ink">
            Today's rehabilitation
          </h1>
        </div>
        {/* 44px touch target around the quieter 36px avatar. */}
        <Link to="/profile" aria-label="Profile" className="-m-1 flex size-11 shrink-0 items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-sunken text-caption font-semibold text-ink-soft">
            {initialsOf(name) || '?'}
          </span>
        </Link>
      </header>

      {/* The one featured surface on Today: what to do now. */}
      <Card tone="featured" className="p-6">
        <p className="text-caption font-medium text-accent">Today's plan</p>
        <h2 className="mt-2 text-title font-semibold text-ink">
          {todayPlan.focus.join(' + ')}
        </h2>
        <p className="mt-1.5 text-body text-ink-soft">
          {todayPlan.exerciseCount} exercises · About {todayPlan.durationMinutes} min
        </p>
        {professional ? (
          <p className="mt-4 flex items-center gap-2.5 text-caption text-ink-soft">
            <ProfessionalAvatar professional={professional} size="sm" />
            Prepared by {professional.name}, {professional.credential}
          </p>
        ) : (
          <p className="mt-1 text-caption text-ink-faint">From your existing rehabilitation plan</p>
        )}

        {/* Once today's check-in is in, the next action moves on: review the insight, then tomorrow. */}
        {doneToday ? (
          <>
            <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-positive">
              <Check className="size-[18px]" strokeWidth={2.25} aria-hidden />
              Today’s session is done
            </p>
            <p className="mt-1 text-[15px] text-ink-soft">Next session: tomorrow · {tomorrow.focus}</p>
            <Button to="/insight" state={{ returnTo: '/' }} className="mt-5">
              View today’s insight
            </Button>
            <Button to="/session" variant="quiet" className="mt-1">
              Repeat today’s session
            </Button>
          </>
        ) : (
          <Button to="/session" icon={<Play className="size-4 fill-current" aria-hidden />} className="mt-7">
            Start session
          </Button>
        )}

        {/* A recent professional change, stated calmly and attributed; the app never changes the plan itself. */}
        {professional && (
          <Link
            to="/plan-changes"
            className="-mx-2 mt-4 -mb-2 flex min-h-11 items-center justify-between gap-3 rounded-xl px-2 py-2 text-caption text-ink-soft transition-colors hover:bg-surface/70"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Plan updated yesterday · changes apply from tomorrow
            </span>
            <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
          </Link>
        )}
      </Card>

      <Section id="recovery-status" title="Recovery status" aside="Last 7 days">
        {/* One card, no nested boxes: the reading first, then the signals behind it. */}
        <Card className="p-6">
          <AssessmentLine assessment={currentAssessment(professional)} returnTo="/" />
          <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
            {recoverySignals.map((signal) => (
              <StatusItem key={signal.id} {...signal} />
            ))}
          </ul>
          <p className="mt-4 text-caption text-ink-faint">{recoveryInsight.basis}</p>
          <Button
            to="/progress"
            variant="text"
            icon={<ArrowRight className="size-4" aria-hidden />}
            className="mt-2 -mb-2"
          >
            View progress
          </Button>
        </Card>
      </Section>
    </div>
  )
}
