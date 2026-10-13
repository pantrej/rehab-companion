import { Check, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { CautionNote } from '../components/CautionNote'
import { ChoiceOption } from '../components/ChoiceOption'
import { ContactSheet } from '../components/ContactSheet'
import { PainScale } from '../components/PainScale'
import { StepHeader } from '../components/StepHeader'
import {
  checkInPurpose,
  checkInSteps,
  checkInTitle,
  difficultyOptions,
  movementOptions,
  painScale,
  unsureOptions,
} from '../data/checkin'
import { recentCheckIns } from '../data/progress'
import type { CheckIn } from '../types/checkin'
import { professionalPhrase, useCare } from '../utils/care'
import { storageKeys, writeStored } from '../utils/storage'

const total = checkInSteps.length

// One question group per step after a session. Answers live in local state; Finish keeps a copy in
// this browser for the prototype.
export function CheckInScreen() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [checkIn, setCheckIn] = useState<CheckIn>({ unsure: [], note: '' })
  const [noteOpen, setNoteOpen] = useState(false)
  const { connected, professional } = useCare()
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  const pro = professionalPhrase(professional?.name)
  // Pain clearly above the user's own recent range gets a calm safety note.
  const recentLow = Math.min(...recentCheckIns.map((c) => c.pain))
  const recentHigh = Math.max(...recentCheckIns.map((c) => c.pain))
  const painIsHigh = checkIn.pain !== undefined && checkIn.pain >= recentHigh + 2
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasMounted = useRef(false)

  const step = checkInSteps[stepIndex]
  const isLast = stepIndex === total - 1
  const answered =
    step.id === 'pain'
      ? checkIn.pain !== undefined
      : step.id === 'difficulty'
        ? !!checkIn.difficulty
        : step.id === 'movement'
          ? !!checkIn.movement
          : true

  // Move focus to the new question so screen readers announce it; not on first load.
  useEffect(() => {
    if (hasMounted.current) headingRef.current?.focus()
    hasMounted.current = true
  }, [stepIndex])

  const update = (patch: Partial<CheckIn>) => setCheckIn({ ...checkIn, ...patch })

  const toggleUnsure = (option: string) =>
    update({
      unsure: checkIn.unsure.includes(option)
        ? checkIn.unsure.filter((o) => o !== option)
        : [...checkIn.unsure, option],
    })

  const finish = () => {
    writeStored(storageKeys.lastCheckIn, { ...checkIn, at: new Date().toISOString() })
    // Replace, so going back from the insight doesn't reopen a finished check-in.
    navigate('/insight', { replace: true, state: { from: 'check-in' } })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <StepHeader
          current={stepIndex}
          total={total}
          onBack={stepIndex > 0 ? () => setStepIndex(stepIndex - 1) : () => navigate('/session')}
          backLabel={stepIndex > 0 ? 'Previous question' : 'Back to exercise'}
        />

        {stepIndex === 0 && (
          <p className="mt-8 flex items-center gap-2 text-[15px] font-medium text-positive">
            <Check className="size-[18px]" strokeWidth={2.25} aria-hidden />
            Session complete · a short check-in, about a minute
          </p>
        )}
        <p className={`${stepIndex === 0 ? 'mt-4' : 'mt-10'} text-[15px] text-ink-soft`}>{checkInTitle}</p>
        <h1
          ref={headingRef}
          id="question"
          tabIndex={-1}
          className="mt-1.5 text-title font-semibold text-ink outline-none"
        >
          {step.question}
        </h1>
        {step.hint && <p className="mt-2 text-[15px] text-ink-soft">{step.hint}</p>}
        {stepIndex === 0 && (
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {connected ? checkInPurpose.connected : checkInPurpose.independent}
          </p>
        )}

        <div className="mt-8">
          {step.id === 'pain' && (
            <PainScale
              {...painScale}
              value={checkIn.pain}
              onChange={(pain) => update({ pain })}
              labelledBy="question"
            />
          )}
          {step.id === 'pain' && painIsHigh && (
            <div className="mt-6">
              <CautionNote
                action={
                  professional && (
                    <Button variant="text" className="mt-1 -mb-2" aria-haspopup="dialog" onClick={() => setContactOpen(true)}>
                      Contact {professional.name}
                    </Button>
                  )
                }
              >
                That’s higher than your recent check-ins ({recentLow}–{'\u2060'}{recentHigh}/10). If the pain is sharp,
                spreading, or comes with numbness, tingling or weakness, stop and contact {pro}.
              </CautionNote>
            </div>
          )}

          {step.id === 'difficulty' && (
            <div role="radiogroup" aria-labelledby="question" className="flex flex-col gap-3">
              {difficultyOptions.map((option) => (
                <ChoiceOption
                  key={option}
                  label={option}
                  selected={checkIn.difficulty === option}
                  onSelect={() => update({ difficulty: option })}
                />
              ))}
            </div>
          )}

          {step.id === 'movement' && (
            <div role="radiogroup" aria-labelledby="question" className="flex flex-col gap-3">
              {movementOptions.map((option) => (
                <ChoiceOption
                  key={option}
                  label={option}
                  selected={checkIn.movement === option}
                  onSelect={() => update({ movement: option })}
                />
              ))}
            </div>
          )}

          {step.id === 'unsure' && (
            <>
              <div role="group" aria-labelledby="question" className="flex flex-col gap-3">
                {unsureOptions.map((option) => (
                  <ChoiceOption
                    key={option}
                    multiple
                    label={option}
                    selected={checkIn.unsure.includes(option)}
                    onSelect={() => toggleUnsure(option)}
                  />
                ))}
              </div>

              {checkIn.unsure.length > 0 && (
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft" role="note">
                  {professional ? (
                    <>
                      {professional.name} will see this in your recovery summary before {professional.nextAppointment}.
                      Need an answer sooner?{' '}
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => setContactOpen(true)}
                        className="inline min-h-11 font-medium text-accent underline-offset-2 hover:underline"
                      >
                        Contact {professional.name}
                      </button>
                    </>
                  ) : (
                    'After you finish, you’ll see guidance on what you’re unsure about.'
                  )}
                </p>
              )}

              {noteOpen ? (
                <div className="mt-6">
                  <label htmlFor="note" className="text-sm text-ink-soft">
                    Note <span className="text-ink-faint">(optional)</span>
                  </label>
                  <textarea
                    id="note"
                    autoFocus
                    rows={3}
                    value={checkIn.note}
                    onChange={(e) => update({ note: e.target.value })}
                    placeholder="Anything you’d like to remember or mention"
                    className="mt-2 w-full resize-none rounded-control border border-line bg-surface px-4 py-3.5 text-[17px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setNoteOpen(true)}
                  className="-ml-1 mt-4 inline-flex h-11 items-center gap-2 rounded-xl px-1 text-[15px] text-ink-soft transition-colors hover:text-ink"
                >
                  <Plus className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  Add a note
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {isLast ? (
          <Button onClick={finish}>Finish check-in</Button>
        ) : (
          <Button disabled={!answered} onClick={() => setStepIndex(stepIndex + 1)}>
            Continue
          </Button>
        )}
      </div>

      {contactOpen && professional && <ContactSheet professional={professional} onClose={closeContact} />}
    </div>
  )
}
