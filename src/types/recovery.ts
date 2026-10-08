// How a signal should read to the user. Tone drives colour; it is never a score.
export type SignalTone = 'positive' | 'neutral' | 'attention'

export type RecoverySignal = {
  id: 'pain' | 'mobility' | 'difficulty'
  label: string
  status: string
  tone: SignalTone
}

// A signal with the evidence behind its status, for the Recovery Insight screen.
export type InsightSignal = RecoverySignal & { detail: string }

// The one-line read of all signals together.
export type RecoveryOverall = Omit<RecoverySignal, 'id'>

export type RecoveryInsight = {
  title: string
  text: string
  basis: string
}

export type TodayPlan = {
  exerciseCount: number
  durationMinutes: number
  focus: string[]
  prescribedBy: string
}
