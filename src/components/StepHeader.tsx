import { BackButton } from './BackButton'

type Props = {
  // Zero-based. Equal to total once the flow is complete: all segments fill and the count hides.
  current: number
  total: number
  // Omit on the first step; the space is kept so the progress bar doesn't shift.
  onBack?: () => void
  backLabel?: string
  // Hide "n of total" when the screen already says it (e.g. "Exercise 1 of 4").
  showCount?: boolean
}

// Top row of a stepped flow: back, a segmented progress bar, and "n of total".
export function StepHeader({ current, total, onBack, backLabel = 'Previous question', showCount = true }: Props) {
  return (
    <div className="flex items-center gap-3">
      {onBack ? <BackButton label={backLabel} onClick={onBack} /> : <span className="-ml-2.5 size-11 shrink-0" aria-hidden />}

      <div className="flex flex-1 gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-[5px] flex-1 rounded-full transition-colors ${
              i < current ? 'bg-accent' : i === current ? 'bg-linear-to-r from-accent to-[#a08af0]' : 'bg-ink/10'
            }`}
          />
        ))}
      </div>

      {showCount ? (
        <p className="w-11 shrink-0 text-right text-caption font-medium text-ink-soft tabular-nums">
          {current < total ? `${current + 1} of ${total}` : ''}
        </p>
      ) : (
        <span className="w-2 shrink-0" aria-hidden />
      )}
    </div>
  )
}
