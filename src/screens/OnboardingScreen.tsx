import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChartLine,
  Check,
  ClipboardList,
  ClipboardPlus,
  Clock,
  Dumbbell,
  HeartPulse,
  House,
  Info,
  MessageCircle,
  ShieldAlert,
  Target,
  Timer,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
// The Rehab Companion photography set. Swap the files to replace them.
import careTeamImage from '../assets/collaborative-physiotherapy-consultation.webp'
import planImage from '../assets/golden-hour-lake-view-hike.webp'
import startImage from '../assets/serene-seated-yoga-stretch-at-home.webp'
import therapistImage from '../assets/smiling-physiotherapist-in-bright-wellness-studio.webp'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ChoiceOption } from '../components/ChoiceOption'
import { DetailList } from '../components/DetailList'
import { CurvedHero, ThemeCard } from '../components/CurvedHero'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { Section } from '../components/Section'
import { StepHeader } from '../components/StepHeader'
import { TextField } from '../components/TextField'
import { onboardingSteps, onboardingSummary } from '../data/onboarding'
import { patientRecord } from '../data/patient'
import { planDetails } from '../data/plan'
import { careModeOptions, connection, professional } from '../data/professional'
import type { CareMode } from '../types/care'
import type { OnboardingAnswers, OnboardingStepId } from '../types/onboarding'
import { demoAccount, initialsOf, isSignedIn, useAccount } from '../utils/auth'
import { readCare, saveCare } from '../utils/care'

// entry → connected care: connect → connected → plan · independent: questions 0–3 → summary.
// Both paths end plan-ready and hand over to the account step, which saves what setup produced.
type Phase = 'entry' | 'connect' | 'connected' | 'plan' | 'summary' | number

const total = onboardingSteps.length
// Progress counts the care question as step 1 on both paths.
const independentSteps = total + 1
const connectedSteps = 4
const careIcons: Record<CareMode, typeof House> = { connected: UsersRound, independent: House }
const stepThemes: Record<OnboardingStepId, { icon: typeof House; label: string }> = {
  context: { icon: HeartPulse, label: 'Your recovery' },
  stage: { icon: CalendarDays, label: 'Where you are now' },
  support: { icon: UsersRound, label: 'Your support' },
  plan: { icon: ClipboardList, label: 'Your plan' },
}
const titleClass = 'text-[30px] leading-[1.12] font-bold tracking-[-0.025em] text-ink outline-none'
const bodyClass = 'mt-3 text-[16px] leading-relaxed text-ink-soft'
const rowIcon = { className: 'size-5', strokeWidth: 1.75 }
const arrow = <ArrowRight className="size-4" aria-hidden />

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
  const [code, setCode] = useState('')
  const [connectError, setConnectError] = useState<string>()
  const [showHelp, setShowHelp] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasMounted = useRef(false)

  // Move focus to the new screen's heading so screen readers announce it; not on first load.
  useEffect(() => {
    if (hasMounted.current) headingRef.current?.focus()
    hasMounted.current = true
  }, [phase])

  const step = typeof phase === 'number' ? onboardingSteps[phase] : undefined
  const selected = step ? answers[step.id] : undefined
  const connectValue = code.trim()

  const connect = () => {
    if (connectValue !== connection.code) {
      setConnectError('That code doesn’t match an invitation. Check the code from your clinic.')
      return
    }
    setConnectError(undefined)
    setPhase('connected')
  }

  // Setup is saved first, then the account step explains what it is saving. Returning users skip it.
  const signedIn = isSignedIn()
  const finishConnected = () => {
    saveCare({ mode: 'connected' })
    navigate(signedIn ? '/' : '/register')
  }
  const finishIndependent = () => {
    saveCare({ mode: 'independent', setup: answers })
    navigate(isEdit ? '/profile' : signedIn ? '/' : '/register')
  }

  const back = () => {
    if (phase === 'connect') setPhase('entry')
    else if (phase === 'connected') setPhase('connect')
    else if (phase === 'plan') setPhase('connected')
    else if (phase === 'summary') setPhase(total - 1)
    else if (typeof phase === 'number' && phase > 0) setPhase(phase - 1)
    else if (phase === 0 && !isEdit) setPhase('entry')
    else if (fromProfile) navigate('/profile')
    else navigate('/welcome')
  }
  // Before an account exists, the clinic record names the (mock) patient.
  const name = account?.fullName ?? demoAccount.fullName

  // Connected care: care question, connect, connected, plan. Independent: care question, then the questions.
  const progressTotal = mode === 'connected' ? connectedSteps : independentSteps
  const progressCurrent =
    phase === 'entry'
      ? 0
      : phase === 'connect'
        ? 1
        : phase === 'connected'
          ? 2
          : phase === 'plan'
            ? 3
            : phase === 'summary'
              ? independentSteps
              : phase + 1
  const header = (
    <StepHeader
      current={progressCurrent}
      total={progressTotal}
      onBack={back}
      backLabel={
        phase === 'entry' && !fromProfile
          ? 'Back to welcome'
          : (phase === 'entry' && fromProfile) || (phase === 0 && isEdit)
            ? 'Back to Profile'
            : typeof phase === 'number' || phase === 'summary'
              ? 'Previous question'
              : 'Back'
      }
    />
  )

  return (
    <div className="flex flex-1 flex-col">
      {phase === 'entry' && <CurvedHero header={header} image={startImage} imagePosition="50% 25%" />}
      {phase === 'connect' && (
        <CurvedHero header={header} image={careTeamImage} imagePosition="50% 29%" size="xl" />
      )}
      {phase === 'connected' && (
        <CurvedHero
          header={header}
          image={therapistImage}
          imagePosition="50% 29%"
          badge={
            <span className="flex size-16 items-center justify-center rounded-full bg-surface shadow-card">
              <span className="flex size-11 items-center justify-center rounded-full bg-positive-soft text-positive">
                <Check className="size-6" strokeWidth={2.25} aria-hidden />
              </span>
            </span>
          }
        >
        </CurvedHero>
      )}
      {phase === 'plan' && <CurvedHero header={header} image={planImage} imagePosition="50% 20%" />}
      {step && (
        <CurvedHero header={header} size="sm">
          <ThemeCard compact icon={<StepIcon id={step.id} />} label={stepThemes[step.id].label} />
        </CurvedHero>
      )}
      {phase === 'summary' && (
        <CurvedHero header={header} size="sm">
          <ThemeCard compact icon={<Check className="size-5" strokeWidth={2} />} label="Your setup" />
        </CurvedHero>
      )}

      <div className={`relative flex flex-1 flex-col px-5 pb-6 ${phase === 'connected' ? 'pt-10' : 'pt-2'}`}>
        {phase === 'entry' && (
          <>
            <p className="text-[12px] font-semibold tracking-[0.16em] text-ink-faint uppercase">Rehab Companion</p>
            <h1 ref={headingRef} id="question" tabIndex={-1} className={`mt-3 ${titleClass}`}>
              How are you managing your rehabilitation?
            </h1>
            <p className={bodyClass}>We’ll tailor the app and its support to how you recover today.</p>
            {/* Equal rows, so both care types read as equal choices. */}
            <div role="radiogroup" aria-labelledby="question" className="mt-6 grid auto-rows-fr gap-3">
              {careModeOptions.map((option) => {
                const Icon = careIcons[option.id]
                return (
                  <ChoiceOption
                    key={option.id}
                    label={option.label}
                    description={option.description}
                    selected={mode === option.id}
                    onSelect={() => setMode(option.id)}
                    icon={<Icon className="size-[22px]" strokeWidth={1.75} />}
                  />
                )
              })}
            </div>
          </>
        )}

        {phase === 'connect' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={titleClass}>
              Connect with your rehabilitation professional
            </h1>
            <p className={bodyClass}>
              Your clinic gives you a connection code. Once connected, you’ll see the plan they prepared for you.
            </p>
            <TextField
              className="mt-6"
              label="Connection code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onClear={() => setCode('')}
              error={connectError}
            />
            <div className="mt-4 flex gap-3 rounded-2xl bg-accent-soft/60 p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
              <p className="text-[15px] leading-snug text-ink-soft">
                You can find the code in your clinic email or ask your physiotherapist.
                <span className="mt-1.5 block font-medium text-ink">Prototype code: {connection.code}</span>
              </p>
            </div>
            <button
              type="button"
              aria-expanded={showHelp}
              onClick={() => setShowHelp(!showHelp)}
              className="-mx-2 mt-3 min-h-11 self-start rounded-full px-2 text-[15px] font-semibold text-accent hover:bg-accent-soft/60"
            >
              Need help connecting?
            </button>
            {showHelp && (
              <p className="text-[15px] leading-relaxed text-ink-soft">
                Ask your clinic to resend the invitation. You can also continue on your own for now and connect later
                from Profile.
              </p>
            )}
          </>
        )}

        {phase === 'connected' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={titleClass}>
              Connected to {professional.name}
            </h1>
            <p className={bodyClass}>
              You’re now connected with your rehabilitation professional. You’ll see the plan they prepared for you in
              the app.
            </p>
            {/* The same person as in the photo above, so the connection reads as one real professional. */}
            <Card className="mt-6 flex items-center gap-4 p-4">
              <img
                src={professional.photo}
                alt={`${professional.name}, ${professional.role}`}
                className="size-[72px] shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-[18px] font-semibold text-ink">{professional.name}</p>
                <p className="text-[15px] text-ink-soft">
                  {professional.role} · {professional.credential}
                </p>
                <p className="text-[15px] text-ink-soft">{professional.clinic}</p>
              </div>
            </Card>
            <div className="mt-3 flex items-center gap-4 rounded-card bg-accent-soft/50 p-5">
              <span className="flex shrink-0 -space-x-2.5" aria-hidden>
                {[Dumbbell, MessageCircle, ChartLine].map((Icon, i) => (
                  <span
                    key={i}
                    className="flex size-10 items-center justify-center rounded-full bg-surface text-accent ring-2 ring-[#f1ecfc]"
                  >
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </span>
                ))}
              </span>
              <p className="text-[15px] leading-snug text-ink-soft">
                Your care team can now support you with updated exercises, feedback and progress tracking.
              </p>
            </div>
          </>
        )}

        {phase === 'plan' && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className={titleClass}>
              Your rehabilitation plan is ready
            </h1>
            <p className={bodyClass}>
              Your rehabilitation professional prepared this plan based on your current recovery stage.
            </p>

            <div className="mt-7 flex flex-col gap-8">
              <Section id="patient" title="Patient">
                <Card className="flex items-center gap-4 p-5">
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
                    { label: 'Diagnosis', value: patientRecord.diagnosis, icon: <ClipboardPlus {...rowIcon} /> },
                    { label: 'Injury date', value: patientRecord.injuryDate, icon: <CalendarDays {...rowIcon} /> },
                    { label: 'Time since injury', value: patientRecord.timeSinceInjury, icon: <Timer {...rowIcon} /> },
                    { label: 'Recovery stage', value: patientRecord.recoveryStage, icon: <TrendingUp {...rowIcon} /> },
                  ]}
                />
              </Section>

              <Section id="current-plan" title="Current plan">
                <DetailList
                  items={[
                    { label: 'Focus', value: planDetails.focus, icon: <Target {...rowIcon} /> },
                    {
                      label: 'Each session',
                      value: `${planDetails.exerciseCount} exercises · about ${planDetails.durationMinutes} minutes`,
                      icon: <Clock {...rowIcon} />,
                    },
                    { label: 'Frequency', value: planDetails.frequency, icon: <CalendarCheck {...rowIcon} /> },
                  ]}
                />
                <div className="flex items-start gap-3 rounded-card bg-subtle p-5">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0 text-ink-soft" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="text-sm text-ink-soft">Restrictions</p>
                    <p className="mt-0.5 text-base font-medium text-ink">{patientRecord.restrictions}</p>
                  </div>
                </div>
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
            <h1 ref={headingRef} id="question" tabIndex={-1} className={titleClass}>
              {step.question}
            </h1>
            {phase === 0 && (
              <p className={bodyClass}>
                This app helps you follow a plan you already have. It doesn’t create or change treatment.
              </p>
            )}
            <div role="radiogroup" aria-labelledby="question" className="mt-6 flex flex-col gap-3">
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
            <h1 ref={headingRef} tabIndex={-1} className={titleClass}>
              {isEdit ? onboardingSummary.title : onboardingSummary.readyTitle}
            </h1>
            <p className={bodyClass}>{onboardingSummary.text}</p>
            <DetailList
              className="mt-7"
              items={onboardingSteps.map((s) => ({
                label: s.summaryLabel,
                value: answers[s.id] ?? '—',
                icon: <StepIcon id={s.id} />,
              }))}
            />
          </>
        )}
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {phase === 'entry' && (
          <Button disabled={!mode} onClick={() => setPhase(mode === 'connected' ? 'connect' : 0)} icon={arrow}>
            Continue
          </Button>
        )}
        {phase === 'connect' && (
          <Button disabled={!connectValue} onClick={connect} icon={arrow}>
            Connect
          </Button>
        )}
        {phase === 'connected' && (
          <Button onClick={() => setPhase('plan')} icon={arrow}>
            Continue
          </Button>
        )}
        {phase === 'plan' && (
          <Button onClick={finishConnected} icon={arrow}>
            {signedIn ? 'Start my plan' : 'Save my plan'}
          </Button>
        )}
        {typeof phase === 'number' && (
          <Button disabled={!selected} onClick={() => setPhase(phase === total - 1 ? 'summary' : phase + 1)} icon={arrow}>
            Continue
          </Button>
        )}
        {phase === 'summary' && (
          <Button onClick={finishIndependent} icon={arrow}>
            {isEdit ? 'Save and return to Profile' : signedIn ? 'Continue to today’s plan' : 'Save my plan'}
          </Button>
        )}
      </div>
    </div>
  )
}

function StepIcon({ id }: { id: OnboardingStepId }) {
  const Icon = stepThemes[id].icon
  return <Icon className="size-5" strokeWidth={1.75} />
}
