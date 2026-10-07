import type { SignalTone } from '../types/recovery'
import { toneText } from '../utils/tone'

type Props = {
  label: string
  status: string
  tone: SignalTone
}

// A supporting signal: quiet label, status word carries the meaning.
export function StatusItem({ label, status, tone }: Props) {
  return (
    <li className="flex items-baseline justify-between gap-4 text-[15px]">
      <span className="text-ink-soft">{label}</span>
      <span className={`font-medium ${toneText[tone]}`}>{status}</span>
    </li>
  )
}
