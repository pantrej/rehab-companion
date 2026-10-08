import type { PlanChange } from '../types/plan'
import { professional } from './professional'

const by = `${professional.name}, ${professional.credential}`

export const planDetails = {
  focus: 'Mobility + Strength',
  exerciseCount: 4,
  durationMinutes: 25,
  daysPerWeek: 5,
  lastUpdated: '8 October',
}

// Connected care only. Newest first.
export const planChanges: PlanChange[] = [
  {
    date: '8 October',
    title: 'Plan updated',
    change: 'Resistance for seated calf raise reduced from medium to light.',
    reason: 'Recent pain increase during loading.',
    updatedBy: by,
    appliesFrom: '10 October',
  },
  {
    date: '3 October',
    title: 'Plan reviewed at your appointment',
    change: 'Sessions continue 5 days per week with a Mobility + Strength focus.',
    reason: 'Steady progress since your previous review.',
    updatedBy: by,
  },
]

export const latestChange = planChanges[0]

export const tomorrow = {
  focus: planDetails.focus,
  exerciseCount: planDetails.exerciseCount,
  durationMinutes: planDetails.durationMinutes,
  // Calm, attributed wording: the professional changed the plan after review; the app did not.
  updateNote: 'Resistance was reduced based on your recent check-ins and rehabilitation review.',
}
