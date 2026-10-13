import { Eye, EyeOff, X } from 'lucide-react'
import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = {
  label: string
  error?: string
  hint?: string
  // Shows a clear button while the field has a value.
  onClear?: () => void
  // A quiet leading icon, e.g. mail or lock.
  icon?: ReactNode
  // Password fields: a show/hide control.
  revealable?: boolean
} & InputHTMLAttributes<HTMLInputElement>

// A labelled single-line field with room for a calm hint or error.
export function TextField({ label, error, hint, onClear, icon, revealable = false, className = '', type, ...props }: Props) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)
  const trailing = !!onClear || revealable
  const messageId = `${id}-message`
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-ink-soft">
        {label}
      </label>
      <div className="relative mt-2">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" aria-hidden>
            {icon}
          </span>
        )}
        <input
          type={revealable && revealed ? 'text' : type}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error || hint ? messageId : undefined}
          className={`h-14 w-full rounded-control border bg-surface px-4 text-[17px] text-ink transition-shadow placeholder:text-ink-faint focus:ring-4 focus:outline-none ${
            trailing ? 'pr-12' : ''
          } ${icon ? 'pl-12' : ''} ${error ? 'border-attention focus:ring-attention-soft' : 'border-line focus:border-accent focus:ring-accent-soft'}`}
          {...props}
        />
        {onClear && props.value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="absolute top-1/2 right-1.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-line/60"
          >
            <X className="size-[18px]" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className="absolute top-1/2 right-1.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-line/60"
          >
            {revealed ? <EyeOff className="size-5" strokeWidth={1.75} aria-hidden /> : <Eye className="size-5" strokeWidth={1.75} aria-hidden />}
          </button>
        )}
      </div>
      {(error || hint) && (
        <p id={messageId} className={`mt-2 text-sm ${error ? 'text-attention' : 'text-ink-faint'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
