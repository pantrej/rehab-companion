import type { CheckInStep } from '../types/checkin'

export const checkInTitle = 'How did today’s session feel?'

export const checkInSteps: CheckInStep[] = [
  { id: 'pain', question: 'Pain during session' },
  { id: 'difficulty', question: 'Exercise difficulty' },
  { id: 'movement', question: 'Movement compared with your previous session' },
  {
    id: 'unsure',
    question: 'Are you unsure about anything?',
    hint: 'Choose any that apply, or finish without.',
  },
]

export const painScale = { min: 0, max: 10, minLabel: 'No pain', maxLabel: 'Severe pain' }

export const difficultyOptions = ['Very easy', 'Easy', 'Okay', 'Hard', 'Very hard']

export const movementOptions = ['Better', 'About the same', 'Worse']

export const unsureOptions = [
  'Pain or symptoms',
  'Exercise technique',
  'My progress',
  'How active I should be',
  'Something else',
]

// Prototype only: the check-in is kept in this browser so later screens can read it.
export const checkInStorageKey = 'rehab.lastCheckIn'
