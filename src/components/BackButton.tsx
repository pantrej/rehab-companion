import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

type Props = {
  label: string
  // 'frosted' sits on a soft white disc, for use over photos.
  tone?: 'plain' | 'frosted'
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never })

const tones = {
  plain: '-ml-2.5 hover:bg-line/60',
  frosted: 'bg-white/80 shadow-[0_6px_16px_-8px_rgb(29_28_33/0.3)] backdrop-blur-sm hover:bg-white',
}

// The top-left back control: a 44px target, as a link or a button.
export function BackButton({ label, to, onClick, tone = 'plain' }: Props) {
  const classes = `flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors ${tones[tone]}`
  const icon = <ArrowLeft className="size-[22px]" strokeWidth={1.75} aria-hidden />
  return to ? (
    <Link to={to} aria-label={label} className={classes}>
      {icon}
    </Link>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={classes}>
      {icon}
    </button>
  )
}
