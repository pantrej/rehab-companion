import type { ExerciseFilm } from '../components/ExerciseVideo'
import type { MovementId } from '../components/MovementIllustration'

export type Exercise = {
  name: string
  sets: number
  reps: number
  // What the person needs to hand, in their own home.
  equipment: string
  instruction: string
  // Two or three cues for doing it well. Form, not safety: nothing here is a medical claim.
  formTips: string[]
  // Which movement is drawn if the demonstration can't play.
  movement: MovementId
  // The demonstration of this exercise, and only this one.
  film: ExerciseFilm
}
