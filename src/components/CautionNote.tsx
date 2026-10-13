import type { ReactNode } from 'react'

// A calm caution: amber tint, plain words, an optional action. Used where a reported signal is
// outside the person's usual range; never alarming, never a diagnosis.
export function CautionNote({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-card bg-attention-soft/70 p-4" role="note">
      <p className="text-[15px] leading-relaxed text-ink">{children}</p>
      {action}
    </div>
  )
}
