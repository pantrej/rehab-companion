import { Check } from 'lucide-react'

type Props = {
  label: string
  selected: boolean
  onSelect: () => void
  // Multi-select: a checkbox with a square indicator, inside a role="group" instead of a radiogroup.
  multiple?: boolean
}

// One answer in a choice question. Single-choice by default, inside a role="radiogroup".
export function ChoiceOption({ label, selected, onSelect, multiple = false }: Props) {
  return (
    <button
      type="button"
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border px-5 py-3.5 text-left text-[17px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line bg-surface text-ink hover:border-[#d9d4ca]'
      }`}
    >
      {label}
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
