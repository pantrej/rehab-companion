import type { Assessment } from '../data/assessment'
import type { Professional } from '../types/care'
import { ModalSheet } from './ModalSheet'

type Props = {
  assessment: Assessment
  professional?: Professional
  onClose: () => void
}

// What the reading on Progress is actually based on: one line per signal, in the user's own check-ins,
// and nothing beyond them. It explains the reading; it does not assess anything.
export function RecoveryBasisSheet({ assessment, professional, onClose }: Props) {
  const difficulty = assessment.series.difficulty
  const detail = (id: string, text: string) =>
    id === 'difficulty'
      ? `Session difficulty changed from ${difficulty[0]}/10 to ${difficulty[difficulty.length - 1]}/10.`
      : `${text}.`

  return (
    <ModalSheet
      title={assessment.onTrack ? 'Why this appears on track' : 'Why this is worth checking'}
      closeLabel="Close details"
      onClose={onClose}
    >
      {() => (
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pt-3">
          <dl className="flex flex-col gap-5">
            {assessment.changes.map((change) => (
              <div key={change.id}>
                <dt className="text-[15px] font-semibold text-ink">{change.label}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">{detail(change.id, change.detail)}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[15px] font-semibold text-ink">
                {professional ? 'Since your last review' : 'Recent check-ins'}
              </dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                {professional
                  ? `${assessment.checkInCount} check-ins have been recorded since the appointment on ${professional.lastAppointment}.`
                  : `${assessment.checkInCount} check-ins have been recorded ${assessment.scope}.`}
              </dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-line pt-4 text-caption leading-relaxed text-ink-faint">
            This summary reflects your recent check-ins and rehabilitation activity. It isn’t a medical assessment.
          </p>
        </div>
      )}
    </ModalSheet>
  )
}
