import {
  ArrowRight,
  CalendarCheck,
  ChartLine,
  Check,
  CircleUser,
  FileText,
  HeartPulse,
  LifeBuoy,
  Play,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { AssessmentLine } from '../components/AssessmentLine'
import { BackButton } from '../components/BackButton'
import { navItems } from '../components/BottomNav'
import { TabItemView, tabItemClass } from '../components/BottomNavItem'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CautionNote } from '../components/CautionNote'
import { ChoiceOption } from '../components/ChoiceOption'
import { MiniTrend } from '../components/MiniTrend'
import { MovementMarks } from '../components/MovementMarks'
import { PainScale } from '../components/PainScale'
import { PlanUpdateNote } from '../components/PlanUpdateNote'
import { ProfessionalAvatar } from '../components/ProfessionalAvatar'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { RangeBar } from '../components/RangeBar'
import { SafetyGuide } from '../components/SafetyGuide'
import { SegmentedControl } from '../components/SegmentedControl'
import { SignalDetail } from '../components/SignalDetail'
import { StatusItem } from '../components/StatusItem'
import { StepHeader } from '../components/StepHeader'
import { TextField } from '../components/TextField'
import { TrendLine } from '../components/TrendLine'
import { assess, currentAssessment } from '../data/assessment'
import type { Assessment } from '../data/assessment'
import { professional } from '../data/professional'
import { progressPeriods } from '../data/progress'
import { currentExercise } from '../data/session'
import { recoverySignals, todayPlan } from '../data/today'
import { elevation, palette, principles, radii, spacing, typeScale } from './foundations'
import { DSSection, PhoneFrame, Rule, Specimen, SwatchTile } from './parts'

const nav = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'components', label: 'Components' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'in-context', label: 'In context' },
]

const onTrack = currentAssessment(professional)
// The same rules on worsening signals: how the system speaks when something is worth checking.
const worthChecking = assess(
  [
    { daysAgo: 1, pain: 5, difficulty: 8, movement: 'Worse' },
    { daysAgo: 3, pain: 4, difficulty: 7, movement: 'About the same' },
    { daysAgo: 5, pain: 2, difficulty: 6, movement: 'Better' },
  ],
  'in the last 7 days',
)

function WhatChanged({ a }: { a: Assessment }) {
  return (
    <Card className="px-6 py-2">
      <ul className="divide-y divide-line">
        {a.changes.map((signal) => (
          <SignalDetail key={signal.id} {...signal}>
            {signal.id === 'pain' && (
              <RangeBar value={a.series.pain[a.series.pain.length - 1]} low={a.series.painLow} high={a.series.painHigh} label="Pain" />
            )}
            {signal.id === 'mobility' && <MovementMarks values={a.series.movement} />}
            {signal.id === 'difficulty' && <MiniTrend values={a.series.difficulty} label="Session difficulty" showRange={false} />}
          </SignalDetail>
        ))}
      </ul>
    </Card>
  )
}

function Verdict({ a }: { a: Assessment }) {
  return (
    <Card tone="featured" className="p-6">
      <p className="text-caption font-medium text-accent">How it’s going</p>
      <AssessmentLine assessment={a} returnTo="/" />
    </Card>
  )
}

function TabBarPreview({ active }: { active: string }) {
  return (
    <div className="flex overflow-hidden rounded-card bg-surface px-2 shadow-raised" role="img" aria-label="Tab bar">
      {navItems.map((item) => (
        <span key={item.to} className={tabItemClass(item.label === active)}>
          <TabItemView label={item.label} icon={item.icon} active={item.label === active} />
        </span>
      ))}
    </div>
  )
}

function Prescription() {
  return (
    <Card className="p-6">
      <dl className="grid grid-cols-2 gap-4">
        {[
          ['sets', currentExercise.sets],
          ['repetitions', currentExercise.reps],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="mt-1 text-[15px] text-ink-soft">{label}</dt>
            <dd className="text-display font-semibold text-ink tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 border-t border-line pt-4 text-body font-medium text-ink">{currentExercise.equipment}</p>
    </Card>
  )
}

export function DesignSystemPage() {
  const [single, setSingle] = useState('A few weeks in')
  const [multi, setMulti] = useState<string[]>(['Exercise technique'])
  const [range, setRange] = useState<'7d' | '30d'>('7d')
  const [pain, setPain] = useState<number | undefined>(2)
  const [name, setName] = useState('Alex Novak')

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="sticky top-0 z-10 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-6 px-5 py-3 lg:px-10">
          <span className="flex items-center gap-2.5 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-accent text-white">
              <HeartPulse className="size-4.5" strokeWidth={2} aria-hidden />
            </span>
            Rehab Companion
          </span>
          <nav aria-label="Sections" className="ml-auto hidden gap-1 md:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded-full px-3 py-2 text-[15px] text-ink-soft hover:bg-surface hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <Link to="/welcome" className="ml-auto inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent md:ml-0">
            Open prototype <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 lg:px-10">
        {/* Hero */}
        <section className="grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="text-caption font-semibold tracking-[0.12em] text-accent uppercase">Design system · v2</p>
            <h1 className="mt-4 text-[44px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[56px]">
              A calm language for recovering at home.
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-ink-soft">
              The visual system behind Rehab Companion: warm surfaces, one restrained accent, and signals that explain
              recovery instead of scoring it. Every component on this page is the one the product ships.
            </p>
            <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {[
                ['Typeface', 'Figtree'],
                ['Type scale', '5 steps'],
                ['Rhythm', '8 px'],
                ['Surfaces', '3 levels'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-caption text-ink-faint">{k}</dt>
                  <dd className="mt-0.5 text-section font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] bg-surface p-5 shadow-card sm:p-6">
            <Verdict a={onTrack} />
            <WhatChanged a={onTrack} />
          </div>
        </section>

        {/* Principles */}
        <section aria-labelledby="principles" className="pb-16">
          <h2 id="principles" className="sr-only">
            Principles
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {principles.map((p, i) => (
              <li key={p.title} className="rounded-card bg-surface p-5 shadow-card">
                <span className="text-caption font-semibold text-accent">0{i + 1}</span>
                <p className="mt-2 text-section font-semibold leading-snug">{p.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <div id="foundations" className="scroll-mt-20" />
        <DSSection
          id="colour"
          index="01 · Foundations"
          title="Colour"
          intro="A warm neutral base and a single muted indigo. Green and amber carry meaning and nothing else, so they keep it."
        >
          {palette.map((group) => (
            <div key={group.group}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-section font-semibold">{group.group}</h3>
                <p className="text-[15px] text-ink-soft">{group.note}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {group.swatches.map((s) => (
                  <SwatchTile key={s.token} swatch={s} />
                ))}
              </div>
            </div>
          ))}
          <div className="grid gap-2 sm:grid-cols-2">
            <Rule>Green appears once per screen, on the overall verdict. Row statuses use ink with a small dot.</Rule>
            <Rule>Amber is reserved for caution and safety notes; it never decorates.</Rule>
          </div>
        </DSSection>

        <DSSection
          id="type"
          index="02 · Foundations"
          title="Typography"
          intro="Figtree, a warm humanist sans, on a five-step scale. Hierarchy comes from size and weight, never from colour."
        >
          <Card className="px-6 py-2">
            <ul className="divide-y divide-line">
              {typeScale.map((t) => (
                <li key={t.name} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-6">
                  <div>
                    <p className="text-[15px] font-semibold">{t.name}</p>
                    <p className="text-caption text-ink-faint">
                      {t.spec} · {t.token}
                    </p>
                  </div>
                  <div>
                    <p className={`${t.token} ${t.name === 'Body' || t.name === 'Caption' ? 'font-normal' : 'font-semibold'}`}>
                      {t.sample}
                    </p>
                    <p className="mt-1 text-caption text-ink-soft">{t.usage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </DSSection>

        <DSSection
          id="space"
          index="03 · Foundations"
          title="Space, shape & depth"
          intro="An 8 px rhythm, soft radii and only two shadows. Grouping comes from space first, surfaces second, lines last."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Spacing" note="8 px rhythm, with a 4 px half-step">
              <ul className="flex flex-col gap-3">
                {spacing.map((px) => (
                  <li key={px} className="flex items-center gap-4">
                    <span className="w-10 text-right text-caption tabular-nums text-ink-soft">{px}</span>
                    <span className="h-3 rounded-full bg-accent/80" style={{ width: px * 4 }} />
                  </li>
                ))}
              </ul>
            </Specimen>
            <div className="flex flex-col gap-6">
              <Specimen label="Radius">
                <div className="grid grid-cols-3 gap-4">
                  {radii.map((r) => (
                    <div key={r.name} className="text-center">
                      <div className={`mx-auto h-16 w-full max-w-24 border-2 border-accent/60 bg-surface ${r.className}`} />
                      <p className="mt-2 text-[15px] font-semibold">{r.name}</p>
                      <p className="text-caption text-ink-soft">
                        {r.value} · {r.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </Specimen>
              <Specimen label="Elevation">
                <div className="grid grid-cols-3 gap-4">
                  {elevation.map((e) => (
                    <div key={e.name} className="text-center">
                      <div className={`mx-auto h-16 w-full max-w-24 rounded-card ${e.className}`} />
                      <p className="mt-2 text-[15px] font-semibold">{e.name}</p>
                      <p className="text-caption text-ink-soft">{e.usage}</p>
                    </div>
                  ))}
                </div>
              </Specimen>
            </div>
          </div>
          <Specimen label="Iconography" note="Lucide · 1.75 stroke · 18–22 px · always beside a label">
            <div className="flex flex-wrap gap-3">
              {[CalendarCheck, ChartLine, LifeBuoy, CircleUser, Play, Check, Stethoscope, RefreshCw, FileText, ShieldAlert].map((Icon, i) => (
                <span key={i} className="flex size-14 items-center justify-center rounded-control bg-surface text-ink shadow-card">
                  <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden />
                </span>
              ))}
            </div>
          </Specimen>
        </DSSection>

        <div id="components" className="scroll-mt-20" />
        <DSSection
          id="actions"
          index="04 · Components"
          title="Actions"
          intro="Pill buttons with three levels of emphasis. One filled action per screen; everything else steps back."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Buttons" note="56 px primary and secondary · 44 px text">
              <div className="flex flex-col gap-2">
                <Button icon={<Play className="size-4 fill-current" aria-hidden />}>Start session</Button>
                <Button variant="secondary">View recovery summary</Button>
                <Button variant="text" icon={<ArrowRight className="size-4" aria-hidden />}>
                  View progress
                </Button>
                <Button variant="quiet">Skip for now</Button>
                <Button disabled>Continue</Button>
              </div>
            </Specimen>
            <div className="flex flex-col gap-3">
              <Rule>
                <strong className="font-semibold text-ink">Primary</strong> — the one next step: start, continue, done.
              </Rule>
              <Rule>
                <strong className="font-semibold text-ink">Secondary</strong> — a useful alternative that doesn’t move the flow on.
              </Rule>
              <Rule>
                <strong className="font-semibold text-ink">Text</strong> — navigation within a card; accent for paths,
                neutral for opting out.
              </Rule>
              <Rule>
                <strong className="font-semibold text-ink">Disabled</strong> — shown until an answer is chosen, never hidden.
              </Rule>
            </div>
          </div>
        </DSSection>

        <DSSection
          id="inputs"
          index="05 · Components"
          title="Inputs & check-in controls"
          intro="Large, forgiving targets: every control is at least 44 px, and the whole row is tappable."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Single choice">
              <div role="radiogroup" aria-label="Recovery stage" className="flex flex-col gap-3">
                {['Just started', 'A few weeks in', 'A few months in'].map((o) => (
                  <ChoiceOption key={o} label={o} selected={single === o} onSelect={() => setSingle(o)} />
                ))}
              </div>
            </Specimen>
            <Specimen label="Multiple choice">
              <div role="group" aria-label="Unsure about" className="flex flex-col gap-3">
                {['Pain or symptoms', 'Exercise technique', 'My progress'].map((o) => (
                  <ChoiceOption
                    key={o}
                    multiple
                    label={o}
                    selected={multi.includes(o)}
                    onSelect={() => setMulti(multi.includes(o) ? multi.filter((m) => m !== o) : [...multi, o])}
                  />
                ))}
              </div>
            </Specimen>
            <Specimen label="Pain scale" note="0–10 in two rows of large targets">
              <p id="ds-pain" className="sr-only">
                Pain during session
              </p>
              <PainScale value={pain} onChange={setPain} min={0} max={10} minLabel="No pain" maxLabel="Severe pain" labelledBy="ds-pain" />
            </Specimen>
            <div className="flex flex-col gap-6">
              <Specimen label="Text field">
                <div className="flex flex-col gap-5">
                  <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <TextField label="Connection code" defaultValue="111111" error="That code doesn’t match an invitation." />
                </div>
              </Specimen>
              <Specimen label="Segmented control">
                <SegmentedControl
                  label="Time range"
                  options={[
                    { id: '7d', label: '7 days' },
                    { id: '30d', label: '30 days' },
                  ]}
                  value={range}
                  onChange={setRange}
                />
              </Specimen>
            </div>
          </div>
        </DSSection>

        <DSSection
          id="surfaces"
          index="06 · Components"
          title="Cards & status"
          intro="Three surfaces give every screen one focal point. Status is a word first, a dot second, colour last."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card tone="featured" className="p-6">
              <p className="text-caption font-medium text-accent">Featured</p>
              <p className="mt-2 text-title font-semibold">{todayPlan.focus.join(' + ')}</p>
              <p className="mt-1 text-[15px] text-ink-soft">One per screen: what matters now.</p>
            </Card>
            <Card className="p-6">
              <p className="text-caption font-medium text-ink-soft">Default</p>
              <p className="mt-2 text-title font-semibold">Recovery trends</p>
              <p className="mt-1 text-[15px] text-ink-soft">Raised softly to group related content.</p>
            </Card>
            <Card tone="quiet" className="p-6">
              <p className="text-caption font-medium text-ink-soft">Quiet</p>
              <p className="mt-2 text-title font-semibold">Last session</p>
              <p className="mt-1 text-[15px] text-ink-soft">Supporting detail that should recede.</p>
            </Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Status rows">
              <Card className="p-6">
                <ul className="flex flex-col gap-3">
                  {recoverySignals.map((s) => (
                    <StatusItem key={s.id} {...s} />
                  ))}
                  <StatusItem label="Pain" status="Rising" tone="attention" />
                </ul>
              </Card>
            </Specimen>
            <Specimen label="Verdicts" note="The only place green is large">
              <div className="flex flex-col gap-3">
                <Verdict a={onTrack} />
                <Verdict a={worthChecking} />
              </div>
            </Specimen>
          </div>
        </DSSection>

        <DSSection
          id="navigation"
          index="07 · Components"
          title="Navigation"
          intro="Four tabs, one back control, and a segmented step bar for focused flows. The active state is a soft pill, not a colour flood."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Tab bar">
              <TabBarPreview active="Progress" />
            </Specimen>
            <Specimen label="Focused flow header" note="Back · step bar · count">
              <div className="flex flex-col gap-6">
                <StepHeader current={1} total={4} onBack={() => {}} />
                <div className="flex items-center gap-3">
                  <BackButton label="Back" onClick={() => {}} />
                  <span className="text-[15px] text-ink-soft">Back is always top-left, 44 px.</span>
                </div>
              </div>
            </Specimen>
          </div>
        </DSSection>

        <div id="patterns" className="scroll-mt-20" />
        <DSSection
          id="insight"
          index="08 · Patterns"
          title="Recovery insight"
          intro="Insight answers three questions in order: what changed, is it expected, what next. Each signal brings its own evidence."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="What changed" note="Range · movement marks · mini trend">
              <WhatChanged a={onTrack} />
            </Specimen>
            <Specimen label="Trend row" note="Fixed 0–10 scale with the usual range shaded">
              <Card className="px-6 py-2">
                <ul>
                <SignalDetail label="Pain" status="Stable" tone="positive" detail="Current: 2–3/10">
                  <TrendLine
                    points={progressPeriods[0].painPoints}
                    max={10}
                    label="Pain at each check-in, out of 10"
                    band={{ low: onTrack.series.painLow, high: onTrack.series.painHigh }}
                    formatValue={(v) => `${v}/10`}
                  />
                  <p className="mt-3 text-[15px] leading-relaxed text-ink">{progressPeriods[0].painReading}</p>
                </SignalDetail>
                </ul>
              </Card>
            </Specimen>
          </div>
          <Specimen label="When something is worth checking" note="Same rules, different data">
            <WhatChanged a={worthChecking} />
          </Specimen>
        </DSSection>

        <DSSection
          id="safety"
          index="09 · Patterns"
          title="Safety & support"
          intro="Guidance appears where uncertainty does: on demand during exercise, inline when a signal leaves its usual range, with the professional one tap away."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Safety guidance" note="Continue · ease off · stop">
              <Card className="p-6">
                <SafetyGuide professionalName={professional.name} />
              </Card>
            </Specimen>
            <div className="flex flex-col gap-6">
              <Specimen label="Caution note">
                <CautionNote>
                  That’s higher than your recent check-ins (2–{'⁠'}3/10). If the pain is sharp, spreading, or comes with
                  numbness, tingling or weakness, stop and contact {professional.name}.
                </CautionNote>
              </Specimen>
              <Specimen label="Therapist callout">
                <ProfessionalCard professional={professional}>
                  <Button className="mt-5" variant="secondary">
                    Contact therapist
                  </Button>
                </ProfessionalCard>
              </Specimen>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Exercise instruction" note="Prescription first, guidance on demand">
              <div className="flex flex-col gap-3">
                <p className="inline-flex w-fit items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 text-caption text-ink-soft shadow-card">
                  <ProfessionalAvatar professional={professional} size="sm" />
                  Prescribed by {professional.name}, {professional.credential}
                </p>
                <Prescription />
              </div>
            </Specimen>
            <Specimen label="Plan update" note="Always attributed to the professional">
              <Card className="p-6">
                <PlanUpdateNote />
              </Card>
            </Specimen>
          </div>
        </DSSection>

        <section id="in-context" aria-labelledby="in-context-title" className="scroll-mt-20 border-t border-line py-14 lg:py-20">
          <p className="text-caption font-semibold tracking-[0.12em] text-accent">10 · In context</p>
          <h2 id="in-context-title" className="mt-2 text-[30px] leading-tight font-semibold tracking-[-0.02em]">
            The system at work
          </h2>
          <p className="mt-3 max-w-2xl text-body text-ink-soft">
            The same components composed into the three moments that matter most: what to do today, how to do it safely,
            and what it means.
          </p>
          <div className="mt-10 grid justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
            <PhoneFrame title="Today — one featured card, one action">
              <div>
                <p className="text-body text-ink-soft">Good morning, Alex</p>
                <p className="mt-1 text-title font-semibold">Today’s rehabilitation</p>
              </div>
              <Card tone="featured" className="p-5">
                <p className="text-caption font-medium text-accent">Today’s plan</p>
                <p className="mt-2 text-title font-semibold">{todayPlan.focus.join(' + ')}</p>
                <p className="mt-1 text-[15px] text-ink-soft">
                  {todayPlan.exerciseCount} exercises · About {todayPlan.durationMinutes} min
                </p>
                <Button className="mt-5" icon={<Play className="size-4 fill-current" aria-hidden />}>
                  Start session
                </Button>
              </Card>
              <Card className="p-5">
                <AssessmentLine assessment={onTrack} returnTo="/" />
                <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                  {recoverySignals.map((s) => (
                    <StatusItem key={s.id} {...s} />
                  ))}
                </ul>
              </Card>
            </PhoneFrame>
            <PhoneFrame title="Exercise — prescription, then guidance">
              <StepHeader current={0} total={4} onBack={() => {}} backLabel="Back to Today" showCount={false} />
              <div className="-mt-2">
                <p className="text-caption font-medium text-accent">Exercise 1 of 4</p>
                <p className="mt-1 text-title font-semibold">{currentExercise.name}</p>
              </div>
              <Prescription />
              <Card className="p-5">
                <p className="text-section font-semibold">How should this feel?</p>
                <div className="mt-3">
                  <SafetyGuide professionalName={professional.name} />
                </div>
              </Card>
            </PhoneFrame>
            <PhoneFrame title="Insight — what changed, and what it means">
              <div>
                <p className="text-title font-semibold">Your recovery</p>
                <p className="mt-1 text-[15px] text-ink-soft">Based on 3 check-ins since 3 October</p>
              </div>
              <Verdict a={onTrack} />
              <WhatChanged a={onTrack} />
            </PhoneFrame>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-line py-10 text-[15px] text-ink-soft sm:flex-row sm:justify-between">
          <span>Rehab Companion · design system v2</span>
          <span>Tokens in src/styles/index.css · components in src/components</span>
        </footer>
      </main>
    </div>
  )
}
