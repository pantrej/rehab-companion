// Photos from Pexels (free to use): Vitaly Gariev, Alex Urezkov, Karolapics, Katrin Bolovtsova, khezez.
// One file per day state; swap a file to replace its photo everywhere.
import activeImage from '../assets/home-active.webp'
import attentionImage from '../assets/home-attention.webp'
import completedImage from '../assets/home-completed.webp'
import restImage from '../assets/home-rest.webp'
import upcomingImage from '../assets/home-upcoming.webp'
import type { CheckInRecord } from '../types/progress'
import { TODAY, addDays, buildMonth, daysBetween } from './calendar'
import type { CalendarDay } from './calendar'
import { tomorrow } from './plan'
import { recentCheckIns } from './progress'
import { todayPlan } from './today'

// What a day on Home is about. The state drives the photo, the plan card, its action and its colour.
export type DayState = 'active' | 'completed' | 'missed' | 'upcoming' | 'rest' | 'attention'

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
  active: activeImage,
  completed: completedImage,
  upcoming: upcomingImage,
  rest: restImage,
  attention: attentionImage,
  // A day whose session never happened: the same warm neutral scene as an unworked day ahead.
  missed: upcomingImage,
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
  // ACTIVITY: what kind of day this is, then its focus. The state's colour carries the rest.
  const activity =
    state === 'rest'
      ? {
          label: 'Recovery day',
          focus: 'Recovery & Check-in',
          meta: offset < 0 ? 'No exercises were planned.' : 'No exercises planned.',
        }
      : {
          label:
            state === 'missed'
              ? 'Missed session'
              : state === 'completed'
                ? outcome === 'partial'
                  ? 'Partly completed session'
                  : 'Completed session'
                : state === 'upcoming'
                  ? 'Planned session'
                  : 'Rehabilitation session',
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
  const month = buildMonth(recentCheckIns, context.connected)
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
  const month = buildMonth(recentCheckIns, context.connected)
  return month.map((day) => buildDay(day.date, month, context))
}

// Pain now against the week before, from the same check-ins the insight reads.
export function painChange(records: CheckInRecord[]) {
  const sorted = [...records].sort((a, b) => b.daysAgo - a.daysAgo)
  const first = sorted[0]
  const latest = sorted[sorted.length - 1]
  return { series: sorted.map((r) => r.pain), latest: latest.pain, change: latest.pain - first.pain }
}
