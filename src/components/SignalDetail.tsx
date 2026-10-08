import type { SignalTone } from '../types/recovery'
import { toneText } from '../utils/tone'

type Props = {
  label: string
  status: string
  tone: SignalTone
  detail: string
}

// A signal with its evidence: the status word answers "how", the detail answers "why we think so".
export function SignalDetail({ label, status, tone, detail }: Props) {
  return (
    <li className="py-4">
      <div className="flex items-baseline justify-between gap-4 text-base font-medium">
        <span className="text-ink">{label}</span>
        <span className={toneText[tone]}>{status}</span>
      </div>
      <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{detail}</p>
    </li>
  )
}
