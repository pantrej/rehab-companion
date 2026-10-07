import { Check } from 'lucide-react'

type Props = {
  label: string
  selected: boolean
  onSelect: () => void
}

// One answer in a single-choice question. Lives inside a role="radiogroup".
export function ChoiceOption({ label, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      role="radio"
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
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? 'border-accent bg-accent text-white' : 'border-[#d9d4ca]'
        }`}
        aria-hidden
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  )
}
