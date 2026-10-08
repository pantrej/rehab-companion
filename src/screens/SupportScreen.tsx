import { CalendarCheck, ChevronRight, FileText, MessageSquare } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ContactSheet } from '../components/ContactSheet'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { Section } from '../components/Section'
import { noProfessional, supportDisclaimer, supportIntro, supportTopics } from '../data/support'
import { useCare } from '../utils/care'

export function SupportScreen() {
  const { professional } = useCare()
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <header>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">{supportIntro.title}</h1>
      </header>

      {professional ? (
        <Section id="your-professional" title="Your physiotherapist">
          <ProfessionalCard professional={professional}>
            <div className="mt-5 flex flex-col gap-1">
              <Button
                aria-haspopup="dialog"
                onClick={() => setContactOpen(true)}
                icon={<MessageSquare className="size-4" strokeWidth={1.75} aria-hidden />}
              >
                Contact therapist
              </Button>
              <Button
                to="/appointment"
                variant="quiet"
                icon={<CalendarCheck className="size-4" strokeWidth={1.75} aria-hidden />}
              >
                Prepare for appointment
              </Button>
            </div>
          </ProfessionalCard>
        </Section>
      ) : (
        <Card className="p-6">
          <p className="text-[17px] font-semibold text-ink">{noProfessional.title}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{noProfessional.text}</p>
          <Button
            to="/summary"
            variant="secondary"
            icon={<FileText className="size-4" strokeWidth={1.75} aria-hidden />}
            className="mt-4"
          >
            Share recovery summary
          </Button>
        </Card>
      )}

      <Section id="topics" title={supportIntro.text}>
        <Card className="px-0 py-1">
          <ul className="divide-y divide-line">
            {supportTopics.map((topic) => (
              <li key={topic.id}>
                <Link
                  to={`/support/${topic.id}`}
                  className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 text-[17px] text-ink transition-colors hover:bg-canvas/60"
                >
                  {topic.label}
                  <ChevronRight className="size-5 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <p className="px-1 text-[13px] leading-relaxed text-ink-faint">{supportDisclaimer}</p>

      {contactOpen && professional && <ContactSheet professional={professional} onClose={closeContact} />}
    </div>
  )
}
