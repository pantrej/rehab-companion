import { ArrowRight, Check, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { CautionNote } from '../components/CautionNote'
import { ChoiceOption } from '../components/ChoiceOption'
import { ContactSheet } from '../components/ContactSheet'
import { RatingSlider } from '../components/RatingSlider'
import {
  checkInPurpose,
  checkInTitle,
  difficultyScale,
  movementOptions,
  movementQuestion,
  painScale,
  unsureOptions,
} from '../data/checkin'
import { exerciseCount } from '../data/session'
import type { CheckIn } from '../types/checkin'
import type { Movement } from '../types/progress'
import { professionalPhrase, useCare } from '../utils/care'
import { liveCheckIns } from '../utils/checkIn'
import { clearSession } from '../utils/session'
import { storageKeys, writeStored } from '../utils/storage'

// The check-in that closes a session: the three signals Progress reads, on one screen, in under a minute.
// It opens on what the person reported last time, so the usual answer takes no work and a change is a
// deliberate one.
export function CheckInScreen() {
  const navigate = useNavigate()
  const { connected, professional } = useCare()
  const [records] = useState(liveCheckIns)
  const previous = records[0]
  const [checkIn, setCheckIn] = useState<CheckIn>({
    pain: previous.pain,
    difficulty: previous.difficulty,
    unsure: [],
    note: '',
  })
  const [moreOpen, setMoreOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  const pro = professionalPhrase(professional?.name)

  // Pain clearly above the person's own recent range gets a calm safety note.
  const pains = records.map((c) => c.pain)
  const recentLow = Math.min(...pains)
  const recentHigh = Math.max(...pains)
  const painIsHigh = checkIn.pain >= recentHigh + 2

  const update = (patch: Partial<CheckIn>) => setCheckIn((current) => ({ ...current, ...patch }))

  const toggleUnsure = (option: string) =>
    update({
      unsure: checkIn.unsure.includes(option)
        ? checkIn.unsure.filter((o) => o !== option)
        : [...checkIn.unsure, option],
    })

  const finish = () => {
    writeStored(storageKeys.lastCheckIn, { ...checkIn, at: new Date().toISOString() })
    // The session it belongs to is finished with; the next visit starts a new one.
    clearSession()
    // Replace, so going back from the insight doesn't reopen a finished check-in.
    navigate('/insight', { replace: true, state: { from: 'check-in' } })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-8">
        <BackButton label="Back to the session" onClick={() => navigate('/session')} />

        <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-positive">
          <Check className="size-[18px]" strokeWidth={2.25} aria-hidden />
          Session complete · {exerciseCount} exercises
        </p>
        <h1 className="mt-2 text-title font-semibold text-ink">{checkInTitle}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {connected ? checkInPurpose.connected : checkInPurpose.independent}
        </p>

        <div className="mt-8 flex flex-col gap-8">
          <section aria-labelledby="pain-question">
            <h2 id="pain-question" className="text-section font-semibold text-ink">
              {painScale.question}
            </h2>
            <div className="mt-3">
              <RatingSlider
                id={painScale.id}
                label={painScale.question}
                value={checkIn.pain}
                onChange={(pain) => update({ pain })}
                min={painScale.min}
                max={painScale.max}
                minLabel={painScale.minLabel}
                maxLabel={painScale.maxLabel}
              />
            </div>
            {painIsHigh && (
              <div className="mt-5">
                <CautionNote
                  action={
                    professional && (
                      <Button
                        variant="text"
                        className="mt-1 -mb-2"
                        aria-haspopup="dialog"
                        onClick={() => setContactOpen(true)}
                      >
                        Contact {professional.name}
                      </Button>
                    )
                  }
                >
                  That’s higher than your recent check-ins ({recentLow}–{'⁠'}
                  {recentHigh}/10). If the pain is sharp, spreading, or comes with numbness, tingling or
                  weakness, stop and contact {pro}.
                </CautionNote>
              </div>
            )}
          </section>

          <section aria-labelledby="difficulty-question">
            <h2 id="difficulty-question" className="text-section font-semibold text-ink">
              {difficultyScale.question}
            </h2>
            <div className="mt-3">
              <RatingSlider
                id={difficultyScale.id}
                label={difficultyScale.question}
                value={checkIn.difficulty}
                onChange={(difficulty) => update({ difficulty })}
                min={difficultyScale.min}
                max={difficultyScale.max}
                minLabel={difficultyScale.minLabel}
                maxLabel={difficultyScale.maxLabel}
              />
            </div>
          </section>

          {/* Movement is answered in words: three answers, one tap, and the same words Progress reads. */}
          <section aria-labelledby="movement-question">
            <h2 id="movement-question" className="text-section font-semibold text-ink">
              {movementQuestion}
            </h2>
            <div role="radiogroup" aria-labelledby="movement-question" className="mt-3 flex gap-2">
              {movementOptions.map((option) => {
                const selected = checkIn.movement === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => update({ movement: option.id as Movement })}
                    className={`flex h-14 flex-1 items-center justify-center rounded-control border px-2 text-center text-[15px] leading-tight font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      selected
                        ? 'border-accent bg-accent-soft text-accent'
                        : 'border-line bg-surface text-ink hover:border-[#d9d4ca]'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Everything else is optional and stays out of the way until it is asked for. */}
          <section aria-labelledby="more">
            <h2 id="more" className="sr-only">
              Anything else
            </h2>
            {moreOpen ? (
              <>
                <p className="text-section font-semibold text-ink">Anything you’re unsure about?</p>
                <div role="group" aria-labelledby="more" className="mt-3 flex flex-col gap-3">
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
                {checkIn.unsure.length > 0 && professional && (
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft" role="note">
                    {professional.name} will see this in your recovery summary before{' '}
                    {professional.nextAppointment}. Need an answer sooner?{' '}
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => setContactOpen(true)}
                      className="inline min-h-11 font-medium text-accent underline-offset-2 hover:underline"
                    >
                      Contact {professional.name}
                    </button>
                  </p>
                )}
                {noteOpen ? (
                  <div className="mt-5">
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
                    className="-ml-1 mt-3 inline-flex h-11 items-center gap-2 rounded-xl px-1 text-[15px] text-ink-soft transition-colors hover:text-ink"
                  >
                    <Plus className="size-[18px]" strokeWidth={1.75} aria-hidden />
                    Add a note
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className="-ml-1 inline-flex h-11 items-center gap-2 rounded-xl px-1 text-[15px] text-ink-soft transition-colors hover:text-ink"
              >
                <Plus className="size-[18px]" strokeWidth={1.75} aria-hidden />
                Add a note or a question
              </button>
            )}
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button
          disabled={!checkIn.movement}
          onClick={finish}
          icon={<ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden />}
        >
          See recovery insight
        </Button>
        <p className="mt-2 text-center text-caption text-ink-faint">
          {checkIn.movement ? 'Saved on this device' : 'Choose how movement felt to finish'}
        </p>
      </div>

      {contactOpen && professional && <ContactSheet professional={professional} onClose={closeContact} />}
    </div>
  )
}
