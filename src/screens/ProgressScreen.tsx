import { ArrowRight, FileText } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CheckInList } from '../components/CheckInList'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { RecoverySignalsCard } from '../components/RecoverySignalsCard'
import { SegmentedControl } from '../components/SegmentedControl'
import { Section } from '../components/Section'
import { progressPeriods, progressSummary, recentCheckIns, whatChangedRecently } from '../data/progress'
import { sinceLastAppointment } from '../data/summary'
import { recoveryOverall } from '../data/today'
import type { ProgressRangeId } from '../types/progress'
import { useCare } from '../utils/care'
import { toneDot } from '../utils/tone'

// "Am I making progress?" — the overall read first, then each signal with its evidence, then continuity
// with professional care, then the raw check-ins.
export function ProgressScreen() {
  const [range, setRange] = useState<ProgressRangeId>('7d')
  const period = progressPeriods.find((p) => p.id === range) ?? progressPeriods[0]
  const { professional } = useCare()

  return (
    <div className="flex flex-col gap-10 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <header>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Progress</h1>
        <div className="mt-5">
          <SegmentedControl
            label="Time range"
            options={progressPeriods.map((p) => ({ id: p.id, label: p.label }))}
            value={range}
            onChange={setRange}
          />
        </div>
      </header>

      <Card className="p-6">
        <p className="text-sm text-ink-soft">{recoveryOverall.label}</p>
        <p className="mt-2 flex items-center gap-3 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">
          <span className={`size-2.5 rounded-full ring-4 ${toneDot[recoveryOverall.tone]}`} aria-hidden />
          {recoveryOverall.status}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{progressSummary}</p>
      </Card>

      <Section id="signals" title="Recovery signals" aside={`Last ${period.label}`}>
        <RecoverySignalsCard
          signals={period.signals}
          pain={{ points: period.painPoints, reading: period.painReading }}
        />
      </Section>

      <Section id="what-changed" title="What changed recently">
        <Card className="p-6">
          <p className="text-[17px] leading-relaxed text-ink">{whatChangedRecently}</p>
          <Button
            to="/insight"
            state={{ returnTo: '/progress' }}
            variant="ghost"
            icon={<ArrowRight className="size-4" aria-hidden />}
            className="mt-3 -mb-2"
          >
            View recovery insight
          </Button>
        </Card>
      </Section>

      {professional ? (
        <Section id="review" title="Next rehabilitation review">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <ProfessionalAvatar professional={professional} />
              <div>
                <p className="text-[17px] font-semibold text-ink">
                  {professional.name}, {professional.credential}
                </p>
                <p className="text-[15px] text-ink-soft">{professional.nextAppointment}</p>
              </div>
            </div>
            <p className="mt-4 border-t border-line pt-4 text-[15px] leading-relaxed text-ink">
              {sinceLastAppointment(professional.daysSinceLastAppointment).records.length} new check-ins since your
              last appointment.
            </p>
            <Button
              to="/summary"
              variant="secondary"
              icon={<FileText className="size-4" strokeWidth={1.75} aria-hidden />}
              className="mt-4"
            >
              View recovery summary
            </Button>
          </Card>
        </Section>
      ) : (
        <Section id="share" title="Recovery summary">
          <Card className="p-6">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              A short summary of your recent signals and check-ins, to share with a rehabilitation professional if
              you want another view.
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
      )}

      <Section id="check-ins" title="Recent check-ins">
        <CheckInList records={recentCheckIns} />
      </Section>
    </div>
  )
}
