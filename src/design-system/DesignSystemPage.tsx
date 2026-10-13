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
import type { ReactNode } from 'react'
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
import { toneDot, toneSolid, toneStatusText, toneText } from '../utils/tone'
import { elevation, palette, principles, radii, spacing, typeScale } from './foundations'
import { ColourStrip, Eyebrow, PhoneFrame, SectionHead, Showcase } from './parts'

const nav = [
  { id: 'principles', label: 'Principles' },
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

const icons = [
  [CalendarCheck, 'Today'],
  [ChartLine, 'Progress'],
  [LifeBuoy, 'Support'],
  [CircleUser, 'Profile'],
  [Play, 'Start'],
  [Check, 'Done'],
  [Stethoscope, 'Therapist'],
  [RefreshCw, 'Plan change'],
  [FileText, 'Summary'],
  [ShieldAlert, 'Safety'],
] as const

// The evidence each signal brings, in the order the product shows it.
function Evidence({ a, id, withRange = false }: { a: Assessment; id: string; withRange?: boolean }) {
  if (id === 'pain') return <RangeBar value={a.series.pain[a.series.pain.length - 1]} low={a.series.painLow} high={a.series.painHigh} label="Pain" />
  if (id === 'mobility') return <MovementMarks values={a.series.movement} />
  return <MiniTrend values={a.series.difficulty} label="Session difficulty" showRange={withRange} />
}

function StatusWord({ tone, children }: { tone: Assessment['tone']; children: ReactNode }) {
  return (
    <span className={`flex items-center gap-2 font-medium ${toneStatusText[tone]}`}>
      <span className={`size-2 rounded-full ${toneSolid[tone]}`} aria-hidden />
      {children}
    </span>
  )
}

function VerdictMark({ a, size = 'lg' }: { a: Assessment; size?: 'lg' | 'xl' }) {
  return (
    <p
      className={`flex items-center gap-3.5 leading-none font-semibold tracking-[-0.03em] ${toneText[a.tone]} ${
        size === 'xl' ? 'text-[44px] lg:text-[56px]' : 'text-[32px] sm:text-[38px]'
      }`}
    >
      <span className={`size-3.5 shrink-0 rounded-full ring-[6px] ${toneDot[a.tone]}`} aria-hidden />
      {a.verdict}
    </p>
  )
}

// The hero: one recovery reading, status first and metrics second, on the page's only raised surface.
function InsightFeature({ a }: { a: Assessment }) {
  return (
    <figure className="rounded-[32px] bg-surface px-8 py-10 shadow-[0_1px_2px_rgb(29_28_33/0.04),0_40px_80px_-48px_rgb(29_28_33/0.22)] sm:px-12 sm:py-12">
      <p className="text-[13px] font-medium text-ink-faint">
        {a.checkInCount} check-ins {a.scope}
      </p>
      <div className="mt-7">
        <VerdictMark a={a} />
      </div>
      <p className="mt-5 max-w-[22rem] text-[21px] leading-snug text-ink">{a.headline}</p>
      <dl className="mt-10">
        {a.changes.map((s) => (
          <div key={s.id} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-t border-line py-5">
            <dt className="text-[15px] font-semibold text-ink">{s.label}</dt>
            <dd className="text-[15px]">
              <StatusWord tone={s.tone}>{s.status}</StatusWord>
            </dd>
            <dd className="col-span-2 mt-4">
              <Evidence a={a} id={s.id} withRange />
            </dd>
          </div>
        ))}
      </dl>
    </figure>
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
    <div>
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
      <p className="mt-5 border-t border-ink/10 pt-4 text-body font-medium text-ink">{currentExercise.equipment}</p>
    </div>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p>{children}</p>
}

export function DesignSystemPage() {
  const [single, setSingle] = useState('A few weeks in')
  const [multi, setMulti] = useState<string[]>(['Exercise technique'])
  const [range, setRange] = useState<'7d' | '30d'>('7d')
  const [pain, setPain] = useState<number | undefined>(2)
  const [name, setName] = useState('Alex Novak')

  return (
    <div className="min-h-dvh bg-canvas text-ink antialiased">
      <header className="sticky top-0 z-20 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center gap-8 px-6 py-4 lg:px-12">
          <span className="flex items-center gap-2.5 text-[15px] font-semibold">
            <HeartPulse className="size-5 text-accent" strokeWidth={2} aria-hidden />
            Rehab Companion
          </span>
          <nav aria-label="Sections" className="ml-auto hidden gap-7 md:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-[14px] text-ink-soft transition-colors hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <Link to="/welcome" className="ml-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent md:ml-0">
            Open prototype <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-[1240px] px-6 lg:px-12">
          {/* Hero */}
          <section id="top" className="grid gap-16 pt-14 pb-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-16 lg:pb-32">
            <div className="lg:col-span-6">
              <Eyebrow>Design system · V2</Eyebrow>
              <h1 className="mt-6 text-[48px] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-[60px] lg:text-[70px]">
                A calm language for recovering at home.
              </h1>
              <p className="mt-8 max-w-[29rem] text-[18px] leading-relaxed text-ink-soft">
                Warm surfaces, one restrained accent and signals that explain recovery instead of scoring it. Every
                component here is the one the product ships.
              </p>
              <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink/10 pt-6">
                {[
                  ['Typeface', 'Figtree'],
                  ['Scale', '5 steps'],
                  ['Rhythm', '8 px'],
                  ['Accent', 'One indigo'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px] tracking-wide text-ink-faint">{k}</dt>
                    <dd className="mt-1 text-[15px] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <InsightFeature a={onTrack} />
            </div>
          </section>

          {/* Principles */}
          <section id="principles" aria-labelledby="principles-title" className="grid scroll-mt-20 gap-12 border-t border-ink/10 py-24 lg:grid-cols-12 lg:py-32">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Eyebrow>Principles</Eyebrow>
                <h2 id="principles-title" className="mt-4 text-[34px] leading-[1.08] font-semibold tracking-[-0.025em] lg:text-[42px]">
                  Five decisions behind every screen.
                </h2>
              </div>
            </div>
            <ol className="lg:col-span-7 lg:col-start-6">
              {principles.map((p, i) => (
                <li
                  key={p.title}
                  className="grid gap-x-10 gap-y-3 border-b border-ink/10 py-9 first:pt-0 last:border-b-0 sm:grid-cols-[5.5rem_1fr]"
                >
                  <span className="text-[44px] leading-none font-normal tracking-[-0.03em] text-ink-faint/70 tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">{p.title}</p>
                    <p className="mt-3 max-w-[30rem] text-[17px] leading-relaxed text-ink-soft">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Foundations */}
          <section id="foundations" aria-labelledby="foundations-title" className="scroll-mt-20 border-t border-ink/10 pt-24 lg:pt-32">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHead
                eyebrow="Foundations"
                title="Type leads. Colour follows."
                intro="Hierarchy comes from size and weight first, space second, colour last."
              />
            </div>

            {/* Typography */}
            <div id="type" className="grid scroll-mt-24 gap-12 py-20 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <p className="text-[160px] leading-[0.85] font-semibold tracking-[-0.05em] text-ink lg:text-[200px]" aria-hidden>
                  Aa
                </p>
                <p className="mt-8 text-[22px] font-semibold tracking-[-0.01em]">Figtree</p>
                <p className="mt-2 max-w-[18rem] text-[15px] leading-relaxed text-ink-soft">
                  A warm humanist sans: open shapes, friendly at small sizes, steady at large ones.
                </p>
                <p className="mt-6 flex gap-5 text-[15px] text-ink-soft">
                  <span className="font-normal">Regular</span>
                  <span className="font-medium">Medium</span>
                  <span className="font-semibold text-ink">Semibold</span>
                </p>
              </div>
              <ul className="lg:col-span-7 lg:col-start-6">
                {typeScale.map((t) => (
                  <li key={t.name} className="grid gap-3 border-t border-ink/10 py-7 sm:grid-cols-[8.5rem_1fr] sm:items-baseline sm:gap-8">
                    <div>
                      <p className="text-[13px] font-semibold text-ink">{t.name}</p>
                      <p className="mt-0.5 text-[12px] text-ink-faint tabular-nums">{t.spec}</p>
                    </div>
                    <div>
                      <p className={`${t.token} max-w-[28rem] ${t.name === 'Body' ? 'font-normal' : t.name === 'Caption' ? 'font-medium text-ink-soft' : 'font-semibold'}`}>
                        {t.sample}
                      </p>
                      <p className="mt-2 text-[13px] text-ink-faint">{t.usage}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colour */}
            <div id="colour" className="scroll-mt-24 border-t border-ink/10 py-20">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Colour</h3>
                  <p className="mt-4 max-w-[20rem] text-[17px] leading-relaxed text-ink-soft">
                    A warm neutral base and a single muted indigo. Green and amber carry meaning and nothing else, so
                    they keep it.
                  </p>
                </div>
                <div className="flex flex-col gap-14 lg:col-span-8">
                  <ColourStrip swatches={palette[0].swatches} tall />
                  <div className="grid gap-14 sm:grid-cols-2 sm:gap-10">
                    <ColourStrip swatches={palette[1].swatches} />
                    <ColourStrip swatches={palette[2].swatches} />
                  </div>
                  <ColourStrip swatches={palette[3].swatches} />
                  <div className="grid gap-8 border-t border-ink/10 pt-8 text-[15px] leading-relaxed text-ink-soft sm:grid-cols-2 sm:gap-10">
                    <p>
                      <span className="font-semibold text-ink">Green appears once per screen</span>, on the overall
                      verdict. Row statuses use ink with a small dot.
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Amber is reserved</span> for caution and safety notes; it
                      never decorates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Space, shape, depth */}
            <div id="space" className="scroll-mt-24 border-t border-ink/10 py-20">
              <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Rhythm</h3>
                  <p className="mt-4 max-w-[22rem] text-[17px] leading-relaxed text-ink-soft">
                    An 8 px rhythm with a 4 px half-step. Grouping comes from space first, surfaces second, lines last.
                  </p>
                  <ol className="mt-12 flex items-end gap-4" aria-label="Spacing scale">
                    {spacing.map((px) => (
                      <li key={px} className="flex flex-col items-center gap-3">
                        <span className="rounded-[3px] bg-accent" style={{ width: px, height: px }} aria-hidden />
                        <span className="text-[12px] text-ink-faint tabular-nums">{px}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="grid gap-16 sm:grid-cols-2 sm:gap-10 lg:col-span-6 lg:col-start-7">
                  <div>
                    <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Shape</h3>
                    <ul className="mt-8 flex flex-col gap-6">
                      {radii.map((r) => (
                        <li key={r.name} className="flex items-center gap-5">
                          <span className={`h-12 w-20 shrink-0 border-[1.5px] border-ink/25 ${r.className}`} aria-hidden />
                          <span>
                            <span className="block text-[15px] font-semibold">
                              {r.name} <span className="font-normal text-ink-faint">· {r.value}</span>
                            </span>
                            <span className="block text-[13px] text-ink-soft">{r.usage}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Depth</h3>
                    <ul className="mt-8 flex flex-col gap-6">
                      {elevation.map((e) => (
                        <li key={e.name} className="flex items-center gap-5">
                          <span className={`h-12 w-20 shrink-0 rounded-[14px] ${e.className}`} aria-hidden />
                          <span>
                            <span className="block text-[15px] font-semibold">{e.name}</span>
                            <span className="block text-[13px] text-ink-soft">{e.usage}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-20 grid gap-8 border-t border-ink/10 pt-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <h3 className="text-[15px] font-semibold">Icons</h3>
                  <p className="mt-1 text-[13px] text-ink-soft">Lucide · 1.75 stroke · always beside a label</p>
                </div>
                <ul className="grid grid-cols-5 gap-x-6 gap-y-8 lg:col-span-8 lg:grid-cols-10">
                  {icons.map(([Icon, label]) => (
                    <li key={label} className="flex flex-col items-start gap-2.5">
                      <Icon className="size-[22px] text-ink" strokeWidth={1.75} aria-hidden />
                      <span className="text-[12px] text-ink-faint">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Components */}
          <section id="components" aria-labelledby="components-title" className="scroll-mt-20 border-t border-ink/10 pt-24 lg:pt-32">
            <SectionHead
              eyebrow="Components"
              title="Few parts, each with one job."
              intro="One large example per family, the states around it, and why it looks the way it does."
            />

            <Showcase
              id="actions"
              title="Buttons & actions"
              rationale={
                <>
                  <Note>One filled action per screen. It is always the next step: start, continue, done.</Note>
                  <Note>Everything else steps back, to a soft fill, a text link, or a quiet way out.</Note>
                </>
              }
              primary={
                <div className="max-w-[22rem]">
                  <p className="text-caption font-medium text-accent">Today’s plan</p>
                  <p className="mt-2 text-[30px] leading-tight font-semibold tracking-[-0.02em]">{todayPlan.focus.join(' + ')}</p>
                  <p className="mt-2 text-[15px] text-ink-soft">
                    {todayPlan.exerciseCount} exercises · About {todayPlan.durationMinutes} min
                  </p>
                  <div className="mt-8 flex flex-col gap-1">
                    <Button icon={<Play className="size-4 fill-current" aria-hidden />}>Start session</Button>
                    <Button variant="text" icon={<ArrowRight className="size-4" aria-hidden />}>
                      View progress
                    </Button>
                  </div>
                </div>
              }
              states={[
                { label: 'Secondary', node: <Button variant="secondary">View recovery summary</Button> },
                {
                  label: 'Quiet · disabled until answered',
                  node: (
                    <div className="flex flex-col gap-2">
                      <Button disabled>Continue</Button>
                      <Button variant="quiet">Skip for now</Button>
                    </div>
                  ),
                },
              ]}
            />

            <Showcase
              id="status"
              flip
              title="Status & recovery signals"
              rationale={
                <>
                  <Note>Status is a word first, a dot second, colour last.</Note>
                  <Note>Green is large exactly once, on the verdict. Rows stay in ink so the screen never shouts.</Note>
                </>
              }
              primary={
                <div className="max-w-[26rem]">
                  <AssessmentLine assessment={onTrack} returnTo="/" />
                  <ul className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-7">
                    {recoverySignals.map((s) => (
                      <StatusItem key={s.id} {...s} />
                    ))}
                  </ul>
                </div>
              }
              states={[
                { label: 'Worth checking', node: <AssessmentLine assessment={worthChecking} returnTo="/" /> },
                {
                  label: 'Signal with evidence',
                  node: (
                    <ul>
                      <SignalDetail {...worthChecking.changes[0]}>
                        <Evidence a={worthChecking} id="pain" />
                      </SignalDetail>
                    </ul>
                  ),
                },
              ]}
            />

            <Showcase
              id="check-in"
              title="Check-in controls"
              rationale={
                <>
                  <Note>Large, forgiving targets. Every control is at least 44 px and the whole row is tappable.</Note>
                  <Note>One question per screen, asked in plain words, with the scale’s ends named.</Note>
                </>
              }
              primary={
                <div>
                  <p id="ds-pain" className="max-w-[24rem] text-[26px] leading-tight font-semibold tracking-[-0.02em]">
                    How was your pain during the session?
                  </p>
                  <div className="mt-8">
                    <PainScale value={pain} onChange={setPain} min={0} max={10} minLabel="No pain" maxLabel="Severe pain" labelledBy="ds-pain" />
                  </div>
                </div>
              }
              states={[
                {
                  label: 'Single choice',
                  node: (
                    <div role="radiogroup" aria-label="Recovery stage" className="flex flex-col gap-3">
                      {['Just started', 'A few weeks in', 'A few months in'].map((o) => (
                        <ChoiceOption key={o} label={o} selected={single === o} onSelect={() => setSingle(o)} />
                      ))}
                    </div>
                  ),
                },
                {
                  label: 'Multiple choice',
                  node: (
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
                  ),
                },
                { label: 'Text field', node: <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} /> },
                {
                  label: 'Error, in plain words',
                  node: <TextField label="Connection code" defaultValue="111111" error="That code doesn’t match an invitation." />,
                },
              ]}
            />

            <Showcase
              id="progress-components"
              flip
              title="Insight & progress"
              rationale={
                <>
                  <Note>Fixed 0–10 scales, so “stable” honestly reads as flat.</Note>
                  <Note>Every chart compares you with yourself, never with a population, and every number arrives with a sentence.</Note>
                </>
              }
              primary={
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[20px] font-semibold">Pain</p>
                    <span className="text-[15px]">
                      <StatusWord tone="positive">Stable</StatusWord>
                    </span>
                  </div>
                  <div className="mt-6 max-w-[400px]">
                    <TrendLine
                      points={progressPeriods[0].painPoints}
                      max={10}
                      label="Pain at each check-in, out of 10"
                      band={{ low: onTrack.series.painLow, high: onTrack.series.painHigh }}
                      formatValue={(v) => `${v}/10`}
                    />
                  </div>
                  <p className="mt-6 max-w-[26rem] text-[17px] leading-relaxed text-ink">{progressPeriods[0].painReading}</p>
                </div>
              }
              states={[
                { label: 'Usual range', node: <Evidence a={onTrack} id="pain" /> },
                { label: 'Movement marks', node: <Evidence a={onTrack} id="mobility" /> },
                {
                  label: 'Mini trend',
                  node: <MiniTrend values={onTrack.series.difficulty} label="Session difficulty" />,
                },
                {
                  label: 'Time range',
                  node: (
                    <SegmentedControl
                      label="Time range"
                      options={[
                        { id: '7d', label: '7 days' },
                        { id: '30d', label: '30 days' },
                      ]}
                      value={range}
                      onChange={setRange}
                    />
                  ),
                },
              ]}
            />

            <Showcase
              id="navigation"
              title="Navigation"
              rationale={
                <>
                  <Note>Four tabs, one back control, and a step bar for focused flows.</Note>
                  <Note>The active tab is a soft pill, not a flood of colour. Back is always top-left.</Note>
                </>
              }
              primary={
                <div className="mx-auto max-w-[24rem]">
                  <TabBarPreview active="Today" />
                </div>
              }
              states={[
                { label: 'Focused flow header', node: <StepHeader current={1} total={4} onBack={() => {}} /> },
                {
                  label: 'Back',
                  node: (
                    <div className="flex items-center gap-3">
                      <BackButton label="Back" onClick={() => {}} />
                      <span className="text-[15px] text-ink-soft">Always top-left, 44 px</span>
                    </div>
                  ),
                },
              ]}
            />
          </section>

          {/* Patterns */}
          <section id="patterns" aria-labelledby="patterns-title" className="scroll-mt-20 border-t border-ink/10 pt-24 lg:pt-32">
            <SectionHead
              eyebrow="Patterns"
              title="Status first. Metrics second."
              intro="Insight answers what changed, whether it’s expected and what to do next, in that order and in plain words."
            />

            <div id="insight" className="grid scroll-mt-24 gap-16 py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
              <div className="lg:col-span-5">
                <p className="text-[13px] font-medium text-ink-faint">
                  {onTrack.checkInCount} check-ins {onTrack.scope}
                </p>
                <div className="mt-8">
                  <VerdictMark a={onTrack} size="xl" />
                </div>
                <p className="mt-7 max-w-[24rem] text-[26px] leading-snug tracking-[-0.01em] text-ink">{onTrack.headline}</p>
              </div>
              <dl className="lg:col-span-6 lg:col-start-7">
                {onTrack.changes.map((s) => (
                  <div key={s.id} className="grid gap-x-8 gap-y-4 border-t border-ink/10 py-8 first:border-t-0 first:pt-2 sm:grid-cols-[9rem_1fr]">
                    <dt>
                      <span className="block text-[17px] font-semibold">{s.label}</span>
                      <span className="mt-1.5 block text-[15px]">
                        <StatusWord tone={s.tone}>{s.status}</StatusWord>
                      </span>
                    </dt>
                    <dd className="flex flex-col gap-5">
                      <p className="text-[19px] leading-snug text-ink">{s.detail}</p>
                      <Evidence a={onTrack} id={s.id} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* The same rules on different data, as a quieter band. */}
            <div className="grid gap-10 rounded-[28px] bg-attention-soft/45 px-8 py-12 sm:px-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <p className="text-[12px] font-semibold tracking-[0.14em] text-ink-faint uppercase">Same rules, different data</p>
                <div className="mt-6">
                  <VerdictMark a={worthChecking} />
                </div>
                <p className="mt-4 max-w-[22rem] text-[19px] leading-snug text-ink">{worthChecking.headline}</p>
              </div>
              <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7 lg:self-end">
                {worthChecking.changes.map((s) => (
                  <li key={s.id}>
                    <p className="text-[15px] font-semibold">{s.label}</p>
                    <p className="mt-1.5 text-[15px]">
                      <StatusWord tone={s.tone}>{s.status}</StatusWord>
                    </p>
                    <p className="mt-2 text-[13px] leading-snug text-ink-soft">{s.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <Showcase
              id="safety"
              flip
              title="Safety & support"
              rationale={
                <>
                  <Note>Guidance appears where uncertainty does: on demand during exercise, inline when a signal leaves its usual range.</Note>
                  <Note>The professional is always one tap away, and every plan change is attributed to them.</Note>
                </>
              }
              primary={
                <div className="max-w-[28rem]">
                  <p className="text-[22px] font-semibold tracking-[-0.01em]">How should this feel?</p>
                  <div className="mt-5">
                    <SafetyGuide professionalName={professional.name} />
                  </div>
                </div>
              }
              states={[
                {
                  label: 'Caution note',
                  node: (
                    <CautionNote>
                      That’s higher than your recent check-ins (2–{'⁠'}3/10). If the pain is sharp, spreading, or comes
                      with numbness, tingling or weakness, stop and contact {professional.name}.
                    </CautionNote>
                  ),
                },
                { label: 'Plan update', node: <PlanUpdateNote /> },
                {
                  label: 'Prescription',
                  node: (
                    <div className="flex flex-col gap-4">
                      <p className="inline-flex w-fit items-center gap-2 text-caption text-ink-soft">
                        <ProfessionalAvatar professional={professional} size="sm" />
                        Prescribed by {professional.name}, {professional.credential}
                      </p>
                      <Prescription />
                    </div>
                  ),
                },
                {
                  label: 'Therapist',
                  node: (
                    <ProfessionalCard professional={professional}>
                      <Button className="mt-5" variant="secondary">
                        Contact therapist
                      </Button>
                    </ProfessionalCard>
                  ),
                },
              ]}
            />
          </section>
        </div>

        {/* In context: the one full-width moment. */}
        <section id="in-context" aria-labelledby="in-context-title" className="scroll-mt-16 bg-subtle/70 py-24 lg:py-32">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <Eyebrow>In context</Eyebrow>
                <h2 id="in-context-title" className="mt-4 text-[34px] leading-[1.08] font-semibold tracking-[-0.025em] lg:text-[42px]">
                  Three moments that matter.
                </h2>
              </div>
              <p className="max-w-[26rem] text-[17px] leading-relaxed text-ink-soft lg:col-span-5 lg:col-start-8">
                What to do today, how to do it safely, and what it means. The same components, composed into the product.
              </p>
            </div>
            <div className="mt-20 grid justify-items-center gap-14 md:grid-cols-2 xl:grid-cols-3 xl:items-start">
              <PhoneFrame title="Today · one focal card, one action">
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
              <PhoneFrame title="Exercise · prescription, then guidance" className="xl:mt-28">
                <StepHeader current={0} total={4} onBack={() => {}} backLabel="Back to Today" showCount={false} />
                <div className="-mt-2">
                  <p className="text-caption font-medium text-accent">Exercise 1 of 4</p>
                  <p className="mt-1 text-title font-semibold">{currentExercise.name}</p>
                </div>
                <Card className="p-5">
                  <Prescription />
                </Card>
                <div className="px-1">
                  <p className="text-section font-semibold">How should this feel?</p>
                  <div className="mt-3">
                    <SafetyGuide professionalName={professional.name} />
                  </div>
                </div>
              </PhoneFrame>
              <PhoneFrame title="Insight · what changed, and what it means" className="xl:mt-12">
                <div>
                  <p className="text-title font-semibold">Your recovery</p>
                  <p className="mt-1 text-[15px] text-ink-soft">Based on 3 check-ins since 3 October</p>
                </div>
                <Card tone="featured" className="p-5">
                  <p className="text-caption font-medium text-accent">How it’s going</p>
                  <AssessmentLine assessment={onTrack} returnTo="/" />
                </Card>
                <ul className="divide-y divide-line px-1">
                  {onTrack.changes.map((signal) => (
                    <SignalDetail key={signal.id} {...signal}>
                      <Evidence a={onTrack} id={signal.id} />
                    </SignalDetail>
                  ))}
                </ul>
              </PhoneFrame>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1240px] flex-col gap-2 px-6 py-12 text-[13px] text-ink-faint sm:flex-row sm:justify-between lg:px-12">
          <span>Rehab Companion · design system v2</span>
          <span>Tokens in src/styles/index.css · components in src/components</span>
        </footer>
      </main>
    </div>
  )
}
