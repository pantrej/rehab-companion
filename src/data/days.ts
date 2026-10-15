// Photos from Pexels (free to use): Vitaly Gariev, Alex Urezkov, Karolapics, Katrin Bolovtsova, khezez.
// One file per day state; swap a file to replace its photo everywhere. What a photo shows has to match
// what the day is: resting is not the same as having nothing planned, and a day that needs a closer look
// is reflective, never distressed.
import activeImage from '../assets/home-active.webp'
import reflectiveImage from '../assets/home-completed.webp'
import ordinaryDayImage from '../assets/golden-hour-lake-view-hike.webp'
import restImage from '../assets/home-rest.webp'
import afterSessionImage from '../assets/serene-seated-yoga-stretch-at-home.webp'
import upcomingImage from '../assets/home-upcoming.webp'
import type { CheckInRecord } from '../types/progress'
import { TODAY, addDays, buildMonth, daysBetween } from './calendar'
import type { CalendarDay } from './calendar'
import { tomorrow } from './plan'
import { recentCheckIns } from './progress'
import { todayPlan } from './today'

// What a day on Home is about. The state drives the photo, the plan card, its action and its colour.
export type DayState = 'active' | 'completed' | 'missed' | 'upcoming' | 'rest' | 'attention' | 'open'

// How a past session day actually went, as recorded in the plan calendar.
export type DayOutcome = 'completed' | 'partial' | 'skipped'

export type DayView = {
  // Days from today: negative in the past, 0 today, positive ahead.
  offset: number
  date: Date
  calendar?: CalendarDay
  state: DayState
  outcome?: DayOutcome
  image: string
  // TIME — the hero. "Today", "Yesterday", "Tomorrow" for nearby days, the weekday further out…
  time: string
  // …always with the date under it, so no label has to carry two meanings.
  dateLabel: string
  // Today only: the greeting above the time.
  greeting?: string
  // ACTIVITY — what happens that day, read under the hero: what kind of day, its focus, its size.
  activity: { label: string; focus: string; meta: string }
  // Today only: the session is done and checked in on this device.
  doneToday: boolean
}

export const dayImages: Record<DayState, string> = {
  // The session itself: mobility work at home.
  active: activeImage,
  // After a session that ran: settled, awake, nothing triumphant.
  completed: afterSessionImage,
  // A session still ahead: what it takes, laid out ready.
  upcoming: upcomingImage,
  // Recovery the plan asked for: resting on purpose.
  rest: restImage,
  // A day that needs a closer look: calm and reflective, never distress.
  attention: reflectiveImage,
  // A session that never happened: the same things, left as they were.
  missed: upcomingImage,
  // A day the plan says nothing about: an ordinary day, outdoors and the person's own.
  open: ordinaryDayImage,
}

const weekday = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long' })
const shortDate = (d: Date) => `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })}`

// Five days at a time: enough to look back at the last session and ahead to the next one.
export const windowSize = 5

type Context = {
  firstName: string
  connected: boolean
  onTrack: boolean
  doneToday: boolean
  // The check-ins to attach to the days, so a check-in saved today shows on today's date.
  records?: CheckInRecord[]
}

const monthLength = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate()
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function buildDay(date: Date, month: CalendarDay[], { firstName, onTrack, doneToday }: Context): DayView {
  const offset = daysBetween(TODAY, date)
  const calendar = month.find((d) => d.date.getTime() === date.getTime())
  const status = calendar?.status
  const isToday = offset === 0
  const outcome: DayOutcome | undefined =
    offset < 0 && (status === 'completed' || status === 'partial' || status === 'skipped') ? status : undefined

  const state: DayState = isToday
    ? doneToday
      ? 'completed'
      : onTrack
        ? 'active'
        : 'attention'
    : status === 'rest'
      ? 'rest'
      : status === 'open'
        ? 'open'
        : offset > 0
          ? 'upcoming'
          : outcome === 'skipped'
            ? 'missed'
            : 'completed'

  // TIME: one label per day, never a mix of relative dates, weekdays and activities.
  const time = isToday ? 'Today' : offset === -1 ? 'Yesterday' : offset === 1 ? 'Tomorrow' : weekday(date)
  const greeting = isToday ? (firstName ? `Good morning, ${firstName}` : 'Good morning') : undefined

  // Tomorrow carries the professional's latest change; earlier days ran today's plan.
  const sessionDay = offset > 0 ? tomorrow : { ...todayPlan, focus: todayPlan.focus.join(' + ') }
  // On a day without a session, the useful thing to say is when the next one is.
  const next = month.find((d) => d.date > date && (d.status === 'upcoming' || d.status === 'today'))
  // ACTIVITY: what kind of day this is, then its focus. The state's colour carries the rest.
  const sessionLabel =
    state === 'missed'
      ? 'Missed session'
      : state === 'upcoming'
        ? 'Planned session'
        : state === 'completed'
          ? outcome === 'partial'
            ? 'Partly completed session'
            : 'Completed session'
          : 'Rehabilitation session'
  const activity =
    state === 'open'
      ? {
          label: 'No session planned',
          // An empty day's useful answer is when the next session is.
          focus: offset < 0 || !next ? 'Nothing was planned' : `Next session ${weekday(next.date)}`,
          meta:
            offset < 0 || !next
              ? 'Your plan runs one session a week.'
              : `${shortDate(next.date)} · ${sessionDay.focus}`,
        }
      : state === 'rest'
        ? {
            label: 'Recovery day',
            focus: 'Recovery & Check-in',
            meta: offset < 0 ? 'No exercises were planned.' : 'No exercises planned.',
          }
        : {
            label: sessionLabel,
            focus: sessionDay.focus,
            meta:
              state === 'missed'
                ? 'No exercises recorded'
                : offset < 0 && calendar?.exercisesDone !== undefined
                  ? `${calendar.exercisesDone} exercises · ${sessionDay.durationMinutes} min`
                  : `${sessionDay.exerciseCount} exercises · About ${sessionDay.durationMinutes} min`,
          }

  return {
    offset,
    date,
    calendar,
    state,
    outcome,
    image: dayImages[state],
    time,
    dateLabel: shortDate(date),
    greeting,
    activity,
    doneToday: isToday && doneToday,
  }
}

// The days the carousel holds: a five-day window around `center`, kept inside the prototype's month so
// every slide has real plan data. `index` is where `center` sits in that window.
export function buildDayWindow(context: Context & { center?: Date }): { days: DayView[]; index: number } {
  const { center = TODAY } = context
  const month = buildMonth(context.records ?? recentCheckIns, context.connected)
  const centerDay = clamp(center.getDate(), 1, monthLength)
  const start = clamp(centerDay - Math.floor(windowSize / 2), 1, monthLength - windowSize + 1)
  const first = new Date(TODAY.getFullYear(), TODAY.getMonth(), start)
  return {
    days: Array.from({ length: windowSize }, (_, i) => buildDay(addDays(first, i), month, context)),
    index: centerDay - start,
  }
}

// The same days, for the whole month: what the calendar navigates. Identical rules, so a date reads the
// same in the calendar and on Home.
export function buildDayMonth(context: Context): DayView[] {
  const month = buildMonth(context.records ?? recentCheckIns, context.connected)
  return month.map((day) => buildDay(day.date, month, context))
}

// Pain now against the week before, from the same check-ins the insight reads.
export function painChange(records: CheckInRecord[]) {
  const sorted = [...records].sort((a, b) => b.daysAgo - a.daysAgo)
  const first = sorted[0]
  const latest = sorted[sorted.length - 1]
  return { series: sorted.map((r) => r.pain), latest: latest.pain, change: latest.pain - first.pain }
}
