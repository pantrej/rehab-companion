import { ArrowRight, FileText } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DaySummarySheet } from '../components/DaySummarySheet'
import { MonthCalendar } from '../components/MonthCalendar'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { RecoverySignalsCard } from '../components/RecoverySignalsCard'
import { SegmentedControl } from '../components/SegmentedControl'
import { Section } from '../components/Section'
import { TomorrowPlanCard } from '../components/TomorrowPlanCard'
import { currentAssessment } from '../data/assessment'
import { buildMonth } from '../data/calendar'
import type { CalendarDay } from '../data/calendar'
import { progressPeriods, progressSummary, recentCheckIns } from '../data/progress'
import { sinceLastAppointment } from '../data/summary'
import type { ProgressRangeId } from '../types/progress'
import { useCare } from '../utils/care'
import { toneDot } from '../utils/tone'

// Progress means recovery change: the reading and trends come first, then session history (one tap per day),
// what's next, and continuity with professional care.
export function ProgressScreen() {
  const { professional, connected } = useCare()
  const [range, setRange] = useState<ProgressRangeId>('7d')
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const closeDay = useCallback(() => setSelectedDay(null), [])
  const days = useMemo(() => buildMonth(recentCheckIns, connected), [connected])
  const period = progressPeriods.find((p) => p.id === range) ?? progressPeriods[0]
  const assessment = currentAssessment(professional)

  return (
    <div className="flex flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <h1 className="text-title font-semibold text-ink">Progress</h1>

      {/* Recovery first: how pain, movement and effort are changing. Sessions are context, not the measure. */}
      <Section id="recovery" title="How your recovery is changing">
        {/* The one featured surface on Progress: the recovery reading, before any activity. */}
        <Card tone="featured" className="p-6">
          <p className="flex items-center gap-3 text-title font-semibold text-ink">
            <span className={`size-2.5 rounded-full ring-4 ${toneDot[assessment.tone]}`} aria-hidden />
            {assessment.verdict}
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-ink">{assessment.headline}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{progressSummary}</p>
          <Button
            to="/insight"
            state={{ returnTo: '/progress' }}
            variant="text"
            icon={<ArrowRight className="size-4" aria-hidden />}
            className="mt-3 -mb-2"
          >
            View recovery insight
          </Button>
        </Card>
      </Section>

      <Section id="signals" title="Recovery trends" aside={`Last ${period.label}`}>
        <SegmentedControl
          label="Time range"
          options={progressPeriods.map((p) => ({ id: p.id, label: p.label }))}
          value={range}
          onChange={setRange}
        />
        <RecoverySignalsCard
          signals={period.signals}
          pain={{
            points: period.painPoints,
            reading: period.painReading,
            band: { low: assessment.series.painLow, high: assessment.series.painHigh },
          }}
        />
      </Section>

      <Section id="calendar" title="Session history" aside="Tap a day">
        <MonthCalendar days={days} onSelect={setSelectedDay} showAppointments={connected} />
      </Section>

      <Section id="tomorrow" title="Tomorrow’s plan">
        <TomorrowPlanCard updated={!!professional} />
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

      {selectedDay && <DaySummarySheet day={selectedDay} professional={professional} onClose={closeDay} />}
    </div>
  )
}
