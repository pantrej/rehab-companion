export type SupportOutcome = 'guidance' | 'monitor' | 'professional'

export type SupportTopic = {
  id: string
  label: string
  outcome: SupportOutcome
  message: string
  // What the user's own recent check-ins say about this topic, if anything.
  context?: string
  steps: string[]
  related?: { label: string; to: string }
  // Shown only where it matters: a plain pointer to urgent care.
  urgentNote?: string
}
