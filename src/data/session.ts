import type { Exercise } from '../types/session'

// Today's session, as the plan promises it on Home: four exercises, Mobility + Strength, about 25 minutes.
// They run seated first and standing after, which is how a home programme after a spinal injury is
// usually ordered: the easiest position to control comes first, and the leg is warm before it carries
// weight. Each one is its own movement, with its own drawing — none is a repeat of another.
//
// A recording goes on an exercise as `demo: { src, poster, credit }`: put the file in src/assets, import
// it, and add it here. Until there is one, the exercise shows its own drawing and says that is what it is.
export const sessionExercises: Exercise[] = [
  {
    name: 'Seated knee extension',
    sets: 3,
    reps: 10,
    equipment: 'Chair with back support',
    instruction:
      'Sit tall with both feet flat. Straighten one knee until your lower leg is level, hold for two seconds, then lower it slowly.',
    movement: 'knee-extension',
  },
  {
    name: 'Seated calf raise',
    sets: 3,
    reps: 12,
    equipment: 'Medium resistance band',
    instruction:
      'Keep your foot flat and slowly raise your heel while maintaining control throughout the movement.',
    movement: 'calf-raise',
  },
  {
    name: 'Supported squat',
    sets: 3,
    reps: 8,
    equipment: 'Chair for support',
    instruction:
      'Stand behind the chair with your hands resting on it. Bend your knees and lower your hips a little way, keeping your back long, then press back up.',
    movement: 'squat',
  },
  {
    name: 'Standing hip abduction',
    sets: 3,
    reps: 10,
    equipment: 'Chair for support',
    instruction:
      'Stand tall, holding the chair for balance. Lift one leg out to the side without leaning, then lower it with control.',
    movement: 'hip-abduction',
  },
]

export const exerciseCount = sessionExercises.length
