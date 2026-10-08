import { ArrowRight, Check, ShieldAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Avatar } from '../components/Avatar'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ChoiceOption } from '../components/ChoiceOption'
import { DetailList } from '../components/DetailList'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { Section } from '../components/Section'
import { SegmentedControl } from '../components/SegmentedControl'
import { StepHeader } from '../components/StepHeader'
import { TextField } from '../components/TextField'
import { onboardingSteps, onboardingSummary } from '../data/onboarding'
import { patientRecord } from '../data/patient'
import { planDetails } from '../data/plan'
import { careModeOptions, connection, professional } from '../data/professional'
import type { CareMode } from '../types/care'
import type { OnboardingAnswers } from '../types/onboarding'
import { initialsOf, useAccount } from '../utils/auth'
import { readCare, saveCare } from '../utils/care'

// entry → connected care: connect → connected → plan · independent: questions 0–3 → summary
type Phase = 'entry' | 'connect' | 'connected' | 'plan' | 'summary' | number
type ConnectMethod = 'code' | 'link'

const total = onboardingSteps.length
const headingClass = 'text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink outline-none'

// ?edit reopens the independent questions from Profile; ?change reopens the first question.
export function OnboardingScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isEdit = params.has('edit')
  const fromProfile = isEdit || params.has('change')
  const [existing] = useState(readCare)
  const account = useAccount()

  const [phase, setPhase] = useState<Phase>(isEdit ? 0 : 'entry')
  const [mode, setMode] = useState<CareMode | undefined>(fromProfile ? existing?.mode : undefined)
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => (isEdit ? (existing?.setup ?? {}) : {}))
  const [method, setMethod] = useState<ConnectMethod>('code')
  const [code, setCode] = useState('')
  const [link, setLink] = useState('')
  const [connectError, setConnectError] = useState<string>()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasMounted = useRef(false)

  // Move focus to the new screen's heading so screen readers announce it; not on first load.
  useEffect(() => {
    if (hasMounted.current) headingRef.current?.focus()
    hasMounted.current = true
  }, [phase])

  const step = typeof phase === 'number' ? onboardingSteps[phase] : undefined
  const selected = step ? answers[step.id] : undefined
  const connectValue = method === 'code' ? code.trim() : link.trim()

  const connect = () => {
    const ok = method === 'code' ? connectValue === connection.code : connectValue.includes(connection.code)
    if (!ok) {
      setConnectError(
        method === 'code'
          ? 'That code doesn’t match an invitation. Check the code from your clinic.'
          : 'That link doesn’t match an invitation. Check the link from your clinic.',
      )
      return
    }
    setConnectError(undefined)
    setPhase('connected')
  }

  const finishConnected = () => {
    saveCare({ mode: 'connected' })
    navigate('/')
  }
  const finishIndependent = () => {
    saveCare({ mode: 'independent', setup: answers })
    navigate(isEdit ? '/profile' : '/')
  }

  const back = () => {
    if (phase === 'connect') setPhase('entry')
    else if (phase === 'connected') setPhase('connect')
    else if (phase === 'plan') setPhase('connected')
    else if (phase === 'summary') setPhase(total - 1)
    else if (typeof phase === 'number' && phase > 0) setPhase(phase - 1)
    else if (phase === 0 && !isEdit) setPhase('entry')
    else if (fromProfile) navigate('/profile')
  }
  const canGoBack = phase !== 'entry' || fromProfile
  const name = account?.fullName ?? 'You'

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

        {phase === 'connect' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={`mt-5 ${headingClass}`}>
              Connect with your rehabilitation professional
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
              Your clinic gives you a connection code or an invite link. Once connected, you’ll see the plan they
              prepared for you.
            </p>
            <div className="mt-8">
              <SegmentedControl
                label="Connection method"
                options={[
                  { id: 'code', label: 'Enter connection code' },
                  { id: 'link', label: 'Use invite link' },
                ]}
                value={method}
                onChange={(m) => {
                  setMethod(m)
                  setConnectError(undefined)
                }}
              />
            </div>
            {method === 'code' ? (
              <TextField
                className="mt-6"
                label="Connection code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                error={connectError}
                hint={`Prototype code: ${connection.code}`}
              />
            ) : (
              <TextField
                className="mt-6"
                label="Invite link"
                inputMode="url"
                autoComplete="off"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                error={connectError}
                hint={`Prototype link: ${connection.inviteLinkHint}`}
              />
            )}
          </>
        )}

        {phase === 'connected' && (
          <>
            <span className="mt-6 flex size-12 items-center justify-center rounded-full bg-positive-soft text-positive">
              <Check className="size-6" strokeWidth={2.25} aria-hidden />
            </span>
            <h1 ref={headingRef} tabIndex={-1} className={`mt-5 ${headingClass}`}>
              Connected to {professional.name}
            </h1>
            <Card className="mt-8 flex items-center gap-4 p-6">
              <ProfessionalAvatar professional={professional} size="lg" />
              <div>
                <p className="text-[17px] font-semibold text-ink">{professional.name}</p>
                <p className="text-[15px] text-ink-soft">{professional.role}</p>
                <p className="text-[15px] text-ink-soft">{professional.clinic}</p>
              </div>
            </Card>
          </>
        )}

        {phase === 'plan' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={`mt-5 ${headingClass}`}>
              Your rehabilitation plan is ready
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">
              Your rehabilitation professional prepared this plan based on your current recovery stage.
            </p>

            <div className="mt-8 flex flex-col gap-10">
              <Section id="patient" title="Patient">
                <Card className="flex items-center gap-4 p-6">
                  <Avatar initials={initialsOf(name)} size="lg" />
                  <div>
                    <p className="text-[17px] font-semibold text-ink">{name}</p>
                    <p className="text-[15px] text-ink-soft">{patientRecord.age} years</p>
                  </div>
                </Card>
              </Section>

              <Section id="context" title="Recovery context">
                <DetailList
                  items={[
                    { label: 'Diagnosis', value: patientRecord.diagnosis },
                    { label: 'Injury date', value: patientRecord.injuryDate },
                    { label: 'Time since injury', value: patientRecord.timeSinceInjury },
                    { label: 'Recovery stage', value: patientRecord.recoveryStage },
                  ]}
                />
              </Section>

              <Section id="current-plan" title="Current plan">
                <DetailList
                  items={[
                    { label: 'Focus', value: planDetails.focus },
                    {
                      label: 'Each session',
                      value: `${planDetails.exerciseCount} exercises · about ${planDetails.durationMinutes} minutes`,
                    },
                    { label: 'Frequency', value: `${planDetails.daysPerWeek} days per week` },
                  ]}
                />
                <Card className="flex items-start gap-3 p-5">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0 text-ink-soft" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="text-sm text-ink-soft">Restrictions</p>
                    <p className="mt-0.5 text-base font-medium text-ink">{patientRecord.restrictions}</p>
                  </div>
                </Card>
              </Section>

              <Section id="prepared-by" title="Prepared by">
                <ProfessionalCard professional={professional} showClinic>
                  <p className="mt-3 text-[15px] text-ink-soft">Plan last updated: {planDetails.lastUpdated}</p>
                </ProfessionalCard>
              </Section>
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
          <Button disabled={!mode} onClick={() => setPhase(mode === 'connected' ? 'connect' : 0)}>
            Continue
          </Button>
        )}
        {phase === 'connect' && (
          <Button disabled={!connectValue} onClick={connect}>
            Connect
          </Button>
        )}
        {phase === 'connected' && <Button onClick={() => setPhase('plan')}>Continue</Button>}
        {phase === 'plan' && (
          <Button onClick={finishConnected} icon={<ArrowRight className="size-4" aria-hidden />}>
            Start my plan
          </Button>
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
    </div>
  )
}
