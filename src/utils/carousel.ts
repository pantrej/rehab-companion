import { useCallback, useMemo, useState } from 'react'

// A handle on a carousel for a control that sits outside it, e.g. the session's primary action, which has
// to be able to move the track without being inside it. The request carries a counter, so asking for the
// slide already in view still scrolls back to it.
export type CarouselControl = {
  target?: { index: number; n: number }
  goTo: (index: number) => void
}

export function useCarousel(): CarouselControl {
  const [target, setTarget] = useState<{ index: number; n: number }>()
  const goTo = useCallback((index: number) => setTarget((t) => ({ index, n: (t?.n ?? 0) + 1 })), [])
  return useMemo(() => ({ target, goTo }), [target, goTo])
}
