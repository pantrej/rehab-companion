import { contactGuide } from '../data/support'
import { Button } from './Button'
import { Sheet } from './Sheet'

// Helps the user reach their own professional with useful context. It does not simulate a chat.
export function ContactSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title={contactGuide.title} onClose={onClose}>
      <p className="mt-2 text-base leading-relaxed text-ink-soft">{contactGuide.text}</p>
      <ul className="mt-4 flex flex-col gap-2 rounded-2xl bg-canvas p-4">
        {contactGuide.points.map((point) => (
          <li key={point} className="flex items-baseline gap-2.5 text-[15px] text-ink">
            <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-ink-faint" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">{contactGuide.urgentNote}</p>
      <Button className="mt-6" onClick={onClose}>
        Done
      </Button>
    </Sheet>
  )
}
