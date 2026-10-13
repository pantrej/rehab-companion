// Photos from Pexels (free to use): Vitaly Gariev, Alex Urezkov, Karolapics, Katrin Bolovtsova, khezez.
// One file per day state; swap a file to replace its photo everywhere.
import activeImage from '../assets/home-active.webp'
import attentionImage from '../assets/home-attention.webp'
import completedImage from '../assets/home-completed.webp'
import restImage from '../assets/home-rest.webp'
import upcomingImage from '../assets/home-upcoming.webp'
import type { CheckInRecord } from '../types/progress'
import { TODAY, addDays, buildMonth } from './calendar'
import type { CalendarDay } from './calendar'
import { tomorrow } from './plan'
import { recentCheckIns } from './progress'
import { todayPlan } from './today'

// What a day on Home is about. The state drives the photo, the plan card, its action and its colour.
export type DayState = 'active' | 'completed' | 'upcoming' | 'rest' | 'attention'

export type DayView = {
  offset: number
  date: Date
  calendar?: CalendarDay
  state: DayState
  image: string
  // Today has a greeting; other days say when they are.
  eyebrow: string
  title: string
  plan: { label: string; focus: string; meta: string }
  // Today only: the session is done and checked in on this device.
  doneToday: boolean
}

export const dayImages: Record<DayState, string> = {
  active: activeImage,
  completed: completedImage,
  upcoming: upcomingImage,
  rest: restImage,
  attention: attentionImage,
}

const weekday = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long' })
const shortDate = (d: Date) =>
  `${d.toLocaleDateString('en-GB', { weekday: 'short' })}, ${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })}`

// Two days either side of today: enough to look back at the last session and ahead to the next one.
export const dayOffsets = [-2, -1, 0, 1, 2]

export function buildDays({
  firstName,
  connected,
  onTrack,
  doneToday,
}: {
  firstName: string
  connected: boolean
  onTrack: boolean
  doneToday: boolean
}): DayView[] {
  const month = buildMonth(recentCheckIns, connected)
  return dayOffsets.map((offset) => {
    const date = addDays(TODAY, offset)
    const calendar = month.find((d) => d.date.getTime() === date.getTime())
    const status = calendar?.status
    const isToday = offset === 0

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
          : 'completed'

    const when = offset === -1 ? 'Yesterday' : offset === 1 ? 'Tomorrow' : weekday(date)
    const title = isToday ? firstName || 'Today' : Math.abs(offset) === 1 ? when : state === 'rest' ? 'Rest day' : when
    const eyebrow = isToday ? (firstName ? 'Good morning,' : 'Good morning') : shortDate(date)

    // Tomorrow carries the professional's latest change; earlier days ran today's plan.
    const sessionDay = offset > 0 ? tomorrow : { ...todayPlan, focus: todayPlan.focus.join(' + ') }
    const plan =
      state === 'rest'
        ? { label: 'Rest day', focus: 'Recovery & Check-in', meta: offset < 0 ? 'No exercises were planned.' : 'No exercises planned.' }
        : {
            label: isToday
              ? doneToday
                ? 'Today’s session'
                : 'Today’s plan'
              : offset > 0
                ? `${offset === 1 ? 'Tomorrow' : weekday(date)}’s plan`
                : `${offset === -1 ? 'Yesterday' : weekday(date)}’s session`,
            focus: sessionDay.focus,
            meta:
              offset < 0 && calendar?.exercisesDone !== undefined
                ? `${calendar.exercisesDone} exercises · ${sessionDay.durationMinutes} min`
                : `${sessionDay.exerciseCount} exercises · About ${sessionDay.durationMinutes} min`,
          }

    return { offset, date, calendar, state, image: dayImages[state], eyebrow, title, plan, doneToday: isToday && doneToday }
  })
}

// Pain now against the week before, from the same check-ins the insight reads.
export function painChange(records: CheckInRecord[]) {
  const sorted = [...records].sort((a, b) => b.daysAgo - a.daysAgo)
  const first = sorted[0]
  const latest = sorted[sorted.length - 1]
  return { series: sorted.map((r) => r.pain), latest: latest.pain, change: latest.pain - first.pain }
}
