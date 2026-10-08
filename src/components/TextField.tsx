import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type Props = {
  label: string
  error?: string
  hint?: string
} & InputHTMLAttributes<HTMLInputElement>

// A labelled single-line field with room for a calm hint or error.
export function TextField({ label, error, hint, className = '', ...props }: Props) {
  const id = useId()
  const messageId = `${id}-message`
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? messageId : undefined}
        className={`mt-2 h-14 w-full rounded-2xl border bg-surface px-4 text-[17px] text-ink placeholder:text-ink-faint focus:outline-none ${
          error ? 'border-attention' : 'border-line focus:border-accent'
        }`}
        {...props}
      />
      {(error || hint) && (
        <p id={messageId} className={`mt-2 text-sm ${error ? 'text-attention' : 'text-ink-faint'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
