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
export function DailyPlanCard({ day, professional, onViewSummary, onLogRest, restFeeling }: Props) {
  const theme = dayTheme[day.state]
  const past = day.offset < 0

  return (
    <div className="-mt-px flex flex-1 flex-col rounded-b-[32px] px-5 pt-1 pb-6" style={{ background: theme.tint }}>
      <p className={`text-caption font-semibold ${theme.label}`}>{day.activity.label}</p>
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
            {day.state === 'attention' ? (
              <Button to="/insight" state={{ returnTo: '/' }} variant="text">
                See what changed
              </Button>
            ) : (
              professional && (
                <Button to="/plan-changes" variant="text">
                  View plan
                </Button>
              )
            )}
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
              <>
                <Link
                  to="/insight"
                  state={{ returnTo: '/' }}
                  className={`${softAction} border-[1.5px] border-positive/35 bg-white/70 text-positive hover:bg-white`}
                >
                  View today’s insight
                </Link>
                <Button to="/session" variant="quiet">
                  Repeat today’s session
                </Button>
              </>
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

      {day.state === 'upcoming' && (
        <>
          {professional && (
            <p className="mt-3 flex items-start gap-2 text-caption leading-snug text-ink-soft">
              <RefreshCw className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              Updated by {professional.name}: {tomorrow.changeInBrief}
            </p>
          )}
          <Actions>
            <Link
              to={professional ? '/plan-changes' : '/progress'}
              className={`${softAction} bg-accent-soft text-accent hover:bg-[#e0d7f8]`}
            >
              {professional ? 'Preview plan' : 'See your week'}
            </Link>
          </Actions>
        </>
      )}

      {day.state === 'rest' && (
        <>
          <p className="mt-2 text-[15px] leading-snug text-ink-soft">
            Rest is part of your plan: it gives your body time to recover between sessions.
          </p>
          <Actions>
            {day.offset > 0 ? (
              <Link to="/progress" className={`${softAction} border-[1.5px] border-rest/30 bg-white/75 text-rest hover:bg-white`}>
                See your week
              </Link>
            ) : restFeeling ? (
              <p className="flex h-12 items-center justify-center gap-2 text-body font-medium text-rest">
                <span className="size-2 rounded-full bg-rest" aria-hidden />
                Logged: {restFeeling.toLowerCase()}
              </p>
            ) : (
              <button type="button" onClick={onLogRest} className={`${softAction} border-[1.5px] border-rest/30 bg-white/75 text-rest hover:bg-white`}>
                {past ? 'Log how you felt' : 'Log how you feel'}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            )}
          </Actions>
        </>
      )}
    </div>
  )
}

// Actions sit at the bottom, so cards line up across days whatever their content.
function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-auto flex flex-col gap-1 pt-5">{children}</div>
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
