import { CalendarDays } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Professional } from '../types/care'
import { Card } from './Card'
import { ProfessionalAvatar } from './ProfessionalAvatar'

type Props = {
  professional: Professional
  showClinic?: boolean
  // Actions or context under the identity.
  children?: ReactNode
}

// Who the professional is and when the user next sees them. Used where continuity of care matters.
export function ProfessionalCard({ professional, showClinic = false, children }: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <ProfessionalAvatar professional={professional} />
        <div>
          <p className="text-[17px] font-semibold text-ink">{professional.name}</p>
          <p className="text-[15px] text-ink-soft">
            {professional.role}
            {showClinic && ` · ${professional.clinic}`}
          </p>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-[15px] text-ink">
        <CalendarDays className="size-[18px] text-ink-soft" strokeWidth={1.75} aria-hidden />
        Next appointment: {professional.nextAppointment}
      </p>
      {children}
    </Card>
  )
}
