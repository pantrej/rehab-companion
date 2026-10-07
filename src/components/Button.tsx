import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet'

const base =
  'inline-flex w-full items-center justify-center gap-2 rounded-2xl text-base font-medium transition-colors disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<Variant, string> = {
  primary:
    'h-14 bg-accent text-white hover:bg-accent-strong active:bg-accent-strong disabled:bg-line disabled:text-ink-faint',
  secondary: 'h-12 bg-accent-soft text-accent hover:bg-[#e3e0f1] active:bg-[#e3e0f1]',
  ghost: 'h-11 text-accent hover:bg-accent-soft active:bg-accent-soft',
  // For actions that should stay available but never compete with the primary one.
  quiet: 'h-11 text-ink-soft hover:bg-line/60 active:bg-line/60',
}

type Props = {
  variant?: Variant
  icon?: ReactNode
  // Renders a link instead of a button when set.
  to?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant = 'primary', icon, to, className = '', children, ...props }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`
  const content = (
    <>
      {children}
      {icon}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
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
