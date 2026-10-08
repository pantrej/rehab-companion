import type { CheckInRecord, TrendPoint } from '../types/progress'
import type { InsightSignal } from '../types/recovery'
import { daysAgoLabel, recentCheckIns } from './progress'

export type RecoverySummary = {
  scope: string
  records: CheckInRecord[]
  painPoints: TrendPoint[]
  painReading: string
  difficultyPoints: TrendPoint[]
  difficultyReading: string
  signals: InsightSignal[]
}

// Readings are computed from the records, so a summary can never contradict its own check-ins.
export function summarize(records: CheckInRecord[], scope: string): RecoverySummary {
  const oldestFirst = [...records].reverse()
  const pains = records.map((r) => r.pain)
  const lowPain = Math.min(...pains)
  const highPain = Math.max(...pains)
  const firstDifficulty = oldestFirst[0].difficulty
  const lastDifficulty = oldestFirst[oldestFirst.length - 1].difficulty
  const better = records.filter((r) => r.movement === 'Better').length
  const count = `${records.length} check-ins`

  return {
    scope,
    records,
    painPoints: oldestFirst.map((r) => ({ label: daysAgoLabel(r.daysAgo), value: r.pain })),
    painReading: `Pain has stayed between ${lowPain} and ${highPain} out of 10 across ${count} ${scope}.`,
    difficultyPoints: oldestFirst.map((r) => ({ label: daysAgoLabel(r.daysAgo), value: r.difficulty })),
    difficultyReading:
      lastDifficulty < firstDifficulty
        ? `Sessions were rated easier over time, from ${firstDifficulty}/10 to ${lastDifficulty}/10.`
        : `Session difficulty has stayed around ${lastDifficulty}/10.`,
    signals: [
      { id: 'pain', label: 'Pain', status: 'Stable', tone: 'positive', detail: `Current: ${lowPain}–⁠${highPain}/10` },
      {
        id: 'mobility',
        label: 'Mobility',
        status: 'Improving',
        tone: 'positive',
        detail: `Movement reported better in ${better} of ${count} ${scope}.`,
      },
      {
        id: 'difficulty',
        label: 'Session difficulty',
        status: 'Getting easier',
        tone: 'positive',
        detail: `Rated ${firstDifficulty}/10 at first, ${lastDifficulty}/10 most recently.`,
      },
    ],
  }
}

export const sinceLastAppointment = (days: number) =>
  summarize(
    recentCheckIns.filter((r) => r.daysAgo < days),
    'since your last appointment',
  )

export const lastSevenDays = () => summarize(recentCheckIns, 'in the last 7 days')
