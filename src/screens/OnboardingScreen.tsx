import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { ChoiceOption } from '../components/ChoiceOption'
import { DetailList } from '../components/DetailList'
import { PersonalDetailsSheet } from '../components/PersonalDetailsSheet'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { StepHeader } from '../components/StepHeader'
import { onboardingSteps, onboardingSummary } from '../data/onboarding'
import { careModeOptions, connectedPlan, professional } from '../data/professional'
import type { CareMode } from '../types/care'
import type { OnboardingAnswers } from '../types/onboarding'
import { readCare, saveCare } from '../utils/care'

type Phase = 'entry' | 'connected' | 'summary' | number

const total = onboardingSteps.length
const headingClass = 'text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink outline-none'

// Starts by asking how rehabilitation is managed.
// Connected: the professional's plan is shown, never re-entered. Independent: four short questions.
// ?edit reopens the independent questions from Profile; ?change reopens the first question.
export function OnboardingScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isEdit = params.has('edit')
  const fromProfile = isEdit || params.has('change')
  const [existing] = useState(readCare)

  const [phase, setPhase] = useState<Phase>(isEdit ? 0 : 'entry')
  const [mode, setMode] = useState<CareMode | undefined>(fromProfile ? existing?.mode : undefined)
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => (isEdit ? (existing?.setup ?? {}) : {}))
  const [preferredName, setPreferredName] = useState(existing?.preferredName)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const closeDetails = useCallback(() => setDetailsOpen(false), [])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasMounted = useRef(false)

  // Move focus to the new screen's heading so screen readers announce it; not on first load.
  useEffect(() => {
    if (hasMounted.current) headingRef.current?.focus()
    hasMounted.current = true
  }, [phase])

  const exitToProfile = () => navigate('/profile')
  const step = typeof phase === 'number' ? onboardingSteps[phase] : undefined
  const selected = step ? answers[step.id] : undefined

  const finishConnected = () => {
    saveCare({ mode: 'connected', preferredName })
    navigate('/')
  }
  const finishIndependent = () => {
    saveCare({ mode: 'independent', setup: answers, preferredName })
    navigate(isEdit ? '/profile' : '/')
  }

  const back = () => {
    if (phase === 'connected') setPhase('entry')
    else if (phase === 'summary') setPhase(total - 1)
    else if (typeof phase === 'number' && phase > 0) setPhase(phase - 1)
    else if (phase === 0 && !isEdit) setPhase('entry')
    else if (fromProfile) exitToProfile()
  }
  const canGoBack = phase !== 'entry' || fromProfile

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        {typeof phase === 'number' || phase === 'summary' ? (
          <StepHeader
            current={phase === 'summary' ? total : phase}
            total={total}
            onBack={back}
            backLabel={phase === 0 && isEdit ? 'Back to Profile' : 'Previous question'}
          />
        ) : canGoBack ? (
          <BackButton label={phase === 'entry' ? 'Back to Profile' : 'Back'} onClick={back} />
        ) : (
          <span className="size-11" aria-hidden />
        )}

        {phase === 'entry' && (
          <>
            <h1 ref={headingRef} id="question" tabIndex={-1} className={`mt-10 ${headingClass}`}>
              How are you currently managing your rehabilitation?
            </h1>
            <div role="radiogroup" aria-labelledby="question" className="mt-8 flex flex-col gap-3">
              {careModeOptions.map((option) => (
                <ChoiceOption
                  key={option.id}
                  label={option.label}
                  description={option.description}
                  selected={mode === option.id}
                  onSelect={() => setMode(option.id)}
                />
              ))}
            </div>
          </>
        )}

        {phase === 'connected' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={`mt-5 ${headingClass}`}>
              Your rehabilitation plan is ready
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{connectedPlan.intro}</p>
            <div className="mt-8 flex flex-col gap-3">
              <ProfessionalCard professional={professional} />
              <DetailList
                items={[
                  { label: 'Recovery context', value: connectedPlan.context },
                  { label: 'Current plan', value: connectedPlan.plan },
                ]}
              />
            </div>
          </>
        )}

        {step && (
          <>
            <h1 ref={headingRef} id="question" tabIndex={-1} className={`mt-10 ${headingClass}`}>
              {step.question}
            </h1>
            {phase === 0 && (
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                This app helps you follow a plan you already have. It doesn’t create or change treatment.
              </p>
            )}
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
        )}

        {phase === 'summary' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={`mt-10 ${headingClass}`}>
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
        {phase === 'entry' && (
          <Button disabled={!mode} onClick={() => setPhase(mode === 'connected' ? 'connected' : 0)}>
            Continue
          </Button>
        )}
        {phase === 'connected' && (
          <>
            <Button onClick={finishConnected} icon={<ArrowRight className="size-4" aria-hidden />}>
              Review my plan
            </Button>
            <Button variant="quiet" className="mt-1" aria-haspopup="dialog" onClick={() => setDetailsOpen(true)}>
              Edit personal details
            </Button>
          </>
        )}
        {typeof phase === 'number' && (
          <Button disabled={!selected} onClick={() => setPhase(phase === total - 1 ? 'summary' : phase + 1)}>
            Continue
          </Button>
        )}
        {phase === 'summary' && (
          <Button onClick={finishIndependent} icon={<ArrowRight className="size-4" aria-hidden />}>
            {isEdit ? 'Save and return to Profile' : 'Continue to today’s plan'}
          </Button>
        )}
      </div>

      {detailsOpen && (
        <PersonalDetailsSheet
          preferredName={preferredName}
          professionalName={professional.name}
          onSave={setPreferredName}
          onClose={closeDetails}
        />
      )}
    </div>
  )
}
