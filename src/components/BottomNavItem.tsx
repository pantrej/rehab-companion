import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

type Props = {
  to: string
  label: string
  icon: LucideIcon
  active: boolean
}

// How a tab reads, active or not. The active bed is the pill behind it, so the tab itself only carries
// the colour; the icon settles the last few per cent of its size as it becomes current.
export function TabItemView({ label, icon: Icon, active }: { label: string; icon: LucideIcon; active: boolean }) {
  return (
    <>
      <Icon
        className={`size-[22px] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          active ? 'scale-100' : 'scale-[0.96]'
        }`}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden
      />
      {label}
    </>
  )
}

export const tabItemClass = (active: boolean) =>
  `relative z-[1] flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-[20px] text-[11px] transition-colors duration-300 ${
    active ? 'font-semibold text-accent' : 'font-medium text-ink-faint hover:text-ink-soft'
  }`

export function BottomNavItem({ to, label, icon, active }: Props) {
  return (
    <Link to={to} aria-current={active ? 'page' : undefined} className={tabItemClass(active)}>
      <TabItemView label={label} icon={icon} active={active} />
    </Link>
  )
}
