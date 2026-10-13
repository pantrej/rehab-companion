import { ArrowRight, Check, ChevronDown, FileText, Minus } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { MiniTrend } from '../components/MiniTrend'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { SegmentedControl } from '../components/SegmentedControl'
import { Section } from '../components/Section'
import { currentAssessment } from '../data/assessment'
import type { Assessment } from '../data/assessment'
import { progressPeriods, progressTrends } from '../data/progress'
import type { TrendSignal } from '../data/progress'
import { sessionHistory } from '../data/sessions'
import type { SessionRecord } from '../data/sessions'
import { sinceLastAppointment } from '../data/summary'
import type { ProgressRangeId } from '../types/progress'
import { useCare } from '../utils/care'
import type { SignalTone } from '../types/recovery'
import { toneDot, toneStatusText } from '../utils/tone'

const shownAtFirst = 2

// The reading's scope, short enough to sit in a line of metadata.
const shortScope = (scope: string) => scope.replace('since your last appointment on', 'Since').replace('in the last', 'Last')

// Progress answers one question: is my recovery actually improving? The reading comes first in words,
// then the three signals behind it, then what has actually happened, then the next professional review.
// What to do next lives on Home; this screen only looks back.
export function ProgressScreen() {
  const { professional } = useCare()
  const [range, setRange] = useState<ProgressRangeId>('7d')
  const [allSessions, setAllSessions] = useState(false)
  const [basisOpen, setBasisOpen] = useState(false)
  const basisId = useId()
  const headerRef = useRef<HTMLElement>(null)
  // Closing from deep inside the evidence shouldn't leave the person looking at the space it left.
  const toggleBasis = () => {
    const next = !basisOpen
    setBasisOpen(next)
    if (!next) {
      requestAnimationFrame(() => {
        const header = headerRef.current
        if (header && header.getBoundingClientRect().top < 0) header.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }
  const assessment = currentAssessment(professional)
  const sessions = allSessions ? sessionHistory : sessionHistory.slice(0, shownAtFirst)
  const completed = sessionHistory.filter((session) => session.outcome === 'Completed').length
  const difficulty = assessment.series.difficulty

  return (
    <div className="flex flex-col gap-6 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      {/* The outcome in words, then the check-ins it was read from, in one quiet surface. */}
      <header ref={headerRef}>
        <p className="text-[12px] font-semibold tracking-[0.16em] text-ink-faint uppercase">Progress</p>
        <h1 className="mt-2.5 text-[30px] leading-[1.12] font-bold tracking-[-0.025em] text-ink">
          {assessment.onTrack ? 'Your recovery is progressing' : 'Some signals are worth checking'}
        </h1>
        <p className="mt-2.5 flex items-center gap-2.5 text-[17px] font-semibold text-ink">
          <span className={`size-2.5 rounded-full ring-4 ${toneDot[assessment.tone]}`} aria-hidden />
          {assessment.verdict}
        </p>

        {/* The signals first, each in its own card: three pieces of information, not three columns. */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {overviewSignals(assessment).map((signal) => (
            <Signal key={signal.id} signal={signal} />
          ))}
        </div>

        {/* Then what they add up to, on the surface the screen reserves for its one reading. */}
        <Card tone="featured" className="mt-2 px-4 pt-4 pb-2">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">
            What changed
          </p>
          <p className="mt-1.5 text-[17px] leading-snug text-ink">{assessment.headline}</p>
          <p className="mt-1.5 text-caption leading-snug text-ink-soft">
            {assessment.checkInCount} check-ins · {completed} sessions completed · {shortScope(assessment.scope)}
          </p>
          {/* The evidence opens in place: the card grows, the screen below it moves down, and nothing
              takes the reading away from the person reading it. */}
          <div
            id={basisId}
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              basisOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div
              aria-hidden={!basisOpen}
              className={`overflow-hidden transition-opacity duration-300 ease-out ${basisOpen ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="mt-2 border-t border-accent/15 pt-4 pb-2">
                <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">
                  {assessment.onTrack ? 'Why this appears on track' : 'Why this is worth checking'}
                </p>
                <dl className="mt-3 flex flex-col gap-3.5">
                  {assessment.changes.map((change) => (
                    <div key={change.id}>
                      <dt className="text-[15px] font-semibold text-ink">{change.label}</dt>
                      <dd className="mt-0.5 text-[15px] leading-snug text-ink-soft">
                        {change.id === 'difficulty'
                          ? `Session difficulty changed from ${difficulty[0]}/10 to ${difficulty[difficulty.length - 1]}/10.`
                          : `${change.detail}.`}
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className="text-[15px] font-semibold text-ink">
                      {professional ? 'Since your last review' : 'Recent check-ins'}
                    </dt>
                    <dd className="mt-0.5 text-[15px] leading-snug text-ink-soft">
                      {professional
                        ? `${assessment.checkInCount} check-ins have been recorded since the appointment on ${professional.lastAppointment}.`
                        : `${assessment.checkInCount} check-ins have been recorded ${assessment.scope}.`}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-caption leading-relaxed text-ink-faint">
                  This summary reflects your recent check-ins and rehabilitation activity. It isn’t a medical
                  assessment.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleBasis}
            aria-expanded={basisOpen}
            aria-controls={basisId}
            className="-ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-[15px] font-semibold text-accent"
          >
            {basisOpen ? 'Show less' : 'More details'}
            <ChevronDown
              className={`size-4 transition-transform duration-300 ease-out ${basisOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        </Card>
      </header>

      <Section id="signals" title="Recovery trends">
        <SegmentedControl
          label="Time range"
          options={progressPeriods.map((p) => ({ id: p.id, label: p.label }))}
          value={range}
          onChange={setRange}
        />
        <Card className="px-5 py-1">
          <ul className="divide-y divide-line">
            {progressTrends[range].map((signal) => (
              <Trend key={signal.id} signal={signal} />
            ))}
          </ul>
        </Card>
      </Section>

      {/* What actually happened: one session a week, newest first. */}
      <Section id="activity" title="Recent activity">
        <ul className="divide-y divide-line">
          {sessions.map((session) => (
            <Activity key={session.date.toISOString()} session={session} />
          ))}
        </ul>
        {sessionHistory.length > shownAtFirst && (
          <button
            type="button"
            onClick={() => setAllSessions(!allSessions)}
            className="-ml-1 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full px-1 text-[15px] font-semibold text-accent"
          >
            {allSessions ? 'Show fewer' : 'View all'}
            <ArrowRight className={`size-4 transition-transform ${allSessions ? '-rotate-90' : ''}`} aria-hidden />
          </button>
        )}
      </Section>

      {professional ? (
        <Section id="review" title="Next rehabilitation review">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <ProfessionalAvatar professional={professional} />
              <div>
                <p className="text-[17px] font-semibold text-ink">
                  {professional.name}, {professional.credential}
                </p>
                <p className="text-[15px] text-ink-soft">{professional.nextAppointment}</p>
              </div>
            </div>
            <p className="mt-4 border-t border-line pt-4 text-[15px] leading-relaxed text-ink">
              {sinceLastAppointment(professional.daysSinceLastAppointment).records.length} new check-ins since your
              last appointment.
            </p>
            <Button
              to="/summary"
              variant="secondary"
              icon={<FileText className="size-4" strokeWidth={1.75} aria-hidden />}
              className="mt-4"
            >
              View recovery summary
            </Button>
          </Card>
        </Section>
      ) : (
        // Independent: no professional is invented, only the summary the user can take to one.
        <Section id="share" title="Recovery summary">
          <Card className="p-6">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              A short summary of your recent signals and check-ins, to share with a rehabilitation professional if
              you want another view.
            </p>
            <Button
              to="/summary"
              variant="secondary"
              icon={<FileText className="size-4" strokeWidth={1.75} aria-hidden />}
              className="mt-4"
            >
              Share recovery summary
            </Button>
          </Card>
        </Section>
      )}

    </div>
  )
}

// The overview's three signals, read from the same assessment as the verdict: where each one stands,
// which way it is going, and the line it took to get there. No signal is combined with another.
type OverviewSignal = {
  id: string
  label: string
  value: string
  status: string
  tone: SignalTone
  series: number[]
  max: number
  reading: string
}

const movementScale: Record<string, number> = { Worse: 1, 'About the same': 2, Better: 3 }

function overviewSignals(assessment: Assessment): OverviewSignal[] {
  const { pain, difficulty, movement, painLow, painHigh } = assessment.series
  const [painChange, mobilityChange, difficultyChange] = assessment.changes
  const first = difficulty[0]
  const last = difficulty[difficulty.length - 1]
  return [
    {
      id: 'pain',
      label: 'Pain',
      value: painLow === painHigh ? `${painLow}` : `${painLow}–⁠${painHigh}`,
      status: painChange.status,
      tone: painChange.tone,
      series: pain,
      max: 10,
      reading: `Pain at each check-in: ${pain.join(', ')} out of 10.`,
    },
    {
      id: 'mobility',
      label: 'Mobility',
      value: mobilityChange.status === 'Improving' ? '↑' : mobilityChange.status === 'Worse' ? '↓' : '→',
      status: mobilityChange.status,
      tone: mobilityChange.tone,
      series: movement.map((m) => movementScale[m] ?? 2),
      max: 3,
      reading: `How movement felt at each check-in: ${movement.join(', ')}.`,
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      value: `${first} → ${last}`,
      status: difficultyChange.status.replace('Getting ', '').replace(/^\w/, (c) => c.toUpperCase()),
      tone: difficultyChange.tone,
      series: difficulty,
      max: 10,
      reading: `Session difficulty at each check-in: ${difficulty.join(', ')} out of 10.`,
    },
  ]
}

// One signal, in a card of its own: its name, where it stands, the line it took, and what that reads as.
// Lighter than the card below it, so the eye reads the three of them as the evidence and that as the answer.
function Signal({ signal }: { signal: OverviewSignal }) {
  return (
    <div className="rounded-2xl bg-surface/75 px-3 pt-2.5 pb-3">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-ink-faint uppercase">{signal.label}</p>
      <p className="mt-1 text-[17px] leading-none font-semibold text-ink tabular-nums">{signal.value}</p>
      <Spark values={signal.series} max={signal.max} tone={signal.tone} label={signal.reading} />
      <p className={`mt-0.5 text-[12px] leading-snug ${toneStatusText[signal.tone]}`}>{signal.status}</p>
    </div>
  )
}

// The smallest honest chart: the series itself, no axis, no scale, no point markers.
function Spark({ values, max, tone, label }: { values: number[]; max: number; tone: SignalTone; label: string }) {
  const W = 46
  const H = 14
  const x = (i: number) => 1 + (i / Math.max(values.length - 1, 1)) * (W - 2)
  const y = (v: number) => 1 + (1 - v / max) * (H - 2)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-[14px] w-[46px]" role="img" aria-label={label}>
      <polyline
        points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
        fill="none"
        className={tone === 'attention' ? 'stroke-concern' : 'stroke-accent'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// One signal: where it stands, which way it is going, and what that means. The line is small on purpose.
function Trend({ signal }: { signal: TrendSignal }) {
  return (
    <li className="py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-semibold text-ink">{signal.label}</h3>
        <span className={`text-[15px] font-medium ${toneStatusText[signal.tone]}`}>{signal.status}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-[19px] leading-none font-semibold tracking-[-0.01em] text-ink tabular-nums">
          {signal.value}
        </p>
        <MiniTrend
          values={signal.series}
          max={signal.max}
          label={signal.seriesLabel}
          showRange={false}
          tone={signal.tone === 'attention' ? 'concern' : 'accent'}
          width={110}
        />
      </div>
      <p className="mt-2 text-[15px] leading-snug text-ink-soft">{signal.reading}</p>
    </li>
  )
}

const outcomeStyle = {
  Completed: { mark: Check, className: 'text-positive' },
  'Partly completed': { mark: Check, className: 'text-ink-soft' },
  Missed: { mark: Minus, className: 'text-ink-soft' },
}

function Activity({ session }: { session: SessionRecord }) {
  const { mark: Mark, className } = outcomeStyle[session.outcome]
  return (
    <li className="flex items-baseline justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-caption text-ink-soft tabular-nums">
          {session.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </p>
        <p className="mt-0.5 text-[17px] font-medium text-ink">{session.focus}</p>
      </div>
      <p className={`flex shrink-0 items-center gap-1.5 text-[15px] ${className}`}>
        <Mark className="size-4" strokeWidth={2.5} aria-hidden />
        {session.outcome}
      </p>
    </li>
  )
}
