import { ArrowLeft, ArrowRight, BookOpen, ChartLine, Stethoscope } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ContactSheet } from '../components/ContactSheet'
import { Section } from '../components/Section'
import { outcomeLabels, supportDisclaimer, supportTopics } from '../data/support'
import type { SupportOutcome } from '../types/support'

// Amber only where professional input is recommended; the other outcomes stay calm.
const outcomeStyle: Record<SupportOutcome, { icon: LucideIcon; className: string }> = {
  guidance: { icon: BookOpen, className: 'bg-accent-soft text-accent' },
  monitor: { icon: ChartLine, className: 'bg-line/70 text-ink-soft' },
  professional: { icon: Stethoscope, className: 'bg-attention-soft text-attention' },
}

export function SupportTopicScreen() {
  const { topicId } = useParams()
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  const topic = supportTopics.find((t) => t.id === topicId)

  if (!topic) return <Navigate to="/support" replace />

  const { icon: OutcomeIcon, className: outcomeClass } = outcomeStyle[topic.outcome]
  const isProfessional = topic.outcome === 'professional'

  return (
    <div className="flex flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
      <header>
        <Link
          to="/support"
          aria-label="Back to support topics"
          className="-ml-2.5 flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-line/60"
        >
          <ArrowLeft className="size-[22px]" strokeWidth={1.75} aria-hidden />
        </Link>
        <p className="mt-5 text-[15px] text-ink-soft">You’re unsure about</p>
        <h1 className="mt-1.5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">{topic.label}</h1>
      </header>

      <div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${outcomeClass}`}>
          <OutcomeIcon className="size-4" strokeWidth={2} aria-hidden />
          {outcomeLabels[topic.outcome]}
        </span>
        <p className="mt-4 px-1 text-xl leading-snug font-medium tracking-[-0.01em] text-ink">{topic.message}</p>
      </div>

      {topic.context && (
        <Card className="p-5">
          <p className="text-sm text-ink-soft">From your recent check-ins</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink">{topic.context}</p>
        </Card>
      )}

      <Section id="what-you-can-do" title="What you can do">
        <Card className="px-6 py-2">
          <ul className="divide-y divide-line">
            {topic.steps.map((step) => (
              <li key={step} className="flex items-baseline gap-3 py-3.5 text-[15px] leading-relaxed text-ink">
                <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-accent" aria-hidden />
                {step}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <div className="flex flex-col gap-1">
        <Button
          variant={isProfessional ? 'primary' : 'secondary'}
          icon={<Stethoscope className="size-[18px]" strokeWidth={1.75} aria-hidden />}
          aria-haspopup="dialog"
          onClick={() => setContactOpen(true)}
        >
          Contact your rehabilitation professional
        </Button>
        {topic.related && (
          <Button to={topic.related.to} variant="ghost" icon={<ArrowRight className="size-4" aria-hidden />}>
            {topic.related.label}
          </Button>
        )}
        {topic.urgentNote && <p className="mt-3 px-1 text-sm text-ink-soft">{topic.urgentNote}</p>}
      </div>

      <p className="px-1 text-[13px] leading-relaxed text-ink-faint">{supportDisclaimer}</p>

      {contactOpen && <ContactSheet onClose={closeContact} />}
    </div>
  )
}
