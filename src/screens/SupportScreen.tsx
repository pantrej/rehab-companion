import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '../components/Card'
import { supportDisclaimer, supportIntro, supportTopics } from '../data/support'

export function SupportScreen() {
  return (
    <div className="flex flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),3.5rem)] pb-10">
      <header>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">{supportIntro.title}</h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">{supportIntro.text}</p>
      </header>

      <Card className="px-0 py-1">
        <ul className="divide-y divide-line">
          {supportTopics.map((topic) => (
            <li key={topic.id}>
              <Link
                to={`/support/${topic.id}`}
                className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 text-[17px] text-ink transition-colors hover:bg-canvas/60"
              >
                {topic.label}
                <ChevronRight className="size-5 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <p className="px-1 text-[13px] leading-relaxed text-ink-faint">{supportDisclaimer}</p>
    </div>
  )
}
