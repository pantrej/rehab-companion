import { ArrowLeft, ArrowRight, Check, CircleAlert, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { SignalDetail } from '../components/SignalDetail'
import { currentAssessment, onTrackRule, watchFor } from '../data/assessment'
import { recoveryInsightScreen as insight } from '../data/insight'
import { tomorrow } from '../data/plan'
import { professionalPhrase, useCare } from '../utils/care'
import { toneDot, toneText } from '../utils/tone'

function Question({ id, number, title, children }: { id: string; number: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="flex items-center gap-3 px-1 text-lg font-semibold text-ink">
        <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-sm text-accent" aria-hidden>
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

type Step = { title: string; detail: string; link?: { to: string; label: string } }

// Answers three questions in order: what changed, whether that appears expected, and what to do next.
// Every judgement shows its basis, and the screen says plainly that it isn't a clinical assessment.
export function InsightScreen() {
  const navigate = useNavigate()
  // Opened from Progress it goes back there; after a check-in or from Today it closes to Today.
  const returnTo: string = useLocation().state?.returnTo ?? '/'
  const fromProgress = returnTo === '/progress'
  const { professional } = useCare()
  const a = currentAssessment(professional)
  const pro = professionalPhrase(professional?.name)

  const steps: Step[] = [
    ...(a.onTrack
      ? []
      : [{ title: `Consider contacting ${pro}`, detail: 'Mention which signals changed and when, before your next session.' }]),
    {
      title: 'Continue your plan',
      detail: professional
        ? `Keep following the plan ${professional.name} prepared for you.`
        : 'Keep following your existing rehabilitation plan.',
    },
    {
      title: 'Check in after your next session',
      detail: professional
        ? `Tomorrow’s plan has ${tomorrow.changeInBrief}. That’s an update from ${professional.name}, not a sign that something is wrong.`
        : 'Each check-in makes this reading more reliable.',
    },
    professional
      ? {
          title: 'Bring questions to your review',
          detail: `Your latest check-in will be included in your recovery summary for ${professional.name}, ready for your appointment on ${professional.nextAppointment}.`,
        }
      : {
          title: 'Get another view if you want one',
          detail: 'You can share your recovery summary with a rehabilitation professional you choose.',
          link: { to: '/summary', label: 'Share recovery summary' },
        },
  ]

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
          <h1 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">{insight.title}</h1>
          <p className="mt-1.5 text-[15px] text-ink-soft">
            Based on {a.checkInCount} check-ins {a.scope}
          </p>
        </header>

        <Card className="p-6">
          <p className="text-sm text-ink-soft">How it’s going</p>
          <p className="mt-2 flex items-center gap-3 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            <span className={`size-2.5 rounded-full ring-4 ${toneDot[a.tone]}`} aria-hidden />
            {a.verdict}
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-ink">{a.headline}</p>
        </Card>

        <Question id="changed" number={1} title={insight.questions.changed}>
          <Card className="px-6 py-2">
            <ul className="divide-y divide-line">
              {a.changes.map((signal) => (
                <SignalDetail key={signal.id} {...signal} />
              ))}
            </ul>
          </Card>
        </Question>

        <Question id="expected" number={2} title={insight.questions.expected}>
          <Card className="p-6">
            <p className={`text-[17px] font-medium ${toneText[a.tone]}`}>
              {a.onTrack ? 'Yes, this appears to be on track.' : 'Some signals are worth checking.'}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{onTrackRule}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {a.checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink">
                  {c.ok ? (
                    <Check className="mt-0.5 size-[18px] shrink-0 text-positive" strokeWidth={2.25} aria-label="Met" />
                  ) : (
                    <CircleAlert className="mt-0.5 size-[18px] shrink-0 text-attention" strokeWidth={2} aria-label="Not met" />
                  )}
                  {c.label}
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-line pt-4">
              <p className="text-sm font-medium text-ink-soft">What would change this</p>
              <ul className="mt-2 flex flex-col gap-2">
                {watchFor.map((w) => (
                  <li key={w} className="flex items-baseline gap-2.5 text-[15px] leading-relaxed text-ink">
                    <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-ink-faint" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                If you notice any of these, consider contacting {pro}.
              </p>
            </div>
          </Card>
          <p className="-mt-1 px-1 text-[13px] text-ink-faint">{insight.notClinical}</p>
        </Question>

        <Question id="next" number={3} title={insight.questions.next}>
          <Card className="px-6 py-2">
            <ol className="divide-y divide-line">
              {steps.map((step) => (
                <li key={step.title} className="py-4">
                  <p className="text-base font-medium text-ink">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{step.detail}</p>
                  {step.link && (
                    <Link
                      to={step.link.to}
                      className="-mx-2 mt-1 -mb-2 inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-[15px] font-medium text-accent hover:bg-accent-soft"
                    >
                      {step.link.label}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        </Question>
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
