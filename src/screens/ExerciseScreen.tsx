import { ArrowRight, Check, ChevronDown, ChevronRight, LifeBuoy } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { ContactSheet } from '../components/ContactSheet'
import { DayCarousel } from '../components/DayCarousel'
import { ExerciseDemo } from '../components/ExerciseDemo'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { SafetyGuide } from '../components/SafetyGuide'
import { SupportSheet } from '../components/SupportSheet'
import { techniqueTip } from '../data/safety'
import { exerciseCount, sessionExercises } from '../data/session'
import { useCare } from '../utils/care'
import { useCarousel } from '../utils/carousel'
import { firstIncomplete, useSessionProgress } from '../utils/session'

// Long enough for the tick to register, short enough that the next exercise doesn't feel withheld.
const settle = 260

// Today's session, one exercise at a time. Swiping moves between them and completing is a separate,
// explicit act, so nobody finishes an exercise by looking at it. The session is over only once all four
// have been completed; the check-in comes after that, never before.
export function ExerciseScreen() {
  const navigate = useNavigate()
  const { professional } = useCare()
  const { completed, complete, isComplete, allComplete, remaining } = useSessionProgress()
  // Opens where the session got to, which is also how returning to an interrupted session resumes it.
  const [start] = useState(() => firstIncomplete(completed))
  const [active, setActive] = useState(start)
  const carousel = useCarousel()
  const [supportOpen, setSupportOpen] = useState(false)
  const closeSupport = useCallback(() => setSupportOpen(false), [])
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  const [guideOpen, setGuideOpen] = useState(false)

  const done = isComplete(active)
  // The last exercise left to do finishes the session's exercises, wherever it sits in the order.
  const isLastLeft = !done && remaining === 1

  const goToCheckIn = () => navigate('/check-in')

  const completeActive = () => {
    complete(active)
    if (remaining === 1) {
      // That was the last one: the session's exercises are done, so the check-in follows.
      window.setTimeout(goToCheckIn, settle)
      return
    }
    const next = firstIncomplete([...completed, active])
    window.setTimeout(() => carousel.goTo(next), settle)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-6">
        <header className="flex flex-col gap-4 px-5">
          <div className="flex items-center justify-between gap-3">
            <BackButton label="Back to Today" onClick={() => navigate('/')} />
            {professional && (
              <p className="flex items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 text-caption text-ink-soft shadow-card">
                <ProfessionalAvatar professional={professional} size="sm" />
                {professional.name}, {professional.credential}
              </p>
            )}
          </div>

          {/* Where the session has got to: one mark per exercise, each one a way back to it. */}
          <div className="flex items-center justify-between gap-4">
            <ol className="-ml-1.5 flex items-center">
              {sessionExercises.map((item, i) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => carousel.goTo(i)}
                    aria-label={`Exercise ${i + 1} of ${exerciseCount}, ${item.name}: ${
                      isComplete(i) ? 'completed' : i === active ? 'in view' : 'still to do'
                    }`}
                    aria-current={i === active ? 'step' : undefined}
                    className="flex size-11 items-center justify-center"
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-[14px] text-[13px] font-semibold tabular-nums transition-colors duration-300 ${
                        isComplete(i)
                          ? 'bg-positive-soft text-positive'
                          : i === active
                            ? 'text-accent ring-[1.5px] ring-accent'
                            : 'text-ink-faint ring-[1.5px] ring-line'
                      }`}
                    >
                      {isComplete(i) ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="text-caption font-medium text-ink-soft tabular-nums">
              Exercise {active + 1} of {exerciseCount}
            </p>
          </div>
        </header>

        <DayCarousel
          count={exerciseCount}
          initial={start}
          control={carousel}
          label="Today's exercises"
          slideLabel={(i) => `Exercise ${i + 1} of ${exerciseCount}: ${sessionExercises[i].name}`}
          onChange={setActive}
        >
          {(i) => {
            const item = sessionExercises[i]
            return (
              <div className="flex flex-col gap-4 px-5">
                <ExerciseDemo
                  name={item.name}
                  instruction={item.instruction}
                  movement={item.movement}
                  clip={item.demo}
                />
                <div>
                  <h1 className="text-title font-semibold text-ink">{item.name}</h1>
                  <p className="mt-1.5 text-[15px] text-ink-soft tabular-nums">
                    {item.sets} sets · {item.reps} reps · {item.equipment}
                  </p>
                  <p className="mt-3 text-[17px] leading-relaxed text-ink">{item.instruction}</p>
                </div>
                {isComplete(i) && (
                  <p className="flex items-center gap-2 text-[15px] font-medium text-positive">
                    <Check className="size-[18px]" strokeWidth={2.25} aria-hidden />
                    Completed
                  </p>
                )}
              </div>
            )
          }}
        </DayCarousel>

        {/* The same guidance whichever exercise is in view: it is about how the session should feel. */}
        <section aria-labelledby="how-it-feels" className="px-5">
          <h2 id="how-it-feels" className="sr-only">
            How this should feel
          </h2>
          <button
            type="button"
            aria-expanded={guideOpen}
            aria-controls="feel-guide"
            onClick={() => setGuideOpen(!guideOpen)}
            className="-ml-1 flex h-11 w-full items-center justify-between gap-2 rounded-xl px-1 text-[15px] font-medium text-ink transition-colors hover:bg-line/40"
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
            className="-ml-1 mt-1 inline-flex h-11 items-center gap-2 rounded-xl px-1 text-[15px] text-ink-soft transition-colors hover:text-ink"
          >
            <LifeBuoy className="size-[18px]" strokeWidth={1.75} aria-hidden />
            Something doesn't feel right
            <ChevronRight className="size-4 text-ink-faint" aria-hidden />
          </button>
        </section>
      </div>

      {/* One action, about the exercise in view. Swiping never completes anything. */}
      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        {done ? (
          allComplete ? (
            <Button onClick={goToCheckIn} icon={<ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden />}>
              Go to check-in
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => carousel.goTo(firstIncomplete(completed))}
              icon={<ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden />}
            >
              Next exercise
            </Button>
          )
        ) : (
          <Button
            onClick={completeActive}
            icon={
              isLastLeft ? (
                <ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden />
              ) : (
                <Check className="size-[18px]" strokeWidth={2.25} aria-hidden />
              )
            }
          >
            {isLastLeft ? 'Finish session' : 'Complete exercise'}
          </Button>
        )}
        <p className="mt-2 text-center text-caption text-ink-faint">
          {allComplete
            ? 'All four exercises completed'
            : `${remaining} of ${exerciseCount} exercises left in today's session`}
        </p>
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
