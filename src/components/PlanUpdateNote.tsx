import { ChevronRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router'
import { latestChange, tomorrow } from '../data/plan'

// A professional's change to an upcoming session: visible, calm, and always attributed.
// Unboxed: the surrounding card or sheet decides its surface, so it never nests a box in a box.
export function PlanUpdateNote({ title = 'Plan updated for tomorrow' }: { title?: string }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-medium text-ink">
        <RefreshCw className="size-4 text-accent" strokeWidth={2} aria-hidden />
        {title}
      </p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{tomorrow.updateNote}</p>
      <p className="mt-2 text-caption text-ink-soft">Updated by {latestChange.updatedBy}</p>
      <Link
        to="/plan-changes"
        className="-mx-2 mt-1 -mb-2 flex min-h-11 items-center justify-between rounded-xl px-2 text-[15px] font-medium text-accent hover:bg-accent-soft"
      >
        View plan changes
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  )
}
