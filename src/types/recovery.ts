// How a signal should read to the user. Tone drives colour; it is never a score.
export type SignalTone = 'positive' | 'neutral' | 'attention'

export type RecoverySignal = {
  id: 'pain' | 'mobility' | 'difficulty'
  label: string
  status: string
  tone: SignalTone
}

export type TodayPlan = {
  exerciseCount: number
  durationMinutes: number
  focus: string[]
  prescribedBy: string
}
