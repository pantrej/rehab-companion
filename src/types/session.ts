import type { DemoClip } from '../components/ExerciseDemo'
import type { MovementId } from '../components/MovementIllustration'

export type Exercise = {
  name: string
  sets: number
  reps: number
  // What the person needs to hand, in their own home.
  equipment: string
  instruction: string
  // Which movement is drawn for this exercise. Every exercise shows its own.
  movement: MovementId
  // A recorded demonstration of this movement, when the clinic has one. The drawing stands in until then.
  demo?: DemoClip
}
