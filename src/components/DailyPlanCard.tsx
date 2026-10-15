import { ArrowRight, Check, Minus, Play, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { exercisesPerSession } from '../data/calendar'
import type { DayView } from '../data/days'
import { tomorrow } from '../data/plan'
import type { Professional } from '../types/care'
import { dayTheme } from '../utils/dayTheme'
import { Button } from './Button'
import { ProfessionalAvatar } from './ProfessionalAvatar'

type Props = {
  day: DayView
  professional?: Professional
  onViewSummary: () => void
  onLogRest: () => void
  // How the user said a rest day felt, once logged.
  restFeeling?: string
}

const softAction =
  'flex h-12 w-full items-center justify-center gap-2 rounded-full text-body font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// One day's plan. What it says and what it asks for follow the day's state: only today is actionable.
// A day carries at most one button; anything else a day offers rides quietly on its label.
export function DailyPlanCard({ day, professional, onViewSummary, onLogRest, restFeeling }: Props) {
  const theme = dayTheme[day.state]
  const past = day.offset < 0
  const aside =
    day.state === 'attention'
      ? { to: '/insight', state: { returnTo: '/' }, label: 'See what changed' }
      : day.state === 'completed' && day.doneToday
        ? { to: '/session', label: 'Repeat session' }
        : professional && (day.state === 'active' || day.state === 'upcoming')
          ? { to: '/plan-changes', label: day.state === 'upcoming' ? 'Preview plan' : 'View plan' }
          : undefined

  return (
    <div className="-mt-px flex flex-1 flex-col rounded-b-[32px] px-5 pt-3 pb-4" style={{ background: theme.tint }}>
      {/* The day's kind, and beside it the quiet way to look further, so no action needs a row of its own. */}
      <div className="flex items-baseline justify-between gap-3">
        <p className={`text-caption font-semibold ${theme.label}`}>{day.activity.label}</p>
        {aside && (
          <Link
            to={aside.to}
            state={aside.state}
            className="-my-2 -mr-1 inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full px-1 text-[13px] font-semibold text-accent"
          >
            {aside.label}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        )}
      </div>
      <h2 className="mt-1.5 text-[26px] leading-tight font-bold tracking-[-0.02em] text-ink">{day.activity.focus}</h2>
      <p className="mt-1 text-body text-ink-soft">{day.activity.meta}</p>

      {(day.state === 'active' || day.state === 'attention') && (
        <>
          {professional ? (
            <p className="mt-3 flex items-center gap-2 text-caption text-ink-soft">
              <ProfessionalAvatar professional={professional} size="sm" />
              Prepared by {professional.name}, {professional.credential}
            </p>
          ) : (
            <p className="mt-2 text-caption text-ink-faint">From your existing rehabilitation plan</p>
          )}
          <Actions>
            <Button to="/session" icon={<Play className="size-4 fill-current" aria-hidden />}>
              Start session
            </Button>
          </Actions>
        </>
      )}

      {day.state === 'completed' && (
        <>
          <Completion
            title={day.doneToday ? 'Today’s session is done' : day.outcome === 'partial' ? 'Session partly completed' : 'Session completed'}
            text={
              day.doneToday
                ? `Next session: tomorrow · ${tomorrow.focus}`
                : day.outcome === 'partial'
                  ? `${day.calendar?.exercisesDone} of ${exercisesPerSession} exercises done. Your check-in helps your plan stay right.`
                  : 'Great job! You completed your plan.'
            }
          />
          <Actions>
            {day.doneToday ? (
              <Link
                to="/insight"
                state={{ returnTo: '/' }}
                className={`${softAction} border-[1.5px] border-positive/35 bg-white/70 text-positive hover:bg-white`}
              >
                View today’s insight
              </Link>
            ) : (
              <button
                type="button"
                onClick={onViewSummary}
                className={`${softAction} border-[1.5px] border-positive/35 bg-white/70 text-positive hover:bg-white`}
              >
                View summary
              </button>
            )}
          </Actions>
        </>
      )}

      {day.state === 'missed' && (
        <>
          <Completion
            tone="neutral"
            title="No session recorded"
            text="Missing one session doesn’t undo your progress. Your plan carries on from today."
          />
          <Actions>
            <button
              type="button"
              onClick={onViewSummary}
              className={`${softAction} border-[1.5px] border-line bg-white/70 text-ink-soft hover:bg-white`}
            >
              View summary
            </button>
          </Actions>
        </>
      )}

      {/* A day the plan says nothing about, and a session still ahead, ask nothing: the calendar and the
          carousel already reach the rest of the plan. */}
      {day.state === 'open' && (
        <p className="mt-2 text-[15px] leading-snug text-ink-soft">
          {professional
            ? `${professional.name} plans one session a week. The days in between are yours.`
            : 'Your plan runs one session a week. The days in between are yours.'}
        </p>
      )}

      {day.state === 'upcoming' && professional && (
        <p className="mt-3 flex items-start gap-2 text-caption leading-snug text-ink-soft">
          <RefreshCw className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          Updated by {professional.name}: {tomorrow.changeInBrief}
        </p>
      )}

      {day.state === 'rest' && (
        <>
          <p className="mt-2 text-[15px] leading-snug text-ink-soft">
            Rest is part of your plan: it gives your body time to recover between sessions.
          </p>
          {day.offset <= 0 && (
            <Actions>
              {restFeeling ? (
                <p className="flex h-12 items-center justify-center gap-2 text-body font-medium text-rest">
                  <span className="size-2 rounded-full bg-rest" aria-hidden />
                  Logged: {restFeeling.toLowerCase()}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onLogRest}
                  className={`${softAction} border-[1.5px] border-rest/30 bg-white/75 text-rest hover:bg-white`}
                >
                  {past ? 'Log how you felt' : 'Log how you feel'}
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
            </Actions>
          )}
        </>
      )}
    </div>
  )
}

// The one action a day has sits at the bottom, so cards line up across days whatever their content.
function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-auto pt-4">{children}</div>
}

// The small mark says what happened: a tick for a session that ran, a plain dash for one that didn't.
function Completion({ title, text, tone = 'positive' }: { title: string; text: string; tone?: 'positive' | 'neutral' }) {
  return (
    <div className="mt-4 flex items-start gap-3">
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
          tone === 'positive' ? 'bg-positive text-white' : 'bg-line text-ink-soft'
        }`}
        aria-hidden
      >
        {tone === 'positive' ? <Check className="size-4" strokeWidth={2.75} /> : <Minus className="size-4" strokeWidth={2.75} />}
      </span>
      <div>
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <p className="text-[15px] leading-snug text-ink-soft">{text}</p>
      </div>
    </div>
  )
}
