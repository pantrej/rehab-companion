import type { OnboardingAnswers } from './onboarding'

// Connected: a professional defines and reviews the plan. Independent: the user follows an existing plan alone.
export type CareMode = 'connected' | 'independent'

export type CareState = {
  mode: CareMode
  // Independent only: the context the user set up themselves.
  setup?: OnboardingAnswers
  preferredName?: string
}

export type Professional = {
  name: string
  role: string
  // Post-nominal shorthand, e.g. "PT".
  credential: string
  initials: string
  clinic: string
  nextAppointment: string
  lastAppointment: string
  daysSinceLastAppointment: number
}
