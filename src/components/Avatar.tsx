const sizes = {
  sm: 'size-6 text-[10px]',
  md: 'size-11 text-sm',
  lg: 'size-16 text-xl',
  xl: 'size-20 text-2xl',
}

const tones = {
  // Professionals in the soft accent; the patient in a warm neutral, so the two never read as one.
  professional: 'bg-accent-soft text-accent',
  patient: 'bg-sunken text-ink-soft',
}

type Props = {
  initials: string
  size?: keyof typeof sizes
  tone?: keyof typeof tones
}

// A neutral initials avatar, standing in for a profile image. The prototype never uses a real person's photo.
export function Avatar({ initials, size = 'md', tone = 'patient' }: Props) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${tones[tone]}`}
      aria-hidden
    >
      {initials}
    </span>
  )
}
