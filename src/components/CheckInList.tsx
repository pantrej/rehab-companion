import { daysAgoLabel, movementTone } from '../data/progress'
import type { CheckInRecord } from '../types/progress'
import { toneText } from '../utils/tone'
import { Card } from './Card'

// Recent check-ins as plain rows: when, pain and difficulty, and the movement comparison.
export function CheckInList({ records }: { records: CheckInRecord[] }) {
  return (
    <Card className="px-6 py-2">
      <ul className="divide-y divide-line">
        {records.map((c) => (
          <li key={c.daysAgo} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-base font-medium text-ink">{daysAgoLabel(c.daysAgo)}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                Pain {c.pain}/10 · Difficulty {c.difficulty}/10
              </p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-ink-faint">Movement</p>
              <p className={`text-[15px] font-medium ${toneText[movementTone[c.movement]]}`}>{c.movement}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
