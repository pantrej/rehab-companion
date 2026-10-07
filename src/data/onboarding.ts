import type { OnboardingStep } from '../types/onboarding'

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'context',
    question: 'What are you recovering from?',
    summaryLabel: 'Recovering from',
    options: ['Spinal injury', 'Spinal surgery', 'Other back injury', 'Other'],
  },
  {
    id: 'stage',
    question: 'Where are you in your recovery?',
    summaryLabel: 'Recovery stage',
    options: ['Just started', 'A few weeks in', 'A few months in', 'Long-term rehabilitation'],
  },
  {
    id: 'support',
    question: 'How often do you currently see a rehabilitation professional?',
    summaryLabel: 'Professional support',
    options: ['Multiple times a week', 'Weekly', 'Every few weeks', 'Rarely', 'Not currently'],
  },
  {
    id: 'plan',
    question: 'Do you already have a rehabilitation plan from a professional?',
    summaryLabel: 'Rehabilitation plan',
    options: ['Yes', 'Partly', 'Not sure'],
  },
]

export const onboardingSummary = {
  title: 'Your recovery setup',
  text: 'We’ll help you follow your existing plan, understand your progress, and know when professional input may be useful.',
}
