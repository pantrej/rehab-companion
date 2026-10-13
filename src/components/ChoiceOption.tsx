import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  label: string
  // Optional supporting line under the label.
  description?: string
  selected: boolean
  onSelect: () => void
  // Multi-select: a checkbox with a square indicator, inside a role="group" instead of a radiogroup.
  multiple?: boolean
  // A leading icon turns the option into a large card, for a screen's one defining question.
  icon?: ReactNode
}

// One answer in a choice question. Single-choice by default, inside a role="radiogroup".
export function ChoiceOption({ label, description, selected, onSelect, multiple = false, icon }: Props) {
  if (icon) {
    return (
      <button
        type="button"
        role={multiple ? 'checkbox' : 'radio'}
        aria-checked={selected}
        onClick={onSelect}
        className={`flex h-full w-full items-center gap-4 rounded-[22px] border-[1.5px] px-4 py-3.5 pr-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          selected ? 'border-accent bg-[#f4f0fd]' : 'border-line bg-surface hover:border-[#d9d4ca]'
        }`}
      >
        <span
          className={`flex size-13 shrink-0 items-center justify-center rounded-full transition-colors ${
            selected ? 'bg-accent-soft text-accent' : 'bg-subtle text-ink-soft'
          }`}
          aria-hidden
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] leading-snug font-semibold text-ink">{label}</span>
          {description && <span className="mt-1 block text-[15px] leading-snug text-ink-soft">{description}</span>}
        </span>
        {/* A checkmark marks the choice; the space is kept so the text never shifts. */}
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-[opacity,scale] ${
            selected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          aria-hidden
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-control border px-5 py-3.5 text-left text-[17px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line bg-surface text-ink hover:border-[#d9d4ca]'
      }`}
    >
      <span>
        {label}
        {description && <span className="mt-1 block text-[15px] leading-snug text-ink-soft">{description}</span>}
      </span>
      <span
        className={`flex size-6 shrink-0 items-center justify-center border transition-colors ${
          multiple ? 'rounded-md' : 'rounded-full'
        } ${selected ? 'border-accent bg-accent text-white' : 'border-[#d9d4ca]'}`}
        aria-hidden
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  )
}
