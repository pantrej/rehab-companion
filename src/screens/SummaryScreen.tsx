import { Share2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { CheckInList } from '../components/CheckInList'
import { CheckInNotes } from '../components/CheckInNotes'
import { RecoverySignalsCard } from '../components/RecoverySignalsCard'
import { Section } from '../components/Section'
import { ShareSummarySheet } from '../components/ShareSummarySheet'
import { lastSevenDays, sinceLastAppointment } from '../data/summary'
import { useCare } from '../utils/care'

// A portable read of recent recovery, for a professional to look at. Connected care scopes it to the
// time since the last appointment; independent users get the last 7 days.
export function SummaryScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { professional } = useCare()
  const [shareOpen, setShareOpen] = useState(false)
  const closeShare = useCallback(() => setShareOpen(false), [])

  const summary = professional ? sinceLastAppointment(professional.daysSinceLastAppointment) : lastSevenDays()
  const scope = professional
    ? `Since your last appointment on ${professional.lastAppointment}`
    : 'Last 7 days'
  // Back returns to wherever the summary was opened from; a direct visit falls back to Progress.
  const back = () => (location.key === 'default' ? navigate('/progress') : navigate(-1))

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <header>
          <BackButton label="Back" onClick={back} />
          <h1 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Recovery summary</h1>
          <p className="mt-1.5 text-[15px] text-ink-soft">
            {scope} · {summary.records.length} check-ins
          </p>
        </header>

        <Section id="summary-signals" title="Recovery signals">
          <RecoverySignalsCard
            signals={summary.signals}
            pain={{ points: summary.painPoints, reading: summary.painReading }}
            difficulty={{ points: summary.difficultyPoints, reading: summary.difficultyReading }}
          />
        </Section>

        <Section id="summary-check-ins" title="Check-ins">
          <CheckInList records={summary.records} />
        </Section>

        <Section id="summary-notes" title="Your notes">
          <CheckInNotes />
        </Section>

        <p className="px-1 text-[13px] leading-relaxed text-ink-faint">
          These are self-reported signals from your check-ins. They are not a diagnosis.
        </p>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button
          aria-haspopup="dialog"
          onClick={() => setShareOpen(true)}
          icon={<Share2 className="size-4" strokeWidth={1.75} aria-hidden />}
        >
          {professional ? `Share with ${professional.name}` : 'Share recovery summary'}
        </Button>
      </div>

      {shareOpen && <ShareSummarySheet summary={summary} professional={professional} onClose={closeShare} />}
    </div>
  )
}
