import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { appFrameId } from '../layouts/MobileLayout'

// Far enough that a flick closes the sheet, short enough that a nudge doesn't.
const dismissAfter = 96

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
// rather than the screen, so one backdrop covers the content and the tab bar together. It rises from the
// bottom edge and leaves the same way, by the close button, the backdrop, Escape or a drag downwards.
export function ModalSheet({ title, onClose, closeLabel, heightClass = 'max-h-[78%]', children }: Props) {
  const close = closeLabel ?? `Close ${title}`
  const sheetRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  const [leaving, setLeaving] = useState(false)
  const dismiss = (then: () => void) => {
    if (leaving) return
    setLeaving(true)
    setDrag(sheetRef.current?.offsetHeight ?? 600)
    window.setTimeout(then, 220)
  }

  // Dragging the sheet down dismisses it; anything short of that springs back.
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const from = useRef<number | undefined>(undefined)
  const onPointerDown = (e: ReactPointerEvent) => {
    from.current = e.clientY
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (from.current !== undefined) setDrag(Math.max(0, e.clientY - from.current))
  }
  const endDrag = () => {
    if (from.current === undefined) return
    from.current = undefined
    setDragging(false)
    if (drag > dismissAfter) dismiss(onClose)
    else setDrag(0)
  }

  useEffect(() => {
    sheetRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(onClose)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // The handlers close over state that only ever moves one way: opened, then leaving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  return createPortal(
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      {/* The screen stays visible underneath, dimmed and softened; the tab bar dims with it. */}
      <button
        type="button"
        aria-label={close}
        onClick={() => dismiss(onClose)}
        className={`animate-fade-in absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px] transition-opacity duration-200 ${
          leaving ? 'opacity-0' : ''
        }`}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ transform: drag ? `translateY(${drag}px)` : undefined, transition: dragging ? 'none' : undefined }}
        className={`relative flex ${heightClass} flex-col rounded-t-[2rem] bg-surface pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-raised outline-none transition-transform duration-200 motion-reduce:transition-none ${
          leaving ? '' : 'animate-sheet-rise'
        }`}
      >
        {/* The handle and the title are the grab area: dragging either one pulls the sheet down. The close
            button sits outside it, so a tap on it is a tap, not the start of a drag. */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="shrink-0 touch-none pt-3"
        >
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
