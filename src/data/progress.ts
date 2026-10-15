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
export const movementScale: Record<Movement, number> = { Worse: 1, 'About the same': 2, Better: 3 }
// The month before the recent check-ins, oldest first.
const earlierDifficulty = [8, 8, 7, 7, 7, 6, 7, 6]
const earlierMovement = [2, 2, 1, 2, 3, 2, 3, 3]

// The trend cards, built from the live check-ins so they say the same thing as the reading above them.
// Each signal's status comes from the assessment, not from a second opinion written here: one rule, one
// verdict, whichever part of Progress is showing it.
export function buildTrends(records: CheckInRecord[], changes: InsightSignal[]): Record<ProgressRangeId, TrendSignal[]> {
  const oldestFirst = [...records].reverse()
  const pain = oldestFirst.map((c) => c.pain)
  const difficulty = oldestFirst.map((c) => c.difficulty)
  const movement = oldestFirst.map((c) => movementScale[c.movement])
  const status = (id: InsightSignal['id']) => changes.find((c) => c.id === id) ?? changes[0]
  const low = Math.min(...pain)
  const high = Math.max(...pain)
  // An en dash with a word joiner after it, so a range never breaks across two lines.
  const span = (values: number[]) => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    return min === max ? `${min} / 10` : `${min}\u2013\u2060${max} / 10`
  }
  const first = difficulty[0]
  const last = difficulty[difficulty.length - 1]
  const movementReading = (scope: string) =>
    status('mobility').status === 'Improving'
      ? `Movement has gradually improved across ${scope}.`
      : status('mobility').status === 'Worse'
        ? `Movement has felt worse across ${scope}.`
        : `Movement has felt about the same across ${scope}.`
  const difficultyReading = (scope: string) =>
    last < first
      ? `Exercises have felt easier across ${scope}.`
      : last > first
        ? `Exercises have felt harder across ${scope}.`
        : `Exercises have felt about the same across ${scope}.`
  const monthPain = [...earlierPain.map(([, value]) => value), ...pain]
  const monthDifficulty = [...earlierDifficulty, ...difficulty]
  const monthMovement = [...earlierMovement, ...movement]

  return {
    '7d': [
      {
        id: 'pain',
        label: 'Pain',
        status: status('pain').status,
        tone: status('pain').tone,
        value: span(pain),
        series: pain,
        max: 10,
        seriesLabel: 'Pain at each check-in, out of 10',
        reading:
          low === high
            ? `Held at ${low} out of 10 over the last 7 days.`
            : `Stayed between ${low} and ${high} out of 10 over the last 7 days.`,
      },
      {
        id: 'mobility',
        label: 'Mobility',
        status: status('mobility').status,
        tone: status('mobility').tone,
        value: `${arrow(status('mobility').status)} across ${records.length} check-ins`,
        series: movement,
        max: 3,
        seriesLabel: 'How movement felt at each check-in, from worse to better',
        reading: movementReading('recent check-ins'),
      },
      {
        id: 'difficulty',
        label: 'Session difficulty',
        status: status('difficulty').status,
        tone: status('difficulty').tone,
        value: `${first}/10 → ${last}/10`,
        series: difficulty,
        max: 10,
        seriesLabel: 'Session difficulty at each check-in, out of 10',
        reading: difficultyReading('recent sessions'),
      },
    ],
    '30d': [
      {
        id: 'pain',
        label: 'Pain',
        status: status('pain').status,
        tone: status('pain').tone,
        value: span(monthPain),
        series: monthPain,
        max: 10,
        seriesLabel: 'Pain at each check-in this month, out of 10',
        reading: `Stayed between ${Math.min(...monthPain)} and ${Math.max(...monthPain)} out of 10 this month, and between ${low} and ${high} recently.`,
      },
      {
        id: 'mobility',
        label: 'Mobility',
        status: status('mobility').status,
        tone: status('mobility').tone,
        value: `${arrow(status('mobility').status)} over the month`,
        series: monthMovement,
        max: 3,
        seriesLabel: 'How movement felt at each check-in this month, from worse to better',
        reading: movementReading('the month'),
      },
      {
        id: 'difficulty',
        label: 'Session difficulty',
        status: status('difficulty').status,
        tone: status('difficulty').tone,
        value: `${monthDifficulty[0]}/10 → ${monthDifficulty[monthDifficulty.length - 1]}/10`,
        series: monthDifficulty,
        max: 10,
        seriesLabel: 'Session difficulty at each check-in this month, out of 10',
        reading: difficultyReading('the month'),
      },
    ],
  }
}

const arrow = (status: string) => (status === 'Improving' ? '↑' : status === 'Worse' ? '↓' : '→')

export const whatChangedRecently = 'Your sessions are becoming easier while pain remains stable.'
