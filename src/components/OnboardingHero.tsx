import type { ReactNode } from 'react'

const heights = {
  lg: 'h-[clamp(200px,31dvh,262px)]',
  md: 'h-[clamp(180px,27dvh,228px)]',
  sm: 'h-[clamp(150px,21dvh,178px)]',
}

type Props = {
  // The step header (back, progress, count), laid over the top of the visual.
  header: ReactNode
  // A photo; without one, a soft branded gradient.
  image?: string
  imagePosition?: string
  // Starts the photo lower, fading its top edge into the canvas, for photos with little headroom.
  imageTop?: number
  size?: keyof typeof heights
  // Composed visuals over the image, e.g. a branded card or soft shapes.
  children?: ReactNode
  // Sits on the curve at the bottom left, e.g. a success mark.
  badge?: ReactNode
}

// The visual anchor of every onboarding step: an image or branded composition with the progress laid over
// it, easing into the canvas through a soft curve.
export function OnboardingHero({ header, image, imagePosition = '50% 40%', imageTop = 0, size = 'lg', children, badge }: Props) {
  return (
    <div className={`relative shrink-0 ${heights[size]}`}>
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {image ? (
          <img
            src={image}
            alt=""
            className={`absolute inset-x-0 bottom-0 w-full object-cover ${imageTop ? '[mask-image:linear-gradient(to_bottom,transparent,black_64px)]' : ''}`}
            style={{ objectPosition: imagePosition, height: `calc(100% - ${imageTop}px)` }}
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#f7f2ea] via-[#f1eafb] to-[#e2d7fa]">
            <span className="absolute -top-16 -left-10 size-56 rounded-full bg-white/70 blur-2xl" />
            <span className="absolute top-10 left-1/3 size-40 rounded-full bg-[#f6dccb]/40 blur-3xl" />
            <span className="absolute -right-10 -bottom-10 size-56 rounded-full bg-accent/15 blur-3xl" />
          </div>
        )}
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-canvas/85 to-canvas/0" aria-hidden />
      <div className="relative px-5 pt-[max(env(safe-area-inset-top),1.25rem)]">{header}</div>
      {/* The Rehab Companion wave: a translucent violet ribbon rises ahead of the canvas on the right, so the
          image settles into the page through an asymmetric, layered curve. */}
      <svg
        className="absolute inset-x-0 -bottom-px h-[72px] w-full"
        viewBox="0 0 390 72"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path className="fill-accent-soft/85" d="M0 52 C 90 70, 190 70, 268 46 C 318 31, 356 12, 390 2 L 390 72 L 0 72 Z" />
        <path className="fill-canvas" d="M0 40 C 92 72, 204 74, 292 52 C 334 41, 366 30, 390 24 L 390 72 L 0 72 Z" />
      </svg>
      {badge && <div className="absolute bottom-0 left-5 translate-y-1/4">{badge}</div>}
    </div>
  )
}

// A tilted, frosted card carrying the step's theme: the branded visual for steps without a photo.
export function ThemeCard({ icon, label, compact = false }: { icon: ReactNode; label: string; compact?: boolean }) {
  return (
    <div
      className={`absolute rounded-[28px] bg-[#f3effd]/90 shadow-[0_28px_48px_-24px_rgb(75_42_173/0.5)] ring-1 ring-white/80 ${
        compact ? 'top-[56px] right-6 w-[150px] -rotate-6 px-4 py-3.5' : 'top-[66px] -right-2 w-[210px] -rotate-12 p-6'
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-white/90 text-accent ${compact ? 'size-10' : 'size-14'}`}
      >
        {icon}
      </span>
      <p className={`leading-snug font-semibold text-accent ${compact ? 'mt-2 text-[15px]' : 'mt-3 text-[18px]'}`}>{label}</p>
      {!compact && <span className="mt-4 block h-1.5 w-12 rounded-full bg-accent/20" />}
    </div>
  )
}
