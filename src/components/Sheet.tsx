import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  onClose: () => void
  children: ReactNode
}

// A calm bottom sheet. Positions against the app frame, so it covers the screen but not the
// desktop backdrop. Escape and the backdrop close it.
export function Sheet({ title, onClose, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

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
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[85%] overflow-y-auto rounded-t-[2rem] bg-surface px-6 pt-7 pb-[max(env(safe-area-inset-bottom),1.25rem)] outline-none"
      >
        <h2 id={titleId} className="text-[22px] leading-tight font-semibold tracking-[-0.015em] text-ink">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
