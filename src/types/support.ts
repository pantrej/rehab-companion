import type { CareMode } from './care'

export type SupportOutcome = 'guidance' | 'monitor' | 'professional'

// Copy may contain "{pro}": the connected professional's name, or "a rehabilitation professional".
// A step can also differ by care mode where the wording, not just the name, changes.
export type CareText = string | Record<CareMode, string>

export type SupportTopic = {
  id: string
  label: string
  outcome: SupportOutcome
  message: CareText
  // What the user's own recent check-ins say about this topic, if anything.
  context?: string
  steps: CareText[]
  related?: { label: string; to: string }
  // Shown only where it matters: a plain pointer to urgent care.
  urgentNote?: string
}
