import { Check, ChevronDown, ChevronRight, LifeBuoy, Play } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ContactSheet } from '../components/ContactSheet'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { SafetyGuide } from '../components/SafetyGuide'
import { StepHeader } from '../components/StepHeader'
import { StatusItem } from '../components/StatusItem'
import { SupportSheet } from '../components/SupportSheet'
import { techniqueTip } from '../data/safety'
import { currentExercise as exercise } from '../data/session'
import { useCare } from '../utils/care'

export function ExerciseScreen() {
  const navigate = useNavigate()
  const [supportOpen, setSupportOpen] = useState(false)
  const closeSupport = useCallback(() => setSupportOpen(false), [])
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  const [guideOpen, setGuideOpen] = useState(false)
  const { professional } = useCare()
  const { lastSession } = exercise

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <header>
          {/* Session structure at a glance: where this exercise sits in today's set. */}
          <StepHeader
            current={exercise.position - 1}
            total={exercise.total}
            onBack={() => navigate('/')}
            backLabel="Back to Today"
            showCount={false}
          />
          <p className="mt-6 text-caption font-medium text-accent">
            Exercise {exercise.position} of {exercise.total}
          </p>
          <h1 className="mt-1 text-title font-semibold text-ink">
            {exercise.name}
          </h1>
          {/* Provenance: only a real, connected professional is ever named as prescriber. */}
          {professional && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 text-caption text-ink-soft shadow-card">
              <ProfessionalAvatar professional={professional} size="sm" />
              Prescribed by {professional.name}, {professional.credential}
            </p>
          )}
        </header>

        <button
          type="button"
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-card bg-sunken transition-colors hover:bg-line"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-surface text-accent shadow-card">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden />
          </span>
          <span className="text-[15px] font-medium text-ink-soft">Watch demonstration</span>
        </button>

        <div className="flex flex-col gap-3">
          <Card className="p-6">
            <dl className="grid grid-cols-2 gap-4">
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-[15px] text-ink-soft">sets</dt>
                <dd className="text-display font-semibold text-ink tabular-nums">
                  {exercise.sets}
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-[15px] text-ink-soft">repetitions</dt>
                <dd className="text-display font-semibold text-ink tabular-nums">
                  {exercise.reps}
                </dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-line pt-4 text-body font-medium text-ink">{exercise.equipment}</p>
          </Card>

          {/* Supporting detail on a quiet surface, so the prescription stays the focus. */}
          <section aria-labelledby="last-session" className="rounded-card bg-subtle px-5 py-4">
            <h2 id="last-session" className="text-caption font-medium text-ink-soft">
              Last session
            </h2>
            <ul className="mt-2.5 flex flex-col gap-2">
              <StatusItem label="Difficulty" status={`${lastSession.difficulty}/10`} tone="neutral" />
              <StatusItem label="Pain" status={`${lastSession.pain}/10`} tone="neutral" />
              <StatusItem
                label="Completed"
                status={`${lastSession.sets} × ${lastSession.reps}`}
                tone="neutral"
              />
            </ul>
          </section>
        </div>

        <section aria-labelledby="how-to">
          <h2 id="how-to" className="text-section font-semibold text-ink">
            How to do it
          </h2>
          <p className="mt-2 text-[17px] leading-relaxed text-ink">{exercise.instruction}</p>

          {/* Progressive disclosure: the safety guide stays one tap away instead of adding a block of text. */}
          <button
            type="button"
            aria-expanded={guideOpen}
            aria-controls="feel-guide"
            onClick={() => setGuideOpen(!guideOpen)}
            className="-ml-1 mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-xl px-1 text-[15px] font-medium text-ink transition-colors hover:bg-line/40"
          >
            How should this feel?
            <ChevronDown
              className={`size-4 text-ink-faint transition-transform ${guideOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
          {guideOpen && (
            <div id="feel-guide" className="mt-2 rounded-card bg-surface p-5 shadow-card">
              <SafetyGuide professionalName={professional?.name} />
              <p className="mt-3 border-t border-line pt-3 text-[15px] leading-relaxed text-ink-soft">{techniqueTip}</p>
            </div>
          )}

          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setSupportOpen(true)}
            className="-ml-1 mt-2 inline-flex h-11 items-center gap-2 rounded-xl px-1 text-[15px] text-ink-soft transition-colors hover:text-ink"
          >
            <LifeBuoy className="size-[18px]" strokeWidth={1.75} aria-hidden />
            Something doesn't feel right
            <ChevronRight className="size-4 text-ink-faint" aria-hidden />
          </button>
        </section>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <Button
          onClick={() => navigate('/check-in')}
          icon={<Check className="size-[18px]" strokeWidth={2.25} aria-hidden />}
        >
          Complete exercise
        </Button>
        {/* Only exercise 1 is modelled, so skipping also ends the session at the check-in. */}
        <Button variant="quiet" className="mt-1" onClick={() => navigate('/check-in')}>
          Skip for now
        </Button>
        {!professional && (
          <p className="mt-1 text-center text-caption text-ink-faint">From your existing rehabilitation plan</p>
        )}
      </div>

      {supportOpen && (
        <SupportSheet
          professionalName={professional?.name}
          onClose={closeSupport}
          onContact={
            professional
              ? () => {
                  setSupportOpen(false)
                  setContactOpen(true)
                }
              : undefined
          }
        />
      )}
      {contactOpen && professional && <ContactSheet professional={professional} onClose={closeContact} />}
    </div>
  )
}
