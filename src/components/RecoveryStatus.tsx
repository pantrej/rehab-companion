import { ChevronDown } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { Assessment } from '../data/assessment'
import type { DayView } from '../data/days'
import { painChange } from '../data/days'
import { recentCheckIns } from '../data/progress'
import type { CheckInRecord } from '../types/progress'
import { MiniTrend } from './MiniTrend'

type Tone = 'positive' | 'rest' | 'concern'

const dot: Record<Tone, string> = {
  positive: 'bg-positive ring-positive-soft',
  rest: 'bg-rest ring-rest-soft',
  concern: 'bg-concern ring-concern-soft',
}

export function StatusIndicator({ tone }: { tone: Tone }) {
  return <span className={`size-3 shrink-0 rounded-full ring-4 ${dot[tone]}`} aria-hidden />
}

type Props = {
  assessment: Assessment
  day: DayView
  // The check-ins behind the reading, for the small pain trend.
  records: CheckInRecord[]
}

// The recovery reading, small by default: a word and one line. Tapping opens the why, briefly.
// The verdict is the same on every day; the line under it speaks to the day in view.
export function RecoveryStatus({ assessment, day, records }: Props) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const ref = useRef<HTMLElement>(null)

  // Opening the reading scrolls it clear of the tab bar, so the answer is never behind the navigation.
  const toggle = () => {
    const next = !open
    setOpen(next)
    if (!next) return
    requestAnimationFrame(() => {
      const section = ref.current
      const scroller = section?.closest('main')
      if (!section || !scroller) return
      const bar = document.querySelector('nav[aria-label="Main"]')
      const limit = (bar?.getBoundingClientRect().top ?? scroller.getBoundingClientRect().bottom) - 12
      const below = section.getBoundingClientRect().bottom - limit
      if (below > 0) scroller.scrollBy({ top: below, behavior: 'smooth' })
    })
  }
  const tone: Tone = !assessment.onTrack ? 'concern' : day.state === 'rest' ? 'rest' : 'positive'
  const pain = painChange(records)

  return (
    <section ref={ref} aria-label="Recovery status" className="rounded-card bg-surface shadow-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className="block w-full rounded-card px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="block text-caption font-semibold text-ink-soft">Recovery status</span>
        {/* The chevron rides the verdict's own row, so the line below it has the card's full width and
            says what the day is for in one line. */}
        <span className="mt-2 flex items-center gap-3">
          <StatusIndicator tone={tone} />
          <span className={`min-w-0 flex-1 text-[17px] font-semibold ${tone === 'concern' ? 'text-concern' : 'text-ink'}`}>
            {assessment.onTrack ? 'On track' : 'Not on track'}
          </span>
          <ChevronDown
            className={`size-5 shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
        <span className="mt-1 block text-[15px] leading-snug text-ink-soft">{dayLine(assessment, day)}</span>
      </button>

      {open && (
        <div id={panelId} className="border-t border-line px-5 pt-4 pb-3">
          <p className="text-[15px] leading-relaxed text-ink">{assessment.headline}</p>
          <div className="mt-4 flex items-center gap-5">
            <MiniTrend
              values={pain.series}
              label="Pain at each check-in"
              showRange={false}
              tone={tone === 'concern' ? 'concern' : 'positive'}
            />
            <div>
              <p className="text-[15px] font-semibold text-ink tabular-nums">Pain {pain.latest}/10</p>
              <p className="text-caption text-ink-soft tabular-nums">
                {pain.change === 0
                  ? 'No change from last week'
                  : `${pain.change < 0 ? '↓' : '↑'} ${Math.abs(pain.change)} from last week`}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5">
            <Link
              to="/insight"
              state={{ returnTo: '/' }}
              className="inline-flex min-h-11 items-center text-[15px] font-semibold text-accent"
            >
              See what this means
            </Link>
            <Link to="/progress" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-accent">
              See full progress
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

// One plain line per day, without diagnosing anything. Each is kept short enough to sit on a single
// line across the card at phone widths, so the reading stays one word and one line.
function dayLine(assessment: Assessment, day: DayView) {
  if (!assessment.onTrack) return 'Pain is higher than usual.'
  if (day.state === 'rest') return 'Recovery day. Focus on rest and mobility.'
  if (day.state === 'missed') return 'No session was recorded that day.'
  if (day.state === 'open') return 'No session planned for this day.'
  if (day.state === 'upcoming') return 'Keep up the good progress.'
  if (day.state === 'completed' && day.offset < 0) {
    const checkIn = day.calendar?.checkIn
    const before = checkIn && recentCheckIns.find((c) => c.daysAgo > checkIn.daysAgo)
    if (checkIn && before) {
      return checkIn.pain < before.pain
        ? 'Less pain than the session before.'
        : checkIn.pain > before.pain
          ? 'Slightly more pain than before.'
          : `Pain held steady at ${checkIn.pain}/10.`
    }
  }
  return 'Pain is holding steady.'
}
