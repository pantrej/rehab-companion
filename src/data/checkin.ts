import type { Movement } from '../types/progress'

export const checkInTitle = 'How did it feel?'

// Why the check-in is worth a minute. Connected care names the review it feeds, without implying live monitoring.
export const checkInPurpose = {
  connected:
    'Your check-in helps you understand changes over time and gives your physiotherapist context for your next rehabilitation review.',
  independent: 'Your check-in helps you understand changes in your recovery over time.',
}

// The two rated signals, on the same 0–10 scale and the same control.
export const painScale = {
  id: 'pain',
  question: 'Pain during this session',
  min: 0,
  max: 10,
  minLabel: 'No pain',
  maxLabel: 'Worst pain',
}

export const difficultyScale = {
  id: 'difficulty',
  question: 'How difficult did this session feel?',
  min: 0,
  max: 10,
  minLabel: 'Easy',
  maxLabel: 'Very difficult',
}

// Movement is answered in words, not on a scale: the prototype has no meaningful number for it, and
// these are the same three answers Progress reads as mobility.
export const movementQuestion = 'How did movement feel today?'
export const movementOptions: { id: Movement; label: string }[] = [
  { id: 'Worse', label: 'Worse' },
  { id: 'About the same', label: 'About the same' },
  { id: 'Better', label: 'Better' },
]

export const unsureOptions = [
  'Pain or symptoms',
  'Exercise technique',
  'My progress',
  'How active I should be',
  'Something else',
]
