export type CheckIn = {
  pain?: number
  difficulty?: string
  movement?: string
  // "Are you unsure about anything?" — any number, including none.
  unsure: string[]
  note: string
}

export type CheckInStepId = 'pain' | 'difficulty' | 'movement' | 'unsure'

export type CheckInStep = {
  id: CheckInStepId
  question: string
  hint?: string
}
