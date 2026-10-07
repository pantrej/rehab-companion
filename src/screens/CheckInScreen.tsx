import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { ChoiceOption } from '../components/ChoiceOption'
import { PainScale } from '../components/PainScale'
import { StepHeader } from '../components/StepHeader'
import {
  checkInSteps,
  checkInStorageKey,
  checkInTitle,
  difficultyOptions,
  movementOptions,
  painScale,
  unsureOptions,
} from '../data/checkin'
import type { CheckIn } from '../types/checkin'

const total = checkInSteps.length

// One question group per step after a session. Answers live in local state; Finish keeps a copy in
// this browser for the prototype.
export function CheckInScreen() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [checkIn, setCheckIn] = useState<CheckIn>({ unsure: [], note: '' })
  const [noteOpen, setNoteOpen] = useState(false)
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
    try {
      localStorage.setItem(checkInStorageKey, JSON.stringify({ ...checkIn, at: new Date().toISOString() }))
    } catch {
      // Storage can be unavailable (private mode); the prototype carries on without it.
    }
    navigate('/insight')
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

        <p className="mt-10 text-[15px] text-ink-soft">{checkInTitle}</p>
        <h1
          ref={headingRef}
          id="question"
          tabIndex={-1}
          className="mt-1.5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink outline-none"
        >
          {step.question}
        </h1>
        {step.hint && <p className="mt-2 text-[15px] text-ink-soft">{step.hint}</p>}

        <div className="mt-8">
          {step.id === 'pain' && (
            <PainScale
              {...painScale}
              value={checkIn.pain}
              onChange={(pain) => update({ pain })}
              labelledBy="question"
            />
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
                    className="mt-2 w-full resize-none rounded-2xl border border-line bg-surface px-4 py-3.5 text-[17px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
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

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {isLast ? (
          <Button onClick={finish}>Finish check-in</Button>
        ) : (
          <Button disabled={!answered} onClick={() => setStepIndex(stepIndex + 1)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
