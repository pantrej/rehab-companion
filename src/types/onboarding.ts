export type OnboardingStepId = 'context' | 'stage' | 'support' | 'plan'

export type OnboardingStep = {
  id: OnboardingStepId
  question: string
  // Short label used when the answer is played back on the summary.
  summaryLabel: string
  options: string[]
}

export type OnboardingAnswers = Partial<Record<OnboardingStepId, string>>
