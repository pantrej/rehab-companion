import { TODAY, addDays, buildMonth, daysBetween } from './calendar'
import { planDetails } from './plan'
import { recentCheckIns } from './progress'

// How a past session went, for the activity list on Progress.
export type SessionOutcome = 'Completed' | 'Partly completed' | 'Missed'

export type SessionRecord = {
  date: Date
  focus: string
  outcome: SessionOutcome
  exercisesDone?: number
}

const outcomes: Record<string, SessionOutcome> = {
  completed: 'Completed',
  partial: 'Partly completed',
  skipped: 'Missed',
}

// This month's sessions come from the plan calendar, so the activity list and the calendar can never
// disagree. The weeks before it are the prototype's earlier history, at the same one-a-week rhythm.
const earlier: SessionRecord[] = [
  { date: addDays(TODAY, -14), focus: planDetails.focus, outcome: 'Completed', exercisesDone: 4 },
  { date: addDays(TODAY, -21), focus: planDetails.focus, outcome: 'Partly completed', exercisesDone: 3 },
  { date: addDays(TODAY, -28), focus: planDetails.focus, outcome: 'Completed', exercisesDone: 4 },
]

export const sessionHistory: SessionRecord[] = [
  ...buildMonth(recentCheckIns, false)
    .filter((day) => daysBetween(day.date, TODAY) > 0 && day.status in outcomes)
    .map((day) => ({
      date: day.date,
      focus: planDetails.focus,
      outcome: outcomes[day.status],
      exercisesDone: day.exercisesDone,
    })),
  ...earlier,
].sort((a, b) => b.date.getTime() - a.date.getTime())
