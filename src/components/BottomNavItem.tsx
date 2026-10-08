import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'

type Props = {
  to: string
  label: string
  icon: LucideIcon
}

export function BottomNavItem({ to, label, icon: Icon }: Props) {
  return (
    <NavLink
      to={to}
      // Today matches only "/"; other tabs stay selected on their sub-pages (e.g. /support/pain).
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-xs font-medium transition-colors ${
          isActive ? 'text-accent' : 'text-ink-faint hover:text-ink-soft'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
              isActive ? 'bg-accent-soft' : ''
            }`}
          >
            <Icon className="size-[22px]" strokeWidth={isActive ? 2 : 1.75} aria-hidden />
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}
