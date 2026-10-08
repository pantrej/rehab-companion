import type { CareMode } from '../types/care'
import type { CareText, SupportOutcome, SupportTopic } from '../types/support'
import { professionalPhrase } from '../utils/care'

export const supportIntro = {
  title: 'How can we help?',
  text: 'Choose what you’re unsure about.',
}

export const noProfessional = {
  title: 'No rehabilitation professional connected',
  text: 'Your recovery summary can be shared with a rehabilitation professional if you want additional guidance.',
}

// The app points to the user's plan and professional care; it never diagnoses or changes the plan.
export const supportDisclaimer =
  'This guidance is general and based on your recent check-ins. It does not diagnose, and it does not replace professional care.'

export const outcomeLabels: Record<SupportOutcome, string> = {
  guidance: 'Guidance available',
  monitor: 'Worth monitoring',
  professional: 'Professional input recommended',
}

export function careText(text: CareText, mode: CareMode, professionalName?: string) {
  const chosen = typeof text === 'string' ? text : text[mode]
  return chosen.replaceAll('{pro}', professionalPhrase(professionalName))
}

export const supportTopics: SupportTopic[] = [
  {
    id: 'pain',
    label: 'Pain or symptoms',
    outcome: 'professional',
    message: {
      connected: 'Consider discussing this change with {pro} before adjusting your rehabilitation plan.',
      independent: 'If this change is new, worsening, or concerning, consider contacting {pro}.',
    },
    context: 'Your recent check-ins show pain between 2–⁠3/10, which appears stable.',
    steps: [
      'You can pause any exercise that doesn’t feel right.',
      'Note what you noticed in your next check-in.',
      'Tell {pro} what changed and when.',
    ],
    urgentNote: 'If something feels severe or sudden, contact urgent medical care.',
  },
  {
    id: 'technique',
    label: 'Exercise technique',
    outcome: 'guidance',
    message: 'Review your existing rehabilitation instructions before changing your plan.',
    steps: [
      'Watch the exercise demonstration again.',
      'Re-read the instructions in your rehabilitation plan.',
      {
        connected: 'Bring your question to your next appointment with {pro}.',
        independent: 'Note your question to share with {pro} if you want guidance.',
      },
    ],
    related: { label: 'Open today’s exercise', to: '/session' },
  },
  {
    id: 'progress',
    label: 'My progress',
    outcome: 'monitor',
    message: 'Keep tracking this change across your next check-ins.',
    context: 'Your recent signals are mostly stable, with gradual improvement in mobility.',
    steps: [
      'Keep checking in after each session.',
      'Look at how signals change over a few weeks, not a single day.',
      {
        connected: 'Your check-ins are part of the recovery summary for your next review.',
        independent: 'Share your recovery summary with {pro} if you’d like another view.',
      },
    ],
    related: { label: 'View progress', to: '/progress' },
  },
  {
    id: 'activity',
    label: 'How active I should be',
    outcome: 'guidance',
    message: 'Follow the activity guidance in your existing plan before changing how active you are.',
    steps: [
      'Check what your plan says about daily activity.',
      'Avoid big changes in activity without checking first.',
      'Ask {pro} if the guidance feels unclear.',
    ],
  },
  {
    id: 'other',
    label: 'Something else',
    outcome: 'monitor',
    message: 'Note it in your next check-in so you can see whether it changes over time.',
    steps: [
      'Add a note in your next check-in.',
      'If it’s new, worsening, or concerning, consider contacting {pro}.',
    ],
  },
]

// Used when a connected user contacts their professional. No chat is simulated.
export const contactGuide = {
  text: 'It may help to mention your recent signals:',
  points: ['Pain stable at 2–⁠3/10', 'Mobility improving', 'Sessions getting easier (7/10 → 5/10)'],
  urgentNote: 'If something feels severe or sudden, contact urgent medical care.',
}
