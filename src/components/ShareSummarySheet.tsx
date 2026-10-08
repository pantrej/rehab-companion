import { useState } from 'react'
import type { RecoverySummary } from '../data/summary'
import { daysAgoLabel } from '../data/progress'
import type { Professional } from '../types/care'
import { Button } from './Button'
import { Sheet } from './Sheet'

type Props = {
  summary: RecoverySummary
  professional?: Professional
  onClose: () => void
}

function summaryText(summary: RecoverySummary) {
  return [
    `Recovery summary (${summary.scope})`,
    ...summary.signals.map((s) => `${s.label}: ${s.status}. ${s.detail}`.replaceAll('⁠', '')),
    summary.painReading,
    summary.difficultyReading,
    'Check-ins:',
    ...summary.records.map(
      (r) => `- ${daysAgoLabel(r.daysAgo)}: pain ${r.pain}/10, difficulty ${r.difficulty}/10, movement ${r.movement.toLowerCase()}`,
    ),
    'This summary describes self-reported signals. It is not a diagnosis.',
  ].join('\n')
}

// Prototype sharing: connected care confirms the summary is available for review (never implying it has
// been reviewed); independent users can copy it to send to a professional they choose.
export function ShareSummarySheet({ summary, professional, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  if (professional) {
    return (
      <Sheet title={`Shared with ${professional.name}`} onClose={onClose}>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          {professional.name} can look at this summary before your appointment on {professional.nextAppointment}.
          Summaries aren’t monitored in real time, so contact {professional.clinic} if something changes.
        </p>
        <Button className="mt-6" onClick={onClose}>
          Done
        </Button>
      </Sheet>
    )
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText(summary))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Sheet title="Share your recovery summary" onClose={onClose}>
      <p className="mt-2 text-base leading-relaxed text-ink-soft">
        You can send this summary to a rehabilitation professional you choose. It includes your recent signals and
        check-ins, and no diagnosis.
      </p>
      <div className="mt-6 flex flex-col gap-1">
        <Button onClick={copy}>{copied ? 'Copied to clipboard' : 'Copy summary'}</Button>
        <Button variant="quiet" onClick={onClose}>
          Done
        </Button>
      </div>
    </Sheet>
  )
}
