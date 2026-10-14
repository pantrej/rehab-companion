import type { ExercisePhoto } from '../components/ExerciseMedia'

export type Exercise = {
  name: string
  sets: number
  reps: number
  // What the person needs to hand, in their own home.
  equipment: string
  instruction: string
  // Two or three cues for doing it well. Form, not safety: nothing here is a medical claim.
  formTips: string[]
  // The demonstration of this exercise, and only this one.
  photo: ExercisePhoto
}
