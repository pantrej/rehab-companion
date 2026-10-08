import { Button } from './Button'
import { Sheet } from './Sheet'

// A calm pause during an exercise, not an alert: reassures, points to support, and lets the user return.
export function SupportSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="It’s okay to pause" onClose={onClose}>
      <p className="mt-2 text-base leading-relaxed text-ink-soft">
        You can stop this exercise at any time. If something feels different from usual, let your
        physiotherapist know — they can help you decide how to continue.
      </p>
      <div className="mt-6 flex flex-col gap-1">
        <Button to="/support" variant="secondary">
          Get support
        </Button>
        <Button variant="quiet" onClick={onClose}>
          Back to exercise
        </Button>
      </div>
    </Sheet>
  )
}
