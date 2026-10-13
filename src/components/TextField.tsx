import { X } from 'lucide-react'
import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type Props = {
  label: string
  error?: string
  hint?: string
  // Shows a clear button while the field has a value.
  onClear?: () => void
} & InputHTMLAttributes<HTMLInputElement>

// A labelled single-line field with room for a calm hint or error.
export function TextField({ label, error, hint, onClear, className = '', ...props }: Props) {
  const id = useId()
  const messageId = `${id}-message`
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-ink-soft">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error || hint ? messageId : undefined}
          className={`h-14 w-full rounded-control border bg-surface px-4 text-[17px] text-ink transition-shadow placeholder:text-ink-faint focus:ring-4 focus:outline-none ${
            onClear ? 'pr-12' : ''
          } ${error ? 'border-attention focus:ring-attention-soft' : 'border-line focus:border-accent focus:ring-accent-soft'}`}
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
      </div>
      {(error || hint) && (
        <p id={messageId} className={`mt-2 text-sm ${error ? 'text-attention' : 'text-ink-faint'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
