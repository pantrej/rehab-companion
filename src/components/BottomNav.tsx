import { CalendarCheck, ChartLine, CircleUser, LifeBuoy } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { useLocation } from 'react-router'
import { BottomNavItem } from './BottomNavItem'

export const navItems = [
  { to: '/', label: 'Today', icon: CalendarCheck },
  { to: '/progress', label: 'Progress', icon: ChartLine },
  { to: '/support', label: 'Support', icon: LifeBuoy },
  { to: '/profile', label: 'Profile', icon: CircleUser },
]

// The navigation surface: a floating capsule that sits above the page rather than closing it off.
export function TabBarSurface({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative flex h-[68px] items-center rounded-[26px] bg-surface/95 px-1.5 shadow-[0_12px_30px_-14px_rgb(29_28_33/0.3)] ring-1 ring-line/80 backdrop-blur-sm ${className}`}
      {...props}
    />
  )
}

// The active tab's lavender bed. One element for all four tabs, so switching slides it across rather
// than fading one out and another in. It moves by transform only.
export function ActivePill({ index, count = navItems.length }: { index: number; count?: number }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-y-2 left-1.5 rounded-[20px] bg-accent-soft transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
        index < 0 ? 'opacity-0' : ''
      }`}
      style={{ width: `calc((100% - 0.75rem) / ${count})`, transform: `translateX(${Math.max(index, 0) * 100}%)` }}
    />
  )
}

// Floats clear of the content and of the device's own bottom edge, in the same place on every screen.
export function BottomNav() {
  const { pathname } = useLocation()
  // Today matches only "/"; the others stay selected on their sub-pages, e.g. /support/pain.
  const index = navItems.findIndex((item) => (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)))

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none absolute inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-[1]"
    >
      <TabBarSurface className="pointer-events-auto">
        <ActivePill index={index} />
        {navItems.map((item, i) => (
          <BottomNavItem key={item.to} {...item} active={i === index} />
        ))}
      </TabBarSurface>
    </nav>
  )
}
