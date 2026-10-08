import type { InsightSignal } from './recovery'

export type Movement = 'Better' | 'About the same' | 'Worse'

export type CheckInRecord = {
  daysAgo: number
  pain: number
  difficulty: number
  movement: Movement
}

export type TrendPoint = {
  label: string
  value: number
}

export type ProgressRangeId = '7d' | '30d'

export type ProgressPeriod = {
  id: ProgressRangeId
  label: string
  painPoints: TrendPoint[]
  // Every chart carries a sentence that says what it shows.
  painReading: string
  signals: InsightSignal[]
}
