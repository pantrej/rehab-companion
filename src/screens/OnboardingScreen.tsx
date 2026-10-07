import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ChoiceOption } from '../components/ChoiceOption'
import { StepHeader } from '../components/StepHeader'
import { onboardingSteps, onboardingSummary } from '../data/onboarding'
import type { OnboardingAnswers } from '../types/onboarding'

const total = onboardingSteps.length

// One question per screen, then a summary. Answers live in local state only.
export function OnboardingScreen() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasMounted = useRef(false)

  const isSummary = stepIndex === total
  const step = isSummary ? undefined : onboardingSteps[stepIndex]
  const selected = step ? answers[step.id] : undefined

  // Move focus to the new question so screen readers announce it; not on first load.
  useEffect(() => {
    if (hasMounted.current) headingRef.current?.focus()
    hasMounted.current = true
  }, [stepIndex])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <StepHeader
          current={stepIndex}
          total={total}
          onBack={stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : undefined}
        />

        {step ? (
          <>
            <h1
              ref={headingRef}
              id="question"
              tabIndex={-1}
              className="mt-10 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink outline-none"
            >
              {step.question}
            </h1>

            <div role="radiogroup" aria-labelledby="question" className="mt-8 flex flex-col gap-3">
              {step.options.map((option) => (
                <ChoiceOption
                  key={option}
                  label={option}
                  selected={selected === option}
                  onSelect={() => setAnswers({ ...answers, [step.id]: option })}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-10 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink outline-none"
            >
              {onboardingSummary.title}
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{onboardingSummary.text}</p>

            <Card className="mt-8 px-6 py-2">
              <dl className="divide-y divide-line">
                {onboardingSteps.map((s) => (
                  <div key={s.id} className="py-3.5">
                    <dt className="text-sm text-ink-soft">{s.summaryLabel}</dt>
                    <dd className="mt-0.5 text-base font-medium text-ink">{answers[s.id] ?? '—'}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {isSummary ? (
          <Button onClick={() => navigate('/')} icon={<ArrowRight className="size-4" aria-hidden />}>
            Continue to today’s plan
          </Button>
        ) : (
          <Button disabled={!selected} onClick={() => setStepIndex(stepIndex + 1)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
