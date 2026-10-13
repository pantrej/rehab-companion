import type { SignalTone } from '../types/recovery'
import { toneSolid, toneStatusText } from '../utils/tone'

type Props = {
  label: string
  status: string
  tone: SignalTone
}

// A supporting signal: quiet label, status word carries the meaning, a small dot carries the tone.
export function StatusItem({ label, status, tone }: Props) {
  return (
    <li className="flex items-baseline justify-between gap-4 text-[15px]">
      <span className="text-ink-soft">{label}</span>
      <span className={`flex items-center gap-2 font-medium ${toneStatusText[tone]}`}>
        <span className={`size-2 rounded-full ${toneSolid[tone]}`} aria-hidden />
        {status}
      </span>
    </li>
  )
}
