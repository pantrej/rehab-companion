import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Assessment } from '../data/assessment'
import { toneDot, toneText } from '../utils/tone'

type Props = {
  assessment: Assessment
  // Where the insight's back button should return to.
  returnTo: string
  linkLabel?: string
}

// The verdict plus one line of why, linking to the full explanation. Green is reserved for this verdict.
export function AssessmentLine({ assessment, returnTo, linkLabel = 'See what this means' }: Props) {
  return (
    <Link
      to="/insight"
      state={{ returnTo }}
      className="-m-2 flex min-h-11 items-start justify-between gap-3 rounded-2xl p-2 transition-colors hover:bg-canvas"
    >
      <span>
        <span className={`flex items-center gap-2.5 text-section font-semibold ${toneText[assessment.tone]}`}>
          <span className={`size-2.5 rounded-full ring-4 ${toneDot[assessment.tone]}`} aria-hidden />
          {assessment.verdict}
        </span>
        <span className="mt-1 block text-body text-ink">{assessment.headline}</span>
        <span className="mt-1.5 block text-[15px] font-semibold text-accent">{linkLabel}</span>
      </span>
      <ChevronRight className="mt-1.5 size-4 shrink-0 text-ink-faint" aria-hidden />
    </Link>
  )
}
