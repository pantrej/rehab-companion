import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

// Three levels of emphasis, plus a neutral text style for actions that must stay available but
// never compete (e.g. "Skip for now"). One primary per screen.
type Variant = 'primary' | 'secondary' | 'text' | 'quiet'

const base =
  'inline-flex w-full items-center justify-center gap-2 rounded-full text-body font-semibold transition-colors disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<Variant, string> = {
  primary:
    'h-14 bg-accent text-white hover:bg-accent-strong active:bg-accent-strong disabled:bg-line disabled:text-ink-faint',
  secondary: 'h-14 bg-accent-soft text-accent hover:bg-[#dcd8f0] active:bg-[#dcd8f0]',
  text: 'h-11 font-medium text-accent hover:bg-accent-soft active:bg-accent-soft',
  quiet: 'h-11 font-medium text-ink-soft hover:bg-line/60 active:bg-line/60',
}

type Props = {
  variant?: Variant
  icon?: ReactNode
  // Renders a link instead of a button when set; state travels with the navigation.
  to?: string
  state?: unknown
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant = 'primary', icon, to, state, className = '', children, ...props }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`
  const content = (
    <>
      {children}
      {icon}
    </>
  )

  if (to) {
    return (
      <Link to={to} state={state} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
