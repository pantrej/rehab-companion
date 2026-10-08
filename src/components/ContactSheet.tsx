import { contactGuide } from '../data/support'
import type { Professional } from '../types/care'
import { Button } from './Button'
import { Sheet } from './Sheet'

// Connected care only: helps the user reach their own professional with useful context.
// It does not simulate a chat or promise an immediate reply.
export function ContactSheet({ professional, onClose }: { professional: Professional; onClose: () => void }) {
  return (
    <Sheet title={`Contact ${professional.name}`} onClose={onClose}>
      <p className="mt-2 text-base leading-relaxed text-ink-soft">
        Use the usual contact details for {professional.clinic}. Replies may not be immediate. {contactGuide.text}
      </p>
      <ul className="mt-4 flex flex-col gap-2 rounded-2xl bg-canvas p-4">
        {contactGuide.points.map((point) => (
          <li key={point} className="flex items-baseline gap-2.5 text-[15px] text-ink">
            <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-ink-faint" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">{contactGuide.urgentNote}</p>
      <div className="mt-6 flex flex-col gap-1">
        <Button onClick={onClose}>Done</Button>
        <Button to="/appointment" variant="quiet">
          Prepare for appointment
        </Button>
      </div>
    </Sheet>
  )
}
