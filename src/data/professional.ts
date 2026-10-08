import type { Professional } from '../types/care'

// Mock professional for the connected-care scenario. Fictional; shown with an initials avatar, never a photo.
export const professional: Professional = {
  name: 'Anna Novak',
  role: 'Physiotherapist',
  credential: 'PT',
  initials: 'AN',
  clinic: 'Rehabilitation Centre',
  nextAppointment: '20 October · 10:30',
  lastAppointment: '3 October',
  daysSinceLastAppointment: 5,
}

// What the professional has already supplied, so a connected user is never asked to recreate it.
export const connectedPlan = {
  context: 'Spinal injury recovery',
  plan: 'Mobility + Strength',
  intro:
    'Your rehabilitation professional has prepared your current plan. You can follow your exercises, track recovery changes and share your check-ins before your next review.',
}

export const careModeOptions = [
  {
    id: 'connected' as const,
    label: 'With a rehabilitation professional',
    description: 'My physiotherapist or rehabilitation team manages my plan.',
  },
  {
    id: 'independent' as const,
    label: 'Mostly on my own',
    description: 'I have an existing plan but no connected professional in the app.',
  },
]
