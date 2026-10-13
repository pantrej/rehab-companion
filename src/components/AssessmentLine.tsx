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

// The verdict plus one line of why, linking to the full explanation. Used on Today and Progress.
export function AssessmentLine({ assessment, returnTo, linkLabel = 'See what this means' }: Props) {
  return (
    <Link
      to="/insight"
      state={{ returnTo }}
      className="-mx-2 flex min-h-11 items-start justify-between gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-canvas"
    >
      <span>
        <span className={`flex items-center gap-2 text-[15px] font-medium ${toneText[assessment.tone]}`}>
          <span className={`size-2 rounded-full ring-[3px] ${toneDot[assessment.tone]}`} aria-hidden />
          {assessment.verdict}
        </span>
        <span className="mt-0.5 block text-[15px] leading-relaxed text-ink-soft">{assessment.headline}</span>
        <span className="mt-1 block text-[15px] font-medium text-accent">{linkLabel}</span>
      </span>
      <ChevronRight className="mt-1 size-4 shrink-0 text-ink-faint" aria-hidden />
    </Link>
  )
}
