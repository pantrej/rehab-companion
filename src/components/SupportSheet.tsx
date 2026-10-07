import { useEffect, useRef } from 'react'
import { Button } from './Button'

type Props = {
  onClose: () => void
}

// A calm pause, not an alert: reassures, points to professional support, and lets the user return.
// Positions against the app frame, so it covers the screen but not the desktop backdrop.
export function SupportSheet({ onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sheetRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end">
      <div className="absolute inset-0 bg-ink/25" onClick={onClose} aria-hidden />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        tabIndex={-1}
        className="relative rounded-t-[2rem] bg-surface px-6 pt-7 pb-[max(env(safe-area-inset-bottom),1.25rem)] outline-none"
      >
        <h2 id="support-title" className="text-[22px] leading-tight font-semibold tracking-[-0.015em] text-ink">
          It’s okay to pause
        </h2>
        <p className="mt-2 text-base leading-relaxed text-ink-soft">
          You can stop this exercise at any time. If something feels different from usual, let your
          physiotherapist know — they can help you decide how to continue.
        </p>
        <div className="mt-6 flex flex-col gap-1">
          <Button to="/support" variant="secondary">
            Get support
          </Button>
          <Button variant="quiet" onClick={onClose}>
            Back to exercise
          </Button>
        </div>
      </div>
    </div>
  )
}
