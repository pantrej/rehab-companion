import type { ReactNode } from 'react'
import type { SignalTone } from '../types/recovery'
import { toneSolid, toneStatusText } from '../utils/tone'

type Props = {
  label: string
  status: string
  tone: SignalTone
  detail: string
  // Optional visual evidence (a trend, a range) under the detail.
  children?: ReactNode
}

// A signal with its evidence: the status word answers "how", the detail answers "why we think so".
export function SignalDetail({ label, status, tone, detail, children }: Props) {
  return (
    <li className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body font-semibold text-ink">{label}</span>
        <span className={`flex items-center gap-2 text-body font-medium ${toneStatusText[tone]}`}>
          <span className={`size-2 rounded-full ${toneSolid[tone]}`} aria-hidden />
          {status}
        </span>
      </div>
      <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{detail}</p>
      {children && <div className="mt-4">{children}</div>}
    </li>
  )
}
