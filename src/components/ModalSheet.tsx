import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { appFrameId } from '../layouts/MobileLayout'

// Long enough to be seen, short enough to stay out of the way. The sheet is unmounted only once it has
// finished leaving, so the same value paces both.
const travel = 300

type Props = {
  title: string
  onClose: () => void
  // What the close control is called, for anyone who can't see the sheet. Defaults to the title.
  closeLabel?: string
  // How tall the sheet stands. Content-sized by default, always capped so the screen stays visible behind it.
  heightClass?: string
  // `dismiss` runs the leaving animation and only then does what follows, e.g. applying a choice.
  children: (dismiss: (then: () => void) => void) => ReactNode
}

// A modal bottom sheet over the screen, which stays visible behind it. It portals into the phone frame
// rather than the screen, so one backdrop covers the content and the tab bar together.
//
// The motion is deliberately plain: the sheet is painted once below the bottom edge, then a single
// transform transition carries it up, and the reverse carries it back down before anything unmounts.
// Nothing else animates — no height, no radius, no per-element transitions to compete with it.
export function ModalSheet({ title, onClose, closeLabel, heightClass = 'max-h-[78%]', children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const close = closeLabel ?? `Close ${title}`

  const [arrived, setArrived] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const closing = useRef(false)
  const open = arrived && !leaving

  const dismiss = (then: () => void) => {
    if (closing.current) return
    closing.current = true
    setLeaving(true)
    window.setTimeout(then, travel)
  }

  useEffect(() => {
    sheetRef.current?.focus()
    // One painted frame at the bottom edge, then the transition has something to move from.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setArrived(true)))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(onClose)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // `dismiss` guards itself against running twice, so it never needs to re-bind.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  return createPortal(
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      {/* The screen stays visible underneath, dimmed and softened; the tab bar dims with it. */}
      <button
        type="button"
        aria-label={close}
        onClick={() => dismiss(onClose)}
        className={`absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ transform: open ? 'translateY(0)' : 'translateY(100%)' }}
        className={`relative flex ${heightClass} flex-col rounded-t-[2rem] bg-surface pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-raised outline-none transition-transform duration-300 ease-out motion-reduce:transition-none`}
      >
        <div className="shrink-0 pt-3">
          <span className="mx-auto block h-1 w-9 rounded-full bg-line" aria-hidden />
          <h2
            id={titleId}
            className="flex min-h-11 items-center pt-2 pr-16 pl-6 text-[20px] leading-tight font-semibold tracking-[-0.015em] text-ink"
          >
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => dismiss(onClose)}
          aria-label={close}
          className="absolute top-5 right-3 flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>

        {children(dismiss)}
      </div>
    </div>,
    document.getElementById(appFrameId) ?? document.body,
  )
}
