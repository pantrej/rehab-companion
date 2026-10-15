import { safetyTiers, urgentCare } from '../data/safety'
import { professionalPhrase } from '../utils/care'
import { toneDot } from '../utils/tone'

// Continue / ease off / stop, as three short rows. Shown on demand, never as a wall of text.
export function SafetyGuide({ professionalName }: { professionalName?: string }) {
  const pro = professionalPhrase(professionalName)
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {safetyTiers.map((tier) => (
          <li key={tier.id} className="flex gap-3">
            <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ${toneDot[tier.tone]}`} aria-hidden />
            <div>
              <p className="text-base font-medium text-ink">{tier.title.replace('{pro}', pro)}</p>
              <p className="mt-0.5 text-[15px] leading-relaxed text-ink-soft">{tier.when}</p>
              <p className="mt-0.5 text-[15px] leading-relaxed text-ink">{tier.action.replace('{pro}', pro)}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">{urgentCare}</p>
    </div>
  )
}
