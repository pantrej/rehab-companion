import { useCallback, useState } from 'react'
import { exerciseCount } from '../data/session'
import { readStored, storageKeys, writeStored } from './storage'

// One record of how far today's session has got, kept in this browser. Every part of the session flow
// reads it, so the carousel, the progress marks, the primary action and the check-in can never disagree
// about what has been done.
export type SessionProgress = {
  // The day the session was started, so yesterday's half-finished session never reopens as today's.
  day: string
  // Indexes of the exercises completed, in the order they were completed.
  completed: number[]
}

const today = () => new Date().toDateString()

const empty = (): SessionProgress => ({ day: today(), completed: [] })

export function readSession(): SessionProgress {
  const stored = readStored<SessionProgress | null>(storageKeys.session, null)
  if (!stored || stored.day !== today()) return empty()
  // A stored index that no longer exists (the plan changed) is dropped rather than trusted.
  return { day: stored.day, completed: (stored.completed ?? []).filter((i) => i >= 0 && i < exerciseCount) }
}

export function writeSession(progress: SessionProgress) {
  writeStored(storageKeys.session, progress)
}

// After the check-in, today's session is finished with: the next visit starts a new one.
export function clearSession() {
  writeStored(storageKeys.session, null)
}

// Where the session should open: the first exercise still to do, or the last one once they are all done.
export function firstIncomplete(completed: number[]) {
  const next = Array.from({ length: exerciseCount }, (_, i) => i).find((i) => !completed.includes(i))
  return next ?? exerciseCount - 1
}

export function useSessionProgress() {
  const [progress, setProgress] = useState(readSession)

  const complete = useCallback((index: number) => {
    setProgress((current) => {
      if (current.completed.includes(index)) return current
      const next = { ...current, completed: [...current.completed, index] }
      writeSession(next)
      return next
    })
  }, [])

  const { completed } = progress
  return {
    completed,
    complete,
    isComplete: useCallback((index: number) => completed.includes(index), [completed]),
    // The session's exercises are done only when every one of them has been completed: nothing is skipped
    // on the way, and swiping past an exercise never counts as doing it.
    allComplete: completed.length === exerciseCount,
    remaining: exerciseCount - completed.length,
  }
}
