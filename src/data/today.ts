import type { RecoveryInsight, RecoveryOverall, RecoverySignal, TodayPlan } from '../types/recovery'

export const todayPlan: TodayPlan = {
  exerciseCount: 4,
  durationMinutes: 25,
  focus: ['Mobility', 'Strength'],
  prescribedBy: 'your physiotherapist',
}

export const recoveryOverall: RecoveryOverall = {
  label: 'Overall status',
  status: 'Stable',
  tone: 'positive',
}

export const recoverySignals: RecoverySignal[] = [
  { id: 'pain', label: 'Pain', status: 'Stable', tone: 'positive' },
  { id: 'mobility', label: 'Mobility', status: 'Improving', tone: 'positive' },
  { id: 'difficulty', label: 'Session difficulty', status: 'Getting easier', tone: 'positive' },
]

export const recoveryInsight: RecoveryInsight = {
  title: 'What changed',
  text: 'Your pain has remained stable while your recent sessions are becoming easier.',
  basis: 'Based on your recent check-ins',
}
