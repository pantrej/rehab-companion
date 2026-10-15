import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

// Sign-in actions: a filled primary, a white surface and a soft violet, each with a leading mark.
const variants = {
  primary: 'bg-accent text-white shadow-[0_14px_30px_-16px_rgb(75_42_173/0.75)] hover:bg-accent-strong',
  surface: 'bg-surface text-ink shadow-card ring-1 ring-line/80 hover:ring-[#d9d4ca]',
  soft: 'bg-accent-soft text-accent hover:bg-[#e0d7f8]',
}

type Props = {
  variant?: keyof typeof variants
  icon: ReactNode
  children: ReactNode
  // 'start' reads as a list of ways in, with an arrow; 'center' as a plain button.
  align?: 'start' | 'center'
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never })

export function AuthButton({ variant = 'surface', icon, children, align = 'start', to, onClick }: Props) {
  const classes = `flex h-14 w-full items-center gap-3 rounded-full px-5 text-body font-semibold transition-[background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    align === 'center' ? 'justify-center' : ''
  } ${variants[variant]}`
  const content = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center" aria-hidden>
        {icon}
      </span>
      <span className={align === 'start' ? 'flex-1 text-left' : ''}>{children}</span>
      {align === 'start' && <ArrowRight className="size-[18px] shrink-0 opacity-80" strokeWidth={2} aria-hidden />}
    </>
  )
  return to ? (
    <Link to={to} className={classes}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  )
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-4 text-[13px] text-ink-faint">
      <span className="h-px flex-1 bg-line" aria-hidden />
      or
      <span className="h-px flex-1 bg-line" aria-hidden />
    </div>
  )
}

// Google's four-colour G. On a coloured button it sits on a white disc, as Google's branding asks.
export function GoogleMark({ onColor = false }: { onColor?: boolean }) {
  const g = (
    <svg viewBox="0 0 48 48" className="size-[18px]" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
  return onColor ? <span className="flex size-8 items-center justify-center rounded-full bg-white">{g}</span> : g
}

export function AppleMark() {
  return (
    <svg viewBox="0 0 384 512" className="size-5 fill-ink" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}
