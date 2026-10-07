import { CalendarCheck, ChartLine, CircleUser, LifeBuoy } from 'lucide-react'
import { BottomNavItem } from './BottomNavItem'

const items = [
  { to: '/', label: 'Today', icon: CalendarCheck },
  { to: '/progress', label: 'Progress', icon: ChartLine },
  { to: '/support', label: 'Support', icon: LifeBuoy },
  { to: '/profile', label: 'Profile', icon: CircleUser },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="flex shrink-0 border-t border-line bg-surface px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]"
    >
      {items.map((item) => (
        <BottomNavItem key={item.to} {...item} />
      ))}
    </nav>
  )
}
