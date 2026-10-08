import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { SegmentedControl } from '../components/SegmentedControl'
import { Section } from '../components/Section'
import { SignalDetail } from '../components/SignalDetail'
import { TrendLine } from '../components/TrendLine'
import {
  daysAgoLabel,
  movementTone,
  progressPeriods,
  progressSummary,
  recentCheckIns,
  whatChangedRecently,
} from '../data/progress'
import { recoveryOverall } from '../data/today'
import type { ProgressRangeId } from '../types/progress'
import { toneDot, toneText } from '../utils/tone'

// "Am I making progress?" — the overall read first, then each signal with its evidence, then the raw check-ins.
export function ProgressScreen() {
  const [range, setRange] = useState<ProgressRangeId>('7d')
  const period = progressPeriods.find((p) => p.id === range) ?? progressPeriods[0]

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
        <Card className="px-6 py-2">
          <ul className="divide-y divide-line">
            {period.signals.map((signal) => (
              <SignalDetail key={signal.id} {...signal}>
                {signal.id === 'pain' && (
                  <>
                    <TrendLine
                      points={period.painPoints}
                      max={10}
                      label="Pain at each check-in, out of 10"
                      formatValue={(v) => `${v}/10`}
                    />
                    <p className="mt-3 text-[15px] leading-relaxed text-ink">{period.painReading}</p>
                  </>
                )}
              </SignalDetail>
            ))}
          </ul>
        </Card>
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

      <Section id="check-ins" title="Recent check-ins">
        <Card className="px-6 py-2">
          <ul className="divide-y divide-line">
            {recentCheckIns.map((c) => (
              <li key={c.daysAgo} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-base font-medium text-ink">{daysAgoLabel(c.daysAgo)}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    Pain {c.pain}/10 · Difficulty {c.difficulty}/10
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] text-ink-faint">Movement</p>
                  <p className={`text-[15px] font-medium ${toneText[movementTone[c.movement]]}`}>{c.movement}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  )
}
