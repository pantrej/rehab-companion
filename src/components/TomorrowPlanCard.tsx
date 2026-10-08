import { Check } from 'lucide-react'
import { tomorrow } from '../data/plan'
import { Card } from './Card'
import { PlanUpdateNote } from './PlanUpdateNote'

// Tomorrow at a glance. Only a connected professional can have changed it; otherwise it's the same plan.
export function TomorrowPlanCard({ updated }: { updated: boolean }) {
  return (
    <Card className="p-6">
      <p className="text-xl leading-snug font-semibold tracking-[-0.01em] text-ink">{tomorrow.focus}</p>
      <p className="mt-1 text-[15px] text-ink-soft">
        {tomorrow.exerciseCount} exercises · About {tomorrow.durationMinutes} min
      </p>
      {updated ? (
        <div className="mt-4">
          <PlanUpdateNote />
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-[15px] text-ink-soft">
          <Check className="size-4 text-positive" strokeWidth={2.25} aria-hidden />
          Same plan as today
        </p>
      )}
    </Card>
  )
}
