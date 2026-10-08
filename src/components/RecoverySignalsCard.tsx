import type { TrendPoint } from '../types/progress'
import type { InsightSignal } from '../types/recovery'
import { Card } from './Card'
import { SignalDetail } from './SignalDetail'
import { TrendLine } from './TrendLine'

type Trend = {
  points: TrendPoint[]
  reading: string
}

type Props = {
  signals: InsightSignal[]
  pain: Trend
  // Shown where a professional may review the summary; Progress keeps to the pain trend alone.
  difficulty?: Trend
}

// The three recovery signals with their evidence. Every chart is followed by a sentence saying what it shows.
export function RecoverySignalsCard({ signals, pain, difficulty }: Props) {
  const trends: Partial<Record<InsightSignal['id'], Trend & { label: string }>> = {
    pain: { ...pain, label: 'Pain at each check-in, out of 10' },
    ...(difficulty && { difficulty: { ...difficulty, label: 'Session difficulty at each check-in, out of 10' } }),
  }

  return (
    <Card className="px-6 py-2">
      <ul className="divide-y divide-line">
        {signals.map((signal) => {
          const trend = trends[signal.id]
          return (
            <SignalDetail key={signal.id} {...signal}>
              {trend && (
                <>
                  <TrendLine points={trend.points} max={10} label={trend.label} formatValue={(v) => `${v}/10`} />
                  <p className="mt-3 text-[15px] leading-relaxed text-ink">{trend.reading}</p>
                </>
              )}
            </SignalDetail>
          )
        })}
      </ul>
    </Card>
  )
}
