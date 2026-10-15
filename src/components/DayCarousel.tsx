import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useCarousel } from '../utils/carousel'
import type { CarouselControl } from '../utils/carousel'

type Props = {
  count: number
  initial: number
  label: string
  slideLabel: (index: number) => string
  onChange?: (index: number) => void
  // A control that belongs to the carousel but not to any slide, e.g. the pagination. It sits outside
  // the scrolling track, so it stays where it is while the days move past.
  indicator?: (active: number, goTo: (index: number) => void) => ReactNode
  // Lets a control outside the carousel drive it, through `useCarousel`.
  control?: CarouselControl
  children: (index: number, goTo: (index: number) => void) => ReactNode
}

// A horizontal, swipeable row of full-width slides that snap into place. The active slide follows the
// scroll position, so swipe, trackpad, keyboard focus and the pagination dots all stay in step.
export function DayCarousel({ count, initial, label, slideLabel, onChange, indicator, control, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(initial)

  // Open on the initial slide without animating.
  useLayoutEffect(() => {
    const el = ref.current
    if (el) el.scrollLeft = initial * el.clientWidth
  }, [initial])

  // The dots ask for a slide; the effect does the scrolling. The request carries a counter so asking for
  // the same slide twice still scrolls back to it.
  const own = useCarousel()
  const { target, goTo } = control ?? own
  useEffect(() => {
    const el = ref.current
    if (el && target) el.scrollTo({ left: target.index * el.clientWidth, behavior: 'smooth' })
  }, [target])

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    if (index !== active) {
      setActive(index)
      onChange?.(index)
    }
  }

  return (
    <div className="relative flex flex-col">
      <section
        ref={ref}
        aria-roledescription="carousel"
        aria-label={label}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={slideLabel(i)}
            aria-current={i === active ? 'true' : undefined}
            className="flex w-full shrink-0 snap-center snap-always flex-col"
          >
            {children(i, goTo)}
          </div>
        ))}
      </section>
      {indicator?.(active, goTo)}
    </div>
  )
}
