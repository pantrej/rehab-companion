import { ArrowRight, Clock, Gauge, ListChecks, PersonStanding, Play, Stethoscope, Activity, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { StatusItem } from '../components/StatusItem'
import { recoveryInsight, recoverySignals, todayPlan } from '../data/today'
import type { RecoverySignal } from '../types/recovery'

const signalIcons: Record<RecoverySignal['id'], LucideIcon> = {
  pain: Activity,
  mobility: PersonStanding,
  difficulty: Gauge,
}

export function HomeScreen() {
  return (
    <div className="flex flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),3rem)] pb-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] text-ink-soft">Good morning</p>
          <h1 className="mt-1 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            Today's rehabilitation
          </h1>
        </div>
        <button
          type="button"
          aria-label="Profile"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-soft"
        >
          <UserRound className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      </header>

      <Card className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-medium text-accent">Today's plan</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[17px] text-ink">
            <span className="inline-flex items-center gap-2">
              <ListChecks className="size-5 text-ink-faint" strokeWidth={1.75} aria-hidden />
              {todayPlan.exerciseCount} exercises
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-5 text-ink-faint" strokeWidth={1.75} aria-hidden />
              About {todayPlan.durationMinutes} min
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm text-ink-soft">Focus</p>
          <p className="mt-1 text-2xl leading-snug font-semibold tracking-[-0.015em] text-ink">
            {todayPlan.focus.join(' + ')}
          </p>
        </div>

        <p className="flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-soft">
          <Stethoscope className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          Set by {todayPlan.prescribedBy}
        </p>

        <Button icon={<Play className="size-4 fill-current" aria-hidden />}>Start session</Button>
      </Card>

      <section aria-labelledby="recovery-status" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 id="recovery-status" className="text-lg font-semibold text-ink">
            Recovery status
          </h2>
          <span className="text-sm text-ink-faint">Last 7 days</span>
        </div>

        <Card className="py-2">
          <ul className="divide-y divide-line">
            {recoverySignals.map((signal) => (
              <StatusItem key={signal.id} icon={signalIcons[signal.id]} {...signal} />
            ))}
          </ul>

          <div className="mt-2 rounded-2xl bg-canvas p-4">
            <p className="text-[15px] leading-relaxed text-ink">{recoveryInsight.text}</p>
            <p className="mt-2 text-[13px] text-ink-soft">{recoveryInsight.basis}</p>
          </div>

          <Button
            to="/progress"
            variant="secondary"
            icon={<ArrowRight className="size-4" aria-hidden />}
            className="mt-3 mb-3"
          >
            View progress
          </Button>
        </Card>
      </section>
    </div>
  )
}
