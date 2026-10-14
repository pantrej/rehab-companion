import { contactGuide } from '../data/support'
import type { Professional } from '../types/care'
import { Button } from './Button'
import { Sheet } from './Sheet'

// Connected care only: helps the user reach their own professional with useful context.
// It does not simulate a chat or promise an immediate reply.
export function ContactSheet({ professional, onClose }: { professional: Professional; onClose: () => void }) {
  return (
    <Sheet title={`Contact ${professional.name}`} onClose={onClose}>
      {/* The question this answers is "can I reach them before my next appointment?" — so it says yes,
          by what route, and what to expect, before it says what to mention. */}
      <p className="mt-2 text-base leading-relaxed text-ink">
        You don’t have to wait for your appointment on {professional.nextAppointment}. Between sessions you
        can reach {professional.name} through {professional.clinic}, the way you normally contact them.
      </p>
      <p className="mt-2 text-base leading-relaxed text-ink-soft">
        Replies may not be immediate. {contactGuide.text}
      </p>
      <ul className="mt-4 flex flex-col gap-2 rounded-card bg-subtle p-4">
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
