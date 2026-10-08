import { Navigate, useLocation, useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Card } from '../components/Card'
import { planChanges } from '../data/plan'
import { useCare } from '../utils/care'

// Why the plan may differ from day to day. Every change is the professional's, with its reason.
export function PlanChangesScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { professional } = useCare()
  if (!professional) return <Navigate to="/" replace />

  const back = () => (location.key === 'default' ? navigate('/progress') : navigate(-1))

  return (
    <div className="flex flex-col gap-8 px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
      <header>
        <BackButton label="Back" onClick={back} />
        <h1 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Plan changes</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Your plan is changed by {professional.name}, {professional.credential}, usually after reviewing your
          check-ins. The app never changes it on its own.
        </p>
      </header>

      <ol className="flex flex-col gap-4">
        {planChanges.map((change) => (
          <li key={change.date + change.title}>
            <Card className="p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[17px] font-semibold text-ink">{change.title}</p>
                <p className="shrink-0 text-[13px] text-ink-faint">{change.date}</p>
              </div>
              <p className="mt-2 text-[17px] leading-relaxed text-ink">{change.change}</p>
              <dl className="mt-4 flex flex-col gap-3 border-t border-line pt-4 text-[15px]">
                <div>
                  <dt className="text-sm text-ink-soft">Reason</dt>
                  <dd className="mt-0.5 text-ink">{change.reason}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Updated by</dt>
                  <dd className="mt-0.5 text-ink">{change.updatedBy}</dd>
                </div>
                {change.appliesFrom && (
                  <div>
                    <dt className="text-sm text-ink-soft">Applies from</dt>
                    <dd className="mt-0.5 text-ink">{change.appliesFrom}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  )
}
