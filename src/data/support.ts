import type { SupportOutcome, SupportTopic } from '../types/support'

export const supportIntro = {
  title: 'How can we help?',
  text: 'Choose what you’re unsure about.',
}

// The app points to the user's plan and professional; it never diagnoses or changes the plan.
export const supportDisclaimer =
  'This guidance is general and based on your recent check-ins. It does not diagnose, and it does not replace your rehabilitation professional.'

export const outcomeLabels: Record<SupportOutcome, string> = {
  guidance: 'Guidance available',
  monitor: 'Worth monitoring',
  professional: 'Professional input recommended',
}

export const supportTopics: SupportTopic[] = [
  {
    id: 'pain',
    label: 'Pain or symptoms',
    outcome: 'professional',
    message:
      'If this change is new, worsening, or concerning, consider contacting your rehabilitation professional.',
    context: 'Your recent check-ins show pain between 2–\u20603/10, which appears stable.',
    steps: [
      'You can pause any exercise that doesn’t feel right.',
      'Note what you noticed in your next check-in.',
      'Tell your rehabilitation professional what changed and when.',
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
      'Re-read the instructions from your physiotherapist.',
      'Bring your question to your next appointment.',
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
      'Bring questions to your next appointment.',
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
      'Ask your rehabilitation professional if the guidance feels unclear.',
    ],
  },
  {
    id: 'other',
    label: 'Something else',
    outcome: 'monitor',
    message: 'Note it in your next check-in so you can see whether it changes over time.',
    steps: [
      'Add a note in your next check-in.',
      'If it’s new, worsening, or concerning, consider contacting your rehabilitation professional.',
    ],
  },
]

// Shown when the user chooses to contact their professional. No chat is simulated.
export const contactGuide = {
  title: 'Contact your rehabilitation professional',
  text: 'Use the contact details from your clinic or care team. It may help to mention your recent signals:',
  points: ['Pain stable at 2–\u20603/10', 'Mobility improving', 'Sessions getting easier (7/10 → 5/10)'],
  urgentNote: 'If something feels severe or sudden, contact urgent medical care.',
}
