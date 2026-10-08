import type { Exercise } from '../types/session'

export const currentExercise: Exercise = {
  name: 'Seated calf raise',
  position: 1,
  total: 4,
  sets: 3,
  reps: 12,
  equipment: 'Medium resistance band',
  instruction:
    'Keep your foot flat and slowly raise your heel while maintaining control throughout the movement.',
  lastSession: { difficulty: 6, pain: 2, sets: 3, reps: 12 },
}
