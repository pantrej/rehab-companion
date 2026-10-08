import type { CheckIn } from '../types/checkin'
import { readStored, storageKeys } from '../utils/storage'
import { Card } from './Card'

// What the user wrote or flagged in their latest check-in, if anything. Never invented.
export function CheckInNotes() {
  const latest = readStored<(CheckIn & { at?: string }) | null>(storageKeys.lastCheckIn, null)
  const unsure = latest?.unsure ?? []
  const note = latest?.note?.trim()

  return (
    <Card className="p-6">
      {unsure.length === 0 && !note ? (
        <p className="text-[15px] leading-relaxed text-ink-soft">No notes or concerns added to recent check-ins.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {unsure.length > 0 && (
            <div>
              <p className="text-sm text-ink-soft">Unsure about</p>
              <p className="mt-0.5 text-base font-medium text-ink">{unsure.join(', ')}</p>
            </div>
          )}
          {note && (
            <div>
              <p className="text-sm text-ink-soft">Note from your latest check-in</p>
              <p className="mt-0.5 text-base text-ink">“{note}”</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
