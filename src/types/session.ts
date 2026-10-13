import type { DemoClip } from '../components/ExerciseDemo'

export type Exercise = {
  name: string
  // Where this exercise sits in today's session, e.g. 1 of 4.
  position: number
  total: number
  sets: number
  reps: number
  equipment: string
  instruction: string
  // A recorded demonstration of this movement, when the clinic has one.
  demo?: DemoClip
  lastSession: {
    difficulty: number
    pain: number
    sets: number
    reps: number
  }
}
