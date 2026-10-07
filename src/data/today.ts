import type { RecoverySignal, TodayPlan } from '../types/recovery'

export const todayPlan: TodayPlan = {
  exerciseCount: 4,
  durationMinutes: 25,
  focus: ['Mobility', 'Strength'],
  prescribedBy: 'your physiotherapist',
}

export const recoverySignals: RecoverySignal[] = [
  { id: 'pain', label: 'Pain', status: 'Stable', tone: 'positive' },
  { id: 'mobility', label: 'Mobility', status: 'Improving', tone: 'positive' },
  { id: 'difficulty', label: 'Session difficulty', status: 'Getting easier', tone: 'positive' },
]

export const recoveryInsight = {
  text: 'Your pain has remained stable while your recent sessions are becoming easier.',
  basis: 'Based on your last 7 check-ins',
}
