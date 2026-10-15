import type { CheckInRecord } from '../types/progress'
import type { Professional } from '../types/care'
import type { InsightSignal, SignalTone } from '../types/recovery'
import { recentCheckIns } from './progress'

// Answers "what changed, is it on track, what next" from the user's own check-ins.
// The rules are stated to the user as they are applied: this is a reading of self-reported signals
// against the pattern a home rehabilitation plan aims for, not a clinical judgement.

export type Assessment = {
  scope: string
  checkInCount: number
  onTrack: boolean
  verdict: string
  tone: SignalTone
  headline: string
  changes: InsightSignal[]
  checks: { label: string; ok: boolean }[]
  // Oldest first, for the small charts that sit beside each signal.
  series: {
    pain: number[]
    difficulty: number[]
    movement: CheckInRecord['movement'][]
    painLow: number
    painHigh: number
  }
}

// What would change the reading. Kept short and general; each points to professional input.
export const watchFor = [
  'Pain rising across two or more check-ins',
  'Sessions feeling harder for several days in a row',
  'New symptoms, such as numbness, tingling or weakness',
]

export const onTrackRule =
  'We read recovery as on track when pain holds steady or eases while sessions get easier or movement improves.'

export function assess(records: CheckInRecord[], scope: string): Assessment {
  const oldestFirst = [...records].reverse()
  const first = oldestFirst[0]
  const last = oldestFirst[oldestFirst.length - 1]
  const pains = records.map((r) => r.pain)
  const low = Math.min(...pains)
  const high = Math.max(...pains)
  const better = records.filter((r) => r.movement === 'Better').length
  const worse = records.filter((r) => r.movement === 'Worse').length

  const painSteady = last.pain <= first.pain || high - low <= 1
  const easier = last.difficulty <= first.difficulty
  const checks = [
    { label: `Pain stayed within ${low}–⁠${high}/10`, ok: painSteady },
    { label: `Sessions rated ${first.difficulty}/10 at first, ${last.difficulty}/10 most recently`, ok: easier },
    { label: worse ? `Movement felt worse in ${worse} check-ins` : 'Movement hasn’t felt worse', ok: worse === 0 },
  ]
  const onTrack = checks.every((c) => c.ok)

  // A one-point dip inside the usual range is still "steady"; easing means a clear drop.
  const painPhrase = last.pain <= first.pain - 2 ? 'Pain is easing' : painSteady ? 'Pain is holding steady' : 'Pain has risen'
  const effortPhrase =
    last.difficulty < first.difficulty
      ? 'your sessions are getting easier'
      : last.difficulty > first.difficulty
        ? 'your sessions are getting harder'
        : 'sessions feel about the same'

  return {
    scope,
    checkInCount: records.length,
    onTrack,
    verdict: onTrack ? 'Appears on track' : 'Worth checking',
    tone: onTrack ? 'positive' : 'attention',
    headline: `${painPhrase} while ${effortPhrase}.`,
    changes: [
      {
        id: 'pain',
        label: 'Pain',
        status: painSteady ? 'Stable' : 'Rising',
        tone: painSteady ? 'positive' : 'attention',
        detail: low === high ? `${low}/10 in every check-in` : `Between ${low} and ${high} out of 10 in every check-in`,
      },
      {
        id: 'mobility',
        label: 'Mobility',
        status: better > records.length / 2 ? 'Improving' : worse ? 'Worse' : 'About the same',
        tone: worse ? 'attention' : better > records.length / 2 ? 'positive' : 'neutral',
        detail: `Movement felt better in ${better} of ${records.length} check-ins`,
      },
      {
        id: 'difficulty',
        label: 'Session difficulty',
        status: last.difficulty < first.difficulty ? 'Getting easier' : last.difficulty > first.difficulty ? 'Getting harder' : 'Unchanged',
        tone: last.difficulty > first.difficulty ? 'attention' : 'positive',
        detail: `${first.difficulty}/10 → ${last.difficulty}/10`,
      },
    ],
    checks,
    series: {
      pain: oldestFirst.map((r) => r.pain),
      difficulty: oldestFirst.map((r) => r.difficulty),
      movement: oldestFirst.map((r) => r.movement),
      painLow: low,
      painHigh: high,
    },
  }
}

// Connected care reads the time since the last appointment, so it lines up with the next review;
// independent users get the last 7 days. `records` is the live list of check-ins, so a session checked
// in on this device is part of the reading as soon as it is saved.
export function currentAssessment(professional?: Professional, records: CheckInRecord[] = recentCheckIns) {
  return professional
    ? assess(
        records.filter((r) => r.daysAgo < professional.daysSinceLastAppointment),
        `since your last appointment on ${professional.lastAppointment}`,
      )
    : assess(records, 'in the last 7 days')
}
