import type { Professional } from '../types/care'

const sizes = {
  sm: 'size-6 text-[10px]',
  md: 'size-11 text-sm',
}

// A neutral initials avatar; the prototype never uses a real person's photo.
export function ProfessionalAvatar({ professional, size = 'md' }: { professional: Professional; size?: keyof typeof sizes }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent ${sizes[size]}`}
      aria-hidden
    >
      {professional.initials}
    </span>
  )
}
