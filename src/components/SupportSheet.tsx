import { Button } from './Button'
import { SafetyGuide } from './SafetyGuide'
import { Sheet } from './Sheet'

type Props = {
  // The connected professional, if any; never invented.
  professionalName?: string
  onClose: () => void
  // Connected care only: open the contact guidance for the professional.
  onContact?: () => void
}

// A calm pause during an exercise: what to do now (continue, ease off, stop), and who to ask.
export function SupportSheet({ professionalName, onClose, onContact }: Props) {
  return (
    <Sheet title="It’s okay to pause" onClose={onClose}>
      <p className="mt-2 text-base leading-relaxed text-ink-soft">Use this to decide what to do next.</p>
      <div className="mt-5">
        <SafetyGuide professionalName={professionalName} />
      </div>
      <div className="mt-6 flex flex-col gap-1">
        {onContact && professionalName && (
          <Button variant="secondary" onClick={onContact}>
            Contact {professionalName}
          </Button>
        )}
        <Button to="/support/pain" variant={onContact ? 'quiet' : 'secondary'}>
          More guidance on pain and symptoms
        </Button>
        <Button variant="quiet" onClick={onClose}>
          Back to exercise
        </Button>
      </div>
    </Sheet>
  )
}
