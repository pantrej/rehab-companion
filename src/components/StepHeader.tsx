import { BackButton } from './BackButton'

type Props = {
  // Zero-based. Equal to total once the flow is complete: all segments fill and the count hides.
  current: number
  total: number
  // Omit on the first step; the space is kept so the progress bar doesn't shift.
  onBack?: () => void
  backLabel?: string
}

// Top row of a stepped flow: back, a segmented progress bar, and "n of total".
export function StepHeader({ current, total, onBack, backLabel = 'Previous question' }: Props) {
  return (
    <div className="flex items-center gap-3">
      {onBack ? <BackButton label={backLabel} onClick={onBack} /> : <span className="-ml-2.5 size-11 shrink-0" aria-hidden />}

      <div className="flex flex-1 gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= current ? 'bg-accent' : 'bg-line'}`}
          />
        ))}
      </div>

      <p className="w-11 shrink-0 text-right text-[13px] text-ink-faint">
        {current < total ? `${current + 1} of ${total}` : ''}
      </p>
    </div>
  )
}
