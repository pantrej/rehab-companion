import { ChevronRight, Info, PencilLine } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DetailList } from '../components/DetailList'
import { Section } from '../components/Section'
import { Sheet } from '../components/Sheet'
import { aboutGuidance, carePrinciple, preferences } from '../data/profile'
import { todayPlan } from '../data/today'
import type { OnboardingAnswers } from '../types/onboarding'
import { readStored, storageKeys } from '../utils/storage'

const notSet = 'Not set yet'

export function ProfileScreen() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const closeAbout = useCallback(() => setAboutOpen(false), [])
  const setup = readStored<OnboardingAnswers>(storageKeys.setup, {})

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Profile</h1>

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
            { label: 'Prescribed by', value: 'Your physiotherapist' },
            { label: 'Current focus', value: todayPlan.focus.join(' + ') },
          ]}
        />
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
