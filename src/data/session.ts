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
  // A recording of this movement goes here: put the file in src/assets, import it, and set
  //   demo: { src: clip, poster: still, credit: 'Footage: …' }
  // The clip should be a few seconds of the movement, muted and loopable. Until there is one, the
  // exercise screen draws the movement instead of implying a recording it doesn't have.
  demo: undefined,
  lastSession: { difficulty: 6, pain: 2, sets: 3, reps: 12 },
}
