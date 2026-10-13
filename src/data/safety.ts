import type { SignalTone } from '../types/recovery'

// General exercise-safety guidance, in three tiers. Deliberately plain and non-diagnostic: it helps
// someone decide whether to carry on, ease off or stop, and points to their professional for the rest.
// "{pro}" is the connected professional's name, or "a rehabilitation professional".
export const safetyTiers: { id: string; tone: SignalTone; title: string; when: string; action: string }[] = [
  {
    id: 'continue',
    tone: 'positive',
    title: 'Usually fine to continue',
    when: 'Muscle effort, stretching, or mild discomfort that settles soon after you stop.',
    action: 'Keep going at a steady, controlled pace.',
  },
  {
    id: 'modify',
    tone: 'neutral',
    title: 'Ease off',
    when: 'Discomfort that builds during a set, or is still there the next day.',
    action: 'Do fewer repetitions, slow down, or use a smaller range, and note it in your check-in.',
  },
  {
    id: 'stop',
    tone: 'attention',
    title: 'Stop and contact {pro}',
    when: 'Sharp or worsening pain, pain spreading into a leg or arm, or numbness, tingling or weakness.',
    action: 'Don’t continue this exercise until you’ve checked with {pro}.',
  },
]

export const urgentCare = 'If something feels severe or sudden, contact urgent medical care.'

export const techniqueTip = 'Unsure about technique? Watch the demonstration again before your next set.'
