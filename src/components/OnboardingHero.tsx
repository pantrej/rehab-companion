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
  size?: keyof typeof heights
  // Composed visuals over the image, e.g. a branded card or soft shapes.
  children?: ReactNode
  // Sits on the curve at the bottom left, e.g. a success mark.
  badge?: ReactNode
}

// The visual anchor of every onboarding step: an image or branded composition with the progress laid over
// it, easing into the canvas through a soft curve.
export function OnboardingHero({ header, image, imagePosition = '50% 40%', size = 'lg', children, badge }: Props) {
  return (
    <div className={`relative shrink-0 ${heights[size]}`}>
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {image ? (
          <img src={image} alt="" className="size-full object-cover" style={{ objectPosition: imagePosition }} />
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
      <svg
        className="absolute inset-x-0 -bottom-px h-10 w-full fill-canvas"
        viewBox="0 0 390 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 14 C 90 34, 210 36, 300 22 S 380 4, 390 2 L 390 40 L 0 40 Z" />
      </svg>
      {badge && <div className="absolute bottom-0 left-5 translate-y-1/3">{badge}</div>}
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
