import { ArrowRight, Check, FileText, Minus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { MiniTrend } from '../components/MiniTrend'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { RecoveryBasisSheet } from '../components/RecoveryBasisSheet'
import { SegmentedControl } from '../components/SegmentedControl'
import { Section } from '../components/Section'
import { currentAssessment } from '../data/assessment'
import { progressPeriods, progressTrends } from '../data/progress'
import type { TrendSignal } from '../data/progress'
import { sessionHistory } from '../data/sessions'
import type { SessionRecord } from '../data/sessions'
import { sinceLastAppointment } from '../data/summary'
import type { ProgressRangeId } from '../types/progress'
import { useCare } from '../utils/care'
import { toneDot, toneStatusText } from '../utils/tone'

const shownAtFirst = 2

// Progress answers one question: is my recovery actually improving? The reading comes first in words,
// then the three signals behind it, then what has actually happened, then the next professional review.
// What to do next lives on Home; this screen only looks back.
export function ProgressScreen() {
  const { professional } = useCare()
  const [range, setRange] = useState<ProgressRangeId>('7d')
  const [allSessions, setAllSessions] = useState(false)
  const [basisOpen, setBasisOpen] = useState(false)
  const assessment = currentAssessment(professional)
  const sessions = allSessions ? sessionHistory : sessionHistory.slice(0, shownAtFirst)

  return (
    <div className="flex flex-col gap-7 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      {/* The outcome, in words, before any chart; the interpretation behind it sits in its own quiet surface. */}
      <header>
        <p className="text-[12px] font-semibold tracking-[0.16em] text-ink-faint uppercase">Progress</p>
        <h1 className="mt-2.5 text-[30px] leading-[1.12] font-bold tracking-[-0.025em] text-ink">
          {assessment.onTrack ? 'Your recovery is progressing' : 'Some signals are worth checking'}
        </h1>
        <p className="mt-2.5 flex items-center gap-2.5 text-[17px] font-semibold text-ink">
          <span className={`size-2.5 rounded-full ring-4 ${toneDot[assessment.tone]}`} aria-hidden />
          {assessment.verdict}
        </p>

        <Card tone="featured" className="mt-4 px-5 py-4">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-accent uppercase">What changed</p>
          <p className="mt-2 text-[17px] leading-relaxed text-ink">{assessment.headline}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            Based on {assessment.checkInCount} check-ins {assessment.scope}.
          </p>
          <button
            type="button"
            onClick={() => setBasisOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={basisOpen}
            className="-ml-1 -mb-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-[15px] font-semibold text-accent"
          >
            More details
            <ArrowRight className="size-4" aria-hidden />
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

      {basisOpen && (
        <RecoveryBasisSheet assessment={assessment} professional={professional} onClose={() => setBasisOpen(false)} />
      )}
    </div>
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
