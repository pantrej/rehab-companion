import type { HTMLAttributes } from 'react'

// Default padding applies only when the caller sets none, so p-6 or px-6 py-2 never compete with it.
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  const padding = /(^|\s)p[xytrbl]?-/.test(className) ? '' : 'p-5'
  return <div className={`rounded-3xl border border-line bg-surface ${padding} ${className}`} {...props} />
}
