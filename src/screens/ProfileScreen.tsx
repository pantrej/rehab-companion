import { ChevronRight, FileText, Info, LogOut, PencilLine, RefreshCw, UserRound } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DetailList } from '../components/DetailList'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { Section } from '../components/Section'
import { Sheet } from '../components/Sheet'
import { patientRecord } from '../data/patient'
import { planDetails } from '../data/plan'
import { aboutGuidance, carePrinciple, preferences } from '../data/profile'
import { connectedPlan } from '../data/professional'
import { initialsOf, logOut, useAccount } from '../utils/auth'
import { useCare } from '../utils/care'

const notSet = 'Not set yet'

export function ProfileScreen() {
  const navigate = useNavigate()
  const account = useAccount()
  const { care, professional } = useCare()
  const [aboutOpen, setAboutOpen] = useState(false)
  const closeAbout = useCallback(() => setAboutOpen(false), [])
  const setup = care?.setup ?? {}
  const name = account?.fullName ?? 'You'

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Profile</h1>

      <Section id="patient" title="Patient profile">
        <Card className="flex items-center gap-4 p-6">
          <Avatar initials={initialsOf(name)} size="lg" />
          <div>
            <p className="text-[17px] font-semibold text-ink">{name}</p>
            {professional && <p className="text-[15px] text-ink-soft">{patientRecord.age} years</p>}
          </div>
        </Card>
        {professional ? (
          <>
            <DetailList
              items={[
                { label: 'Recovery context', value: connectedPlan.context },
                { label: 'Diagnosis', value: patientRecord.diagnosis },
                { label: 'Injury date', value: patientRecord.injuryDate },
                { label: 'Recovery stage', value: patientRecord.recoveryStage },
              ]}
            />
            <p className="-mt-1 px-1 text-[13px] text-ink-faint">From {professional.name}’s records</p>
          </>
        ) : (
          <>
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
          </>
        )}
      </Section>

      <Section id="care" title="Professional care">
        {professional ? (
          <ProfessionalCard professional={professional} showClinic>
            <Button
              to="/therapist"
              variant="quiet"
              className="mt-3 -mb-2"
              icon={<UserRound className="size-4" strokeWidth={1.75} aria-hidden />}
            >
              View therapist profile
            </Button>
          </ProfessionalCard>
        ) : (
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
        )}
      </Section>

      <Section id="plan" title="Rehabilitation plan">
        {professional ? (
          <>
            <DetailList
              items={[
                { label: 'Plan', value: `Managed by ${professional.name}` },
                { label: 'Focus', value: planDetails.focus },
                { label: 'Frequency', value: `${planDetails.daysPerWeek} days per week` },
                { label: 'Restrictions', value: patientRecord.restrictions },
                { label: 'Last updated', value: planDetails.lastUpdated },
              ]}
            />
            <Button
              to="/plan-changes"
              variant="quiet"
              icon={<ChevronRight className="size-4" aria-hidden />}
            >
              View plan changes
            </Button>
          </>
        ) : (
          <DetailList
            items={[
              { label: 'Existing plan from a professional', value: setup.plan ?? notSet },
              { label: 'Plan source', value: 'Your existing rehabilitation plan' },
              { label: 'Focus', value: planDetails.focus },
            ]}
          />
        )}
      </Section>

      <Section id="preferences" title="Preferences">
        <DetailList items={preferences} />
      </Section>

      <Section id="safety" title="Safety and information">
        <Card className="px-0 py-1">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setAboutOpen(true)}
            className="flex min-h-14 w-full items-center justify-between gap-4 px-6 py-4 text-left text-[17px] text-ink transition-colors hover:bg-canvas/60"
          >
            <span className="flex items-center gap-3">
              <Info className="size-5 text-ink-soft" strokeWidth={1.75} aria-hidden />
              {aboutGuidance.title}
            </span>
            <ChevronRight className="size-5 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden />
          </button>
        </Card>
        <p className="px-1 text-[15px] leading-relaxed text-ink-soft">{carePrinciple}</p>
      </Section>

      <Section id="account" title="Account">
        <DetailList items={[{ label: 'Email', value: account?.email ?? '—' }]} />
        <div className="flex flex-col gap-1">
          <Button
            to="/onboarding?change"
            variant="quiet"
            icon={<RefreshCw className="size-4" strokeWidth={1.75} aria-hidden />}
          >
            Change how I manage my rehabilitation
          </Button>
          <Button
            variant="quiet"
            onClick={() => {
              logOut()
              navigate('/welcome', { replace: true })
            }}
            icon={<LogOut className="size-4" strokeWidth={1.75} aria-hidden />}
          >
            Log out
          </Button>
        </div>
      </Section>

      {aboutOpen && (
        <Sheet title={aboutGuidance.title} onClose={closeAbout}>
          {aboutGuidance.paragraphs.map((p) => (
            <p key={p} className="mt-3 text-base leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
          <Button className="mt-6" onClick={closeAbout}>
            Done
          </Button>
        </Sheet>
      )}
    </div>
  )
}
