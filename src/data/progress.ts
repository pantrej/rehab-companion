import type { CheckInRecord, Movement, ProgressPeriod, TrendPoint } from '../types/progress'
import type { InsightSignal, SignalTone } from '../types/recovery'

// One consistent recent history behind Home, Progress and Insight:
// pain steady at 2–3/10, movement better in the last 3 check-ins, difficulty 7/10 → 5/10.
export const recentCheckIns: CheckInRecord[] = [
  { daysAgo: 0, pain: 2, difficulty: 5, movement: 'Better' },
  { daysAgo: 2, pain: 3, difficulty: 6, movement: 'Better' },
  { daysAgo: 4, pain: 2, difficulty: 7, movement: 'Better' },
  { daysAgo: 6, pain: 3, difficulty: 7, movement: 'About the same' },
]

// Older check-ins, only shown on the 30-day view. Oldest first.
const earlierPain: [number, number][] = [
  [27, 4],
  [24, 3],
  [21, 4],
  [18, 3],
  [15, 3],
  [13, 3],
  [11, 2],
  [9, 3],
]

export function daysAgoLabel(days: number) {
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`
}

export const movementTone: Record<Movement, SignalTone> = {
  Better: 'positive',
  'About the same': 'neutral',
  Worse: 'attention',
}

const recentPain: TrendPoint[] = [...recentCheckIns]
  .reverse()
  .map((c) => ({ label: daysAgoLabel(c.daysAgo), value: c.pain }))

const mobility: InsightSignal = {
  id: 'mobility',
  label: 'Mobility',
  status: 'Improving',
  tone: 'positive',
  detail: 'Improved across 3 recent check-ins.',
}

const pain = (detail: string): InsightSignal => ({
  id: 'pain',
  label: 'Pain',
  status: 'Stable',
  tone: 'positive',
  detail,
})

const difficulty = (detail: string): InsightSignal => ({
  id: 'difficulty',
  label: 'Session difficulty',
  status: 'Getting easier',
  tone: 'positive',
  detail,
})

export const progressPeriods: ProgressPeriod[] = [
  {
    id: '7d',
    label: '7 days',
    painPoints: recentPain,
    painReading: 'Pain has stayed between 2 and 3 out of 10 across your last 4 check-ins.',
    signals: [
      pain('Current: 2–\u20603/10'),
      mobility,
      difficulty('Average difficulty decreased from 7/10 to 5/10.'),
    ],
  },
  {
    id: '30d',
    label: '30 days',
    painPoints: [...earlierPain.map(([d, value]) => ({ label: daysAgoLabel(d), value })), ...recentPain],
    painReading: 'Pain has stayed between 2 and 4 out of 10 this month, and between 2 and 3 recently.',
    signals: [
      pain('Current: 2–\u20603/10'),
      mobility,
      difficulty('Average difficulty decreased from 8/10 to 5/10.'),
    ],
  },
]

export const progressSummary =
  'Your recent recovery signals are mostly stable, with gradual improvement in mobility and exercise tolerance.'

export const whatChangedRecently = 'Your sessions are becoming easier while pain remains stable.'
