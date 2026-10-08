import { Check } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CheckInNotes } from '../components/CheckInNotes'
import { RecoverySignalsCard } from '../components/RecoverySignalsCard'
import { Section } from '../components/Section'
import { whatChangedRecently } from '../data/progress'
import { sinceLastAppointment } from '../data/summary'
import { useCare } from '../utils/care'
import { readStored, storageKeys, writeStored } from '../utils/storage'

// Continuity between home rehabilitation and the next professional review. Connected care only;
// it prepares the conversation and does not schedule anything.
export function AppointmentScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { professional } = useCare()
  const [note, setNote] = useState(() => readStored(storageKeys.appointmentNote, ''))
  const [saved, setSaved] = useState(false)

  if (!professional) return <Navigate to="/support" replace />

  const summary = sinceLastAppointment(professional.daysSinceLastAppointment)
  const back = () => (location.key === 'default' ? navigate('/support') : navigate(-1))

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <header>
          <BackButton label="Back" onClick={back} />
          <h1 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            Prepare for your appointment
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-soft">
            With {professional.name}, {professional.credential} · {professional.nextAppointment}
          </p>
        </header>

        <Section id="changes" title="Changes since your last appointment">
          <p className="-mt-1 px-1 text-[17px] leading-relaxed text-ink">
            {summary.records.length} check-ins since {professional.lastAppointment}. {whatChangedRecently}
          </p>
          <RecoverySignalsCard
            signals={summary.signals}
            pain={{ points: summary.painPoints, reading: summary.painReading }}
            difficulty={{ points: summary.difficultyPoints, reading: summary.difficultyReading }}
          />
        </Section>

        <Section id="concerns" title="Recent concerns">
          <CheckInNotes />
        </Section>

        <Section id="discuss" title="What would you like to discuss?">
          <Card className="p-0">
            <label htmlFor="discuss-note" className="sr-only">
              What would you like to discuss?
            </label>
            <textarea
              id="discuss-note"
              rows={4}
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                setSaved(false)
              }}
              placeholder="For example, whether to progress an exercise"
              className="block w-full resize-none rounded-3xl bg-transparent px-6 py-5 text-[17px] text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </Card>
        </Section>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button
          onClick={() => {
            writeStored(storageKeys.appointmentNote, note)
            setSaved(true)
          }}
          icon={saved ? <Check className="size-[18px]" strokeWidth={2.25} aria-hidden /> : undefined}
        >
          {saved ? 'Saved for your appointment' : 'Save for my appointment'}
        </Button>
      </div>
    </div>
  )
}
