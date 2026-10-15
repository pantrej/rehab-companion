import type { HTMLAttributes } from 'react'

// Three surface levels, so every screen has one clear focal point:
//   default  — white, softly raised; the standard container
//   featured — tinted, flat; the single most important card on a screen
//   quiet    — warm and flat; supporting detail that should recede
const tones = {
  default: 'bg-surface shadow-card',
  featured: 'bg-featured',
  quiet: 'bg-subtle',
}

type Props = HTMLAttributes<HTMLDivElement> & { tone?: keyof typeof tones }

// Default padding applies only when the caller sets none, so p-6 or px-6 py-2 never compete with it.
export function Card({ className = '', tone = 'default', ...props }: Props) {
  const padding = /(^|\s)p[xytrbl]?-/.test(className) ? '' : 'p-5'
  return <div className={`rounded-card ${tones[tone]} ${padding} ${className}`} {...props} />
}
