import type { CheckInRecord, Movement, ProgressPeriod, ProgressRangeId, TrendPoint } from '../types/progress'
import type { InsightSignal, SignalTone } from '../types/recovery'

// One consistent recent history behind Home, Progress, Insight and the calendar (today is 9 October):
// pain steady at 2–3/10, movement better in the 3 check-ins since the 3 October appointment,
// difficulty 7/10 → 5/10, and the calf tightness in the 2 October session that led to the plan update.
export const recentCheckIns: CheckInRecord[] = [
  { daysAgo: 2, pain: 2, difficulty: 5, movement: 'Better', note: 'Walking felt easier today.' },
  { daysAgo: 3, pain: 3, difficulty: 6, movement: 'Better' },
  { daysAgo: 5, pain: 2, difficulty: 7, movement: 'Better' },
  { daysAgo: 7, pain: 3, difficulty: 7, movement: 'About the same', note: 'Calf felt tight during the loaded raises.' },
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

// One compact module per recovery signal on Progress: where it stands now, which way it is going, and one
// plain sentence saying what that means. Small series, oldest first, on their own scale.
export type TrendSignal = {
  id: InsightSignal['id']
  label: string
  status: string
  tone: SignalTone
  // The headline reading: a range, a direction, or a first → latest pair.
  value: string
  series: number[]
  max: number
  // What the series is, for anyone who can't see it.
  seriesLabel: string
  reading: string
}

// Self-reported movement, drawn on its own three-step scale.
const movementScale: Record<Movement, number> = { Worse: 1, 'About the same': 2, Better: 3 }
const recentMovement = [...recentCheckIns].reverse().map((c) => movementScale[c.movement])
const recentDifficulty = [...recentCheckIns].reverse().map((c) => c.difficulty)
// The month before the recent check-ins, oldest first.
const earlierDifficulty = [8, 8, 7, 7, 7, 6, 7, 6]
const earlierMovement = [2, 2, 1, 2, 3, 2, 3, 3]

export const progressTrends: Record<ProgressRangeId, TrendSignal[]> = {
  '7d': [
    {
      id: 'pain',
      label: 'Pain',
      status: 'Stable',
      tone: 'positive',
      value: '2–⁠3 / 10',
      series: [...recentCheckIns].reverse().map((c) => c.pain),
      max: 10,
      seriesLabel: 'Pain at each check-in, out of 10',
      reading: 'Stayed within your usual range over the last 7 days.',
    },
    {
      id: 'mobility',
      label: 'Mobility',
      status: 'Improving',
      tone: 'positive',
      value: '↑ across 3 check-ins',
      series: recentMovement,
      max: 3,
      seriesLabel: 'How movement felt at each check-in, from worse to better',
      reading: 'Movement has gradually improved across recent check-ins.',
    },
    {
      id: 'difficulty',
      label: 'Session difficulty',
      status: 'Getting easier',
      tone: 'positive',
      value: '7/10 → 5/10',
      series: recentDifficulty,
      max: 10,
      seriesLabel: 'Session difficulty at each check-in, out of 10',
      reading: 'Exercises have felt easier across recent sessions.',
    },
  ],
  '30d': [
    {
      id: 'pain',
      label: 'Pain',
      status: 'Stable',
      tone: 'positive',
      value: '2–⁠4 / 10',
      series: [...earlierPain.map(([, value]) => value), ...[...recentCheckIns].reverse().map((c) => c.pain)],
      max: 10,
      seriesLabel: 'Pain at each check-in this month, out of 10',
      reading: 'Stayed between 2 and 4 out of 10 this month, and between 2 and 3 recently.',
    },
    {
      id: 'mobility',
      label: 'Mobility',
      status: 'Improving',
      tone: 'positive',
      value: '↑ over the month',
      series: [...earlierMovement, ...recentMovement],
      max: 3,
      seriesLabel: 'How movement felt at each check-in this month, from worse to better',
      reading: 'Movement has improved overall, after steadier weeks earlier in the month.',
    },
    {
      id: 'difficulty',
      label: 'Session difficulty',
      status: 'Getting easier',
      tone: 'positive',
      value: '8/10 → 5/10',
      series: [...earlierDifficulty, ...recentDifficulty],
      max: 10,
      seriesLabel: 'Session difficulty at each check-in this month, out of 10',
      reading: 'Sessions have felt steadily easier since the start of the month.',
    },
  ],
}

export const whatChangedRecently = 'Your sessions are becoming easier while pain remains stable.'
