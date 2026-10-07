import type { LucideIcon } from 'lucide-react'
import type { SignalTone } from '../types/recovery'

// Tone colours the icon and status, never a number: the status word carries the meaning.
const toneStyles: Record<SignalTone, { icon: string; status: string }> = {
  positive: { icon: 'bg-positive-soft text-positive', status: 'text-positive' },
  neutral: { icon: 'bg-canvas text-ink-soft', status: 'text-ink' },
  attention: { icon: 'bg-attention-soft text-attention', status: 'text-attention' },
}

type Props = {
  icon: LucideIcon
  label: string
  status: string
  tone: SignalTone
}

export function StatusItem({ icon: Icon, label, status, tone }: Props) {
  const styles = toneStyles[tone]

  return (
    <li className="flex items-center gap-3.5 py-3.5">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-ink-soft">{label}</span>
        <span className={`text-[17px] leading-snug font-medium ${styles.status}`}>{status}</span>
      </span>
    </li>
  )
}
