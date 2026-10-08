import { ArrowRight, ChevronRight, Play, RefreshCw } from 'lucide-react'
import { Link, Navigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { StatusItem } from '../components/StatusItem'
import { recoveryInsight, recoveryOverall, recoverySignals, todayPlan } from '../data/today'
import { firstName, initialsOf, useAccount } from '../utils/auth'
import { useCare } from '../utils/care'
import { toneDot } from '../utils/tone'

export function HomeScreen() {
  const { care, professional } = useCare()
  const account = useAccount()
  // First visit: set up how rehabilitation is managed before showing today's plan.
  if (!care) return <Navigate to="/onboarding" replace />

  const name = account?.fullName ?? ''

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] text-ink-soft">Good morning{name ? `, ${firstName(name)}` : ''}</p>
          <h1 className="mt-1.5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            Today's rehabilitation
          </h1>
        </div>
        {/* 44px touch target around the quieter 36px avatar. */}
        <Link to="/profile" aria-label="Profile" className="-m-1 flex size-11 shrink-0 items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-sunken text-[13px] font-semibold text-ink-soft">
            {initialsOf(name) || '?'}
          </span>
        </Link>
      </header>

      <Card className="p-6">
        <p className="text-sm text-ink-soft">Today's plan</p>
        <h2 className="mt-2 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">
          {todayPlan.focus.join(' + ')}
        </h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          {todayPlan.exerciseCount} exercises · About {todayPlan.durationMinutes} min
        </p>
        {professional ? (
          <p className="mt-4 flex items-center gap-2.5 text-[13px] text-ink-soft">
            <ProfessionalAvatar professional={professional} size="sm" />
            Prepared by {professional.name}, {professional.credential}
          </p>
        ) : (
          <p className="mt-1 text-[13px] text-ink-faint">From your existing rehabilitation plan</p>
        )}

        <Button to="/session" icon={<Play className="size-4 fill-current" aria-hidden />} className="mt-7">
          Start session
        </Button>

        {/* A recent professional change, stated calmly and attributed; the app never changes the plan itself. */}
        {professional && (
          <Link
            to="/plan-changes"
            className="-mx-2 mt-4 -mb-2 flex min-h-11 items-center justify-between gap-3 rounded-xl px-2 py-2 text-[13px] text-ink-soft transition-colors hover:bg-canvas"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Plan updated yesterday · changes apply from tomorrow
            </span>
            <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
          </Link>
        )}
      </Card>

      <section aria-labelledby="recovery-status" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between px-1">
          <h2 id="recovery-status" className="text-lg font-semibold text-ink">
            Recovery status
          </h2>
          <span className="text-[13px] text-ink-faint">Last 7 days</span>
        </div>

        <Card className="p-6">
          <p className="text-sm text-ink-soft">{recoveryOverall.label}</p>
          <p className="mt-2 flex items-center gap-3 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            <span className={`size-2.5 rounded-full ring-4 ${toneDot[recoveryOverall.tone]}`} aria-hidden />
            {recoveryOverall.status}
          </p>

          <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-5">
            {recoverySignals.map((signal) => (
              <StatusItem key={signal.id} {...signal} />
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-canvas p-4">
            <p className="text-sm font-medium text-ink">{recoveryInsight.title}</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{recoveryInsight.text}</p>
            <p className="mt-3 text-[13px] text-ink-faint">{recoveryInsight.basis}</p>
          </div>

          <Button
            to="/progress"
            variant="ghost"
            icon={<ArrowRight className="size-4" aria-hidden />}
            className="mt-3 -mb-2"
          >
            View progress
          </Button>
        </Card>
      </section>
    </div>
  )
}
