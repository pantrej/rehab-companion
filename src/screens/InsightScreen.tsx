import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { MiniTrend } from '../components/MiniTrend'
import { MovementMarks } from '../components/MovementMarks'
import { RangeBar } from '../components/RangeBar'
import { SignalDetail } from '../components/SignalDetail'
import { currentAssessment, onTrackRule, watchFor } from '../data/assessment'
import { recoveryInsightScreen as insight } from '../data/insight'
import { tomorrow } from '../data/plan'
import { supportTopics } from '../data/support'
import type { CheckIn } from '../types/checkin'
import { professionalPhrase, useCare } from '../utils/care'
import { liveCheckIns } from '../utils/checkIn'
import { readStored, storageKeys } from '../utils/storage'
import { toneDot, toneText } from '../utils/tone'

function Question({ id, number, title, children }: { id: string; number: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="flex items-center gap-3 text-section font-semibold text-ink">
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-caption font-semibold text-white" aria-hidden>
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

type Step = { title: string; detail: string; links?: { to: string; label: string }[] }

// Answers three questions in order: what changed, whether that appears expected, and what to do next.
// Every judgement shows its basis, and the screen says plainly that it isn't a clinical assessment.
export function InsightScreen() {
  const navigate = useNavigate()
  // Opened from Progress it goes back there; after a check-in or from Today it closes to Today.
  const { state } = useLocation()
  const returnTo: string = state?.returnTo ?? '/'
  const fromProgress = returnTo === '/progress'
  const afterCheckIn = state?.from === 'check-in'
  // What the latest check-in flagged as unsure, matched to its support topic.
  const flagged = (readStored<CheckIn | null>(storageKeys.lastCheckIn, null)?.unsure ?? [])
    .map((label) => supportTopics.find((t) => t.label === label))
    .filter((t) => t !== undefined)
  const { professional } = useCare()
  const a = currentAssessment(professional, liveCheckIns())
  const [whyOpen, setWhyOpen] = useState(false)
  const showWhy = whyOpen || !a.onTrack
  const pro = professionalPhrase(professional?.name)

  const steps: Step[] = [
    ...(flagged.length
      ? [
          {
            title: `You were unsure about ${flagged.map((t) => t.label.toLowerCase()).join(' and ')}`,
            detail: professional
              ? `${professional.name} will see this before your appointment. For an answer now, start with the guidance.`
              : 'Start with the guidance; it also says when to involve a rehabilitation professional.',
            links: flagged.map((t) => ({ to: `/support/${t.id}`, label: `Guidance: ${t.label}` })),
          },
        ]
      : []),
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
          links: [{ to: '/summary', label: 'Share recovery summary' }],
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
          <h1 className="mt-5 text-title font-semibold text-ink">{insight.title}</h1>
          <p className="mt-1 text-[15px] text-ink-soft">
            Based on {a.checkInCount} check-ins {a.scope}
          </p>
        </header>

        {/* The one featured surface on this screen: the reading, in a sentence. */}
        <Card tone="featured" className="p-6">
          <p className="text-caption font-medium text-accent">How it’s going</p>
          <p className="mt-2 flex items-center gap-3 text-title font-semibold text-ink">
            <span className={`size-2.5 rounded-full ring-4 ${toneDot[a.tone]}`} aria-hidden />
            {a.verdict}
          </p>
          <p className="mt-2 text-[17px] leading-relaxed text-ink">{a.headline}</p>
        </Card>

        <Question id="changed" number={1} title={insight.questions.changed}>
          <Card className="px-6 py-2">
            <ul className="divide-y divide-line">
              {a.changes.map((signal) => (
                <SignalDetail key={signal.id} {...signal}>
                  {signal.id === 'pain' && (
                    <RangeBar
                      value={a.series.pain[a.series.pain.length - 1]}
                      low={a.series.painLow}
                      high={a.series.painHigh}
                      label="Pain"
                    />
                  )}
                  {signal.id === 'mobility' && <MovementMarks values={a.series.movement} />}
                  {signal.id === 'difficulty' && <MiniTrend values={a.series.difficulty} label="Session difficulty" showRange={false} />}
                </SignalDetail>
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

            {/* The evidence folds away; it opens by itself when something needs checking. */}
            <button
              type="button"
              aria-expanded={showWhy}
              aria-controls="why"
              onClick={() => setWhyOpen(!showWhy)}
              className="-mx-2 mt-2 flex min-h-11 w-[calc(100%+1rem)] items-center justify-between rounded-xl px-2 text-[15px] font-semibold text-accent hover:bg-accent-soft"
            >
              Why we think so
              <ChevronDown className={`size-4 transition-transform ${showWhy ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {showWhy && (
            <ul id="why" className="mt-2 flex flex-col gap-2.5">
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
            )}

            <div className="mt-5 border-t border-line pt-4">
              <p className="text-caption font-medium text-ink-soft">What would change this</p>
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
          <p className="text-caption text-ink-faint">{insight.notClinical}</p>
        </Question>

        <Question id="next" number={3} title={insight.questions.next}>
          <Card className="px-6 py-2">
            <ol className="divide-y divide-line">
              {steps.map((step) => (
                <li key={step.title} className="py-4">
                  <p className="text-body font-semibold text-ink">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{step.detail}</p>
                  {step.links?.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="-mx-2 mt-1 -mb-2 flex min-h-11 w-fit items-center gap-1.5 rounded-xl px-2 text-[15px] font-medium text-accent hover:bg-accent-soft"
                    >
                      {link.label}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  ))}
                </li>
              ))}
            </ol>
          </Card>
        </Question>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        {/* The next step is named, never implied: done for the day, or back to where the user came from. */}
        <Button onClick={() => navigate(fromProgress ? '/progress' : '/')}>
          {afterCheckIn ? 'Done for today' : fromProgress ? 'Back to Progress' : 'Back to Today'}
        </Button>
        {afterCheckIn && (
          <p className="mt-2 text-center text-caption text-ink-soft">Next session: tomorrow · {tomorrow.focus}</p>
        )}
        <Button to="/support" variant="quiet" className="mt-1">
          I’m unsure about something
        </Button>
        <p className="mt-1 text-center text-caption text-ink-faint">{insight.safetyNote}</p>
      </div>
    </div>
  )
}
