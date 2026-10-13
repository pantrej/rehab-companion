import { CalendarCheck, ChartLine, CircleUser, LifeBuoy } from 'lucide-react'
import { BottomNavItem } from './BottomNavItem'

export const navItems = [
  { to: '/', label: 'Today', icon: CalendarCheck },
  { to: '/progress', label: 'Progress', icon: ChartLine },
  { to: '/support', label: 'Support', icon: LifeBuoy },
  { to: '/profile', label: 'Profile', icon: CircleUser },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="relative z-[1] flex shrink-0 bg-surface px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-raised"
    >
      {navItems.map((item) => (
        <BottomNavItem key={item.to} {...item} />
      ))}
    </nav>
  )
}
