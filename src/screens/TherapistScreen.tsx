import { CalendarCheck, MessageSquare } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ContactSheet } from '../components/ContactSheet'
import { DetailList } from '../components/DetailList'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { Section } from '../components/Section'
import { useCare } from '../utils/care'

// A small profile of the connected professional. Contact is guidance only; there is no messaging.
export function TherapistScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { professional } = useCare()
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  if (!professional) return <Navigate to="/support" replace />

  const back = () => (location.key === 'default' ? navigate('/support') : navigate(-1))

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
      <header>
        <BackButton label="Back" onClick={back} />
        <div className="mt-5 flex items-center gap-5">
          <ProfessionalAvatar professional={professional} size="xl" />
          <div>
            <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">{professional.name}</h1>
            <p className="mt-1 text-[15px] text-ink-soft">{professional.role}</p>
          </div>
        </div>
      </header>

      <DetailList
        items={[
          { label: 'Role', value: professional.role },
          { label: 'Clinic', value: professional.clinic },
          { label: 'Next appointment', value: professional.nextAppointment },
          { label: 'Last appointment', value: professional.lastAppointment },
        ]}
      />

      <Section id="about" title="About">
        <p className="-mt-1 px-1 text-[17px] leading-relaxed text-ink">{professional.about}</p>
      </Section>

      <Section id="note" title={`Note from ${professional.name.split(' ')[0]}`}>
        <Card className="p-6">
          <p className="text-[17px] leading-relaxed text-ink">“{professional.noteToPatient}”</p>
        </Card>
      </Section>

      <div className="flex flex-col gap-1">
        <Button
          aria-haspopup="dialog"
          onClick={() => setContactOpen(true)}
          icon={<MessageSquare className="size-4" strokeWidth={1.75} aria-hidden />}
        >
          Contact {professional.name.split(' ')[0]}
        </Button>
        <Button
          to="/appointment"
          variant="quiet"
          icon={<CalendarCheck className="size-4" strokeWidth={1.75} aria-hidden />}
        >
          Prepare for appointment
        </Button>
      </div>

      {contactOpen && <ContactSheet professional={professional} onClose={closeContact} />}
    </div>
  )
}
