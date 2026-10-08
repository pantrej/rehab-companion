import { useState } from 'react'
import { Button } from './Button'
import { Sheet } from './Sheet'

type Props = {
  preferredName?: string
  professionalName: string
  onSave: (preferredName: string) => void
  onClose: () => void
}

// Connected care: the user owns only their personal details; recovery details come from the professional's plan.
export function PersonalDetailsSheet({ preferredName = '', professionalName, onSave, onClose }: Props) {
  const [name, setName] = useState(preferredName)

  return (
    <Sheet title="Personal details" onClose={onClose}>
      <label htmlFor="preferred-name" className="mt-5 block text-sm text-ink-soft">
        Preferred name <span className="text-ink-faint">(optional)</span>
      </label>
      <input
        id="preferred-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="given-name"
        className="mt-2 h-14 w-full rounded-2xl border border-line bg-surface px-4 text-[17px] text-ink focus:border-accent focus:outline-none"
      />
      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        Your recovery context and plan come from {professionalName}. If something looks wrong, mention it at your
        next appointment.
      </p>
      <div className="mt-6 flex flex-col gap-1">
        <Button
          onClick={() => {
            onSave(name.trim())
            onClose()
          }}
        >
          Save
        </Button>
        <Button variant="quiet" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Sheet>
  )
}
