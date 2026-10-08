import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '../components/Button'
import { ChoiceOption } from '../components/ChoiceOption'
import { DetailList } from '../components/DetailList'
import { StepHeader } from '../components/StepHeader'
import { onboardingSteps, onboardingSummary } from '../data/onboarding'
import type { OnboardingAnswers } from '../types/onboarding'
import { readStored, storageKeys, writeStored } from '../utils/storage'

const total = onboardingSteps.length

// One question per screen, then a summary. Answers are saved in this browser on the summary.
// With ?edit, it reopens the saved answers from Profile and returns there.
export function OnboardingScreen() {
  const navigate = useNavigate()
  const isEdit = useSearchParams()[0].has('edit')
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>(() =>
    isEdit ? readStored<OnboardingAnswers>(storageKeys.setup, {}) : {},
  )
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasMounted = useRef(false)

  const isSummary = stepIndex === total
  const step = isSummary ? undefined : onboardingSteps[stepIndex]
  const selected = step ? answers[step.id] : undefined
  const exitTo = isEdit ? '/profile' : undefined

  // Move focus to the new question so screen readers announce it; not on first load.
  useEffect(() => {
    if (hasMounted.current) headingRef.current?.focus()
    hasMounted.current = true
  }, [stepIndex])

  const finish = () => {
    writeStored(storageKeys.setup, answers)
    navigate(isEdit ? '/profile' : '/')
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <StepHeader
          current={stepIndex}
          total={total}
          onBack={
            stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : exitTo ? () => navigate(exitTo) : undefined
          }
          backLabel={stepIndex > 0 ? 'Previous question' : 'Back to Profile'}
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

            <DetailList
              className="mt-8"
              items={onboardingSteps.map((s) => ({ label: s.summaryLabel, value: answers[s.id] ?? '—' }))}
            />
          </>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {isSummary ? (
          <Button onClick={finish} icon={<ArrowRight className="size-4" aria-hidden />}>
            {isEdit ? 'Save and return to Profile' : 'Continue to today’s plan'}
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
