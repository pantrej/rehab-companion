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

export type DayStatus = 'completed' | 'partial' | 'skipped' | 'rest' | 'today' | 'upcoming'

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

// Past October days, as the user's rehabilitation actually went. Check-ins attach by date.
const past: Record<number, Pick<CalendarDay, 'status' | 'exercisesDone'> & { therapistNote?: string }> = {
  1: { status: 'completed', exercisesDone: 4 },
  2: { status: 'completed', exercisesDone: 4 },
  3: { status: 'rest' },
  4: { status: 'completed', exercisesDone: 4 },
  5: { status: 'skipped', exercisesDone: 0 },
  6: {
    status: 'partial',
    exercisesDone: 3,
    therapistNote: 'Thanks for noting the calf tightness. I’ve reduced the resistance from 10 October.',
  },
  7: { status: 'completed', exercisesDone: 4 },
  8: { status: 'rest' },
}

// Rest days in the 5-days-a-week plan.
const isPlannedRest = (date: Date) => date.getDay() === 4 || date.getDay() === 0 // Thursday, Sunday

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
      offset > 0 ? (record?.status ?? 'completed') : offset === 0 ? 'today' : isPlannedRest(date) ? 'rest' : 'upcoming'
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
