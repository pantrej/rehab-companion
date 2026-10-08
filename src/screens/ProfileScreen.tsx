import { ChevronRight, FileText, Info, PencilLine, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DetailList } from '../components/DetailList'
import { PersonalDetailsSheet } from '../components/PersonalDetailsSheet'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { Section } from '../components/Section'
import { Sheet } from '../components/Sheet'
import { aboutGuidance, carePrinciple, preferences } from '../data/profile'
import { connectedPlan } from '../data/professional'
import { todayPlan } from '../data/today'
import { useCare } from '../utils/care'

const notSet = 'Not set yet'

type OpenSheet = 'about' | 'professional' | 'personal' | null

function RowButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-between gap-4 px-6 py-4 text-left text-[17px] text-ink transition-colors hover:bg-canvas/60"
    >
      <span className="flex items-center gap-3">
        <Icon className="size-5 text-ink-soft" strokeWidth={1.75} aria-hidden />
        {label}
      </span>
      <ChevronRight className="size-5 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

export function ProfileScreen() {
  const { care, professional, update } = useCare()
  const [open, setOpen] = useState<OpenSheet>(null)
  const close = useCallback(() => setOpen(null), [])
  const setup = care?.setup ?? {}

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Profile</h1>

      {professional ? (
        <>
          <Section id="professional" title="Your rehabilitation professional">
            <ProfessionalCard professional={professional} showClinic>
              <Button variant="quiet" className="mt-3 -mb-2" aria-haspopup="dialog" onClick={() => setOpen('professional')}>
                View professional details
              </Button>
            </ProfessionalCard>
          </Section>

          <Section id="plan" title="Rehabilitation plan">
            <DetailList
              items={[
                { label: 'Plan', value: `Managed by ${professional.name}` },
                { label: 'Recovery context', value: connectedPlan.context },
                { label: 'Current focus', value: todayPlan.focus.join(' + ') },
                { label: 'Next review', value: professional.nextAppointment },
              ]}
            />
            <Button
              variant="secondary"
              aria-haspopup="dialog"
              onClick={() => setOpen('personal')}
              icon={<PencilLine className="size-4" strokeWidth={1.75} aria-hidden />}
            >
              Edit personal details
            </Button>
          </Section>
        </>
      ) : (
        <>
          <Section id="recovery-profile" title="Recovery profile">
            <DetailList
              items={[
                { label: 'Recovering from', value: setup.context ?? notSet },
                { label: 'Recovery stage', value: setup.stage ?? notSet },
                { label: 'Professional support', value: setup.support ?? notSet },
              ]}
            />
            <Button
              to="/onboarding?edit"
              variant="secondary"
              icon={<PencilLine className="size-4" strokeWidth={1.75} aria-hidden />}
            >
              Edit recovery setup
            </Button>
          </Section>

          <Section id="plan" title="Rehabilitation plan">
            <DetailList
              items={[
                { label: 'Existing plan from a professional', value: setup.plan ?? notSet },
                { label: 'Plan source', value: 'Your existing rehabilitation plan' },
                { label: 'Current focus', value: todayPlan.focus.join(' + ') },
              ]}
            />
          </Section>

          <Section id="professional" title="Rehabilitation professional">
            <Card className="p-6">
              <p className="text-[17px] font-semibold text-ink">No connected professional</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                You can share a summary of your recent check-ins with a professional you choose.
              </p>
              <Button
                to="/summary"
                variant="secondary"
                icon={<FileText className="size-4" strokeWidth={1.75} aria-hidden />}
                className="mt-4"
              >
                Share recovery summary
              </Button>
            </Card>
          </Section>
        </>
      )}

      <Section id="preferences" title="Preferences">
        <DetailList items={preferences} />
      </Section>

      <Section id="safety" title="Safety and information">
        <Card className="px-0 py-1">
          <RowButton icon={Info} label={aboutGuidance.title} onClick={() => setOpen('about')} />
        </Card>
        <p className="px-1 text-[15px] leading-relaxed text-ink-soft">{carePrinciple}</p>
      </Section>

      <Button
        to="/onboarding?change"
        variant="quiet"
        icon={<RefreshCw className="size-4" strokeWidth={1.75} aria-hidden />}
      >
        Change how I manage my rehabilitation
      </Button>

      {open === 'about' && (
        <Sheet title={aboutGuidance.title} onClose={close}>
          {aboutGuidance.paragraphs.map((p) => (
            <p key={p} className="mt-3 text-base leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
          <Button className="mt-6" onClick={close}>
            Done
          </Button>
        </Sheet>
      )}

      {open === 'professional' && professional && (
        <Sheet title={professional.name} onClose={close}>
          <DetailList
            className="mt-5"
            items={[
              { label: 'Role', value: professional.role },
              { label: 'Clinic', value: professional.clinic },
              { label: 'Last appointment', value: professional.lastAppointment },
              { label: 'Next appointment', value: professional.nextAppointment },
            ]}
          />
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            {professional.name} prepared your current plan and reviews it at your appointments. Changes to your plan
            are made during those reviews, not by the app.
          </p>
          <Button className="mt-6" onClick={close}>
            Done
          </Button>
        </Sheet>
      )}

      {open === 'personal' && professional && (
        <PersonalDetailsSheet
          preferredName={care?.preferredName}
          professionalName={professional.name}
          onSave={(preferredName) => update({ preferredName })}
          onClose={close}
        />
      )}
    </div>
  )
}
