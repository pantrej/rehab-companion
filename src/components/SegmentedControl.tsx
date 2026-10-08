type Option<T extends string> = {
  id: T
  label: string
}

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

// A small set of mutually exclusive views, e.g. 7 days / 30 days.
export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full bg-line/70 p-1">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`h-11 flex-1 rounded-full text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              selected ? 'bg-surface text-ink shadow-[0_1px_2px_rgb(29_28_33/0.08)]' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
