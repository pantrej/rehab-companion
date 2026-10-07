import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex w-full items-center justify-center gap-2 rounded-2xl text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<Variant, string> = {
  primary: 'h-14 bg-accent text-white hover:bg-accent-strong active:bg-accent-strong',
  secondary: 'h-12 bg-accent-soft text-accent hover:bg-[#e3e0f1] active:bg-[#e3e0f1]',
  ghost: 'h-11 text-accent hover:bg-accent-soft active:bg-accent-soft',
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
