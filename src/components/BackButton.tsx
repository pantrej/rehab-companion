import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

type Props = {
  label: string
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never })

const classes =
  '-ml-2.5 flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-line/60'

// The top-left back control: a 44px target, as a link or a button.
export function BackButton({ label, to, onClick }: Props) {
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
