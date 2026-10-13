import type { CheckInRecord } from '../types/progress'

// The prototype runs on a fixed "today" so dates, check-ins and plan updates always agree.
export const TODAY = new Date(2026, 9, 9) // Friday 9 October 2026

export const DAY_MS = 24 * 60 * 60 * 1000

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

export const formatDay = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

export const formatShortDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

// 'open' is a day the plan says nothing about: not a session, not a prescribed recovery day.
export type DayStatus = 'completed' | 'partial' | 'skipped' | 'rest' | 'today' | 'upcoming' | 'open'

export type CalendarDay = {
  date: Date
  status: DayStatus
  exercisesDone?: number
  checkIn?: CheckInRecord
  // Connected care only: an appointment with the professional on this day.
  appointment?: boolean
  therapistNote?: string
}

export const exercisesPerSession = 4

// Past October days, as the user's rehabilitation actually went: the week's session, and the recovery
// day after it. Days the plan said nothing about are left out, so they stay open. Check-ins attach by date.
const past: Record<number, Pick<CalendarDay, 'status' | 'exercisesDone'> & { therapistNote?: string }> = {
  2: {
    status: 'completed',
    exercisesDone: 4,
    therapistNote: 'Thanks for noting the calf tightness. I’ve reduced the resistance from your next session.',
  },
  8: { status: 'rest' },
}

// A home programme between appointments: one planned session a week, on the same weekday as today so
// the prototype always opens on a session day, plus the occasional recovery and check-in day the
// professional asks for. Every other day is the patient's own, and the plan says nothing about it.
const isPlannedSession = (date: Date) => date.getDay() === TODAY.getDay()
const checkInDays = [11, 20, 28]

const appointmentDays = [3, 20]

export function buildMonth(checkIns: CheckInRecord[], connected: boolean): CalendarDay[] {
  const first = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
  const length = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate()

  return Array.from({ length }, (_, i) => {
    const date = addDays(first, i)
    const day = date.getDate()
    const offset = daysBetween(date, TODAY)
    const record = past[day]
    const status: DayStatus =
      offset > 0
        ? (record?.status ?? 'open')
        : offset === 0
          ? 'today'
          : isPlannedSession(date)
            ? 'upcoming'
            : checkInDays.includes(day)
              ? 'rest'
              : 'open'
    return {
      date,
      status,
      exercisesDone: offset > 0 ? record?.exercisesDone : undefined,
      checkIn: checkIns.find((c) => c.daysAgo === offset),
      appointment: connected && appointmentDays.includes(day),
      // A professional's note exists only in connected care.
      therapistNote: connected ? record?.therapistNote : undefined,
    }
  })
}
