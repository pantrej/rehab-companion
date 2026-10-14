import { recentCheckIns } from '../data/progress'
import type { CheckIn } from '../types/checkin'
import type { CheckInRecord, Movement } from '../types/progress'
import { readStored, storageKeys } from './storage'

const movements: Movement[] = ['Better', 'About the same', 'Worse']

export type StoredCheckIn = CheckIn & { at?: string }

export function readLastCheckIn() {
  return readStored<StoredCheckIn | null>(storageKeys.lastCheckIn, null)
}

// The check-ins the app reads: the prototype's recent history, with this device's own check-in in front
// of it when the session was checked in today. One list behind the recovery reading, the trends, the
// summary and the calendar, so what a session recorded and what Progress says can never drift apart.
export function liveCheckIns(): CheckInRecord[] {
  const stored = readLastCheckIn()
  if (!stored?.at) return recentCheckIns
  // Only today's own check-in joins the list; an older one has already been said by the history.
  if (new Date(stored.at).toDateString() !== new Date().toDateString()) return recentCheckIns
  const movement = movements.find((m) => m === stored.movement)
  if (typeof stored.pain !== 'number' || typeof stored.difficulty !== 'number' || !movement) return recentCheckIns

  return [
    {
      daysAgo: 0,
      pain: stored.pain,
      difficulty: stored.difficulty,
      movement,
      note: stored.note?.trim() || undefined,
    },
    ...recentCheckIns,
  ]
}
