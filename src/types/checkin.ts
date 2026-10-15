import type { Movement } from './progress'

// What one post-session check-in records. The three signals are the ones Progress reads; the rest is
// optional and only there if the person chose to add it.
export type CheckIn = {
  pain: number
  difficulty: number
  movement?: Movement
  // "Anything you're unsure about?" — any number, including none.
  unsure: string[]
  note: string
}
