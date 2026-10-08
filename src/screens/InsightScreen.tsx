import { ArrowLeft, Check, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { SignalDetail } from '../components/SignalDetail'
import { recoveryInsightScreen as insight } from '../data/insight'
import { toneDot } from '../utils/tone'

// Read top to bottom in a few seconds: where you are, why we think so, what it may mean, what to do.
export function InsightScreen() {
  const navigate = useNavigate()
  // Opened from Progress it goes back there; after a check-in it closes to Today.
  const returnTo: string = useLocation().state?.returnTo ?? '/'
  const fromProgress = returnTo === '/progress'
  const { overall, signals, nextStep } = insight

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <header>
          <Link
            to={returnTo}
            aria-label={fromProgress ? 'Back to Progress' : 'Close and go to Today'}
            className="-ml-2.5 flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-line/60"
          >
            {fromProgress ? (
              <ArrowLeft className="size-[22px]" strokeWidth={1.75} aria-hidden />
            ) : (
              <X className="size-[22px]" strokeWidth={1.75} aria-hidden />
            )}
          </Link>
          <h1 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            {insight.title}
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-soft">{insight.subtitle}</p>
        </header>

        <Card className="px-6 pt-6 pb-2">
          <p className="text-sm text-ink-soft">{overall.label}</p>
          <p className="mt-2 flex items-center gap-3 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            <span className={`size-2.5 rounded-full ring-4 ${toneDot[overall.tone]}`} aria-hidden />
            {overall.status}
          </p>

          <ul className="mt-5 divide-y divide-line border-t border-line">
            {signals.map((signal) => (
              <SignalDetail key={signal.id} {...signal} />
            ))}
          </ul>
        </Card>

        <section aria-labelledby="noticed" className="px-1">
          <h2 id="noticed" className="text-sm font-medium text-ink-soft">
            What we noticed
          </h2>
          <p className="mt-2 text-xl leading-snug font-medium tracking-[-0.01em] text-ink">{insight.noticed}</p>

          <h2 className="mt-8 text-sm font-medium text-ink-soft">What this may mean</h2>
          <p className="mt-2 text-[17px] leading-relaxed text-ink">{insight.meaning}</p>
        </section>

        <section aria-labelledby="next-step">
          <h2 id="next-step" className="px-1 text-lg font-semibold text-ink">
            {nextStep.heading}
          </h2>
          <Card className="mt-4 flex gap-4 p-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-positive-soft text-positive">
              <Check className="size-5" strokeWidth={2.25} aria-hidden />
            </span>
            <div>
              <p className="text-xl leading-snug font-semibold tracking-[-0.01em] text-ink">
                {nextStep.recommendation}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{nextStep.detail}</p>
            </div>
          </Card>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <Button onClick={() => navigate('/')}>Continue plan</Button>
        <Button to="/support" variant="quiet" className="mt-1">
          I’m unsure about something
        </Button>
        <p className="mt-1 text-center text-[13px] text-ink-faint">{insight.safetyNote}</p>
      </div>
    </div>
  )
}
