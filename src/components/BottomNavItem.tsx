import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'

type Props = {
  to: string
  label: string
  icon: LucideIcon
}

// How a tab looks, active or not. Shared by the live tab bar and the design system page.
export function TabItemView({ label, icon: Icon, active }: { label: string; icon: LucideIcon; active: boolean }) {
  return (
    <>
      <span
        className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-accent-soft' : ''}`}
      >
        <Icon className="size-[22px]" strokeWidth={active ? 2 : 1.75} aria-hidden />
      </span>
      {label}
    </>
  )
}

export const tabItemClass = (active: boolean) =>
  `flex flex-1 flex-col items-center gap-1 pt-2.5 pb-2 text-xs transition-colors ${
    active ? 'font-semibold text-accent' : 'font-medium text-ink-faint hover:text-ink-soft'
  }`

export function BottomNavItem({ to, label, icon }: Props) {
  return (
    <NavLink
      to={to}
      // Today matches only "/"; other tabs stay selected on their sub-pages (e.g. /support/pain).
      end={to === '/'}
      className={({ isActive }) => tabItemClass(isActive)}
    >
      {({ isActive }) => <TabItemView label={label} icon={icon} active={isActive} />}
    </NavLink>
  )
}
