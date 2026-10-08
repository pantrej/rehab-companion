import { HeartPulse } from 'lucide-react'
import { Navigate } from 'react-router'
import { Button } from '../components/Button'
import { isSignedIn } from '../utils/auth'

export function WelcomeScreen() {
  if (isSignedIn()) return <Navigate to="/" replace />

  return (
    <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <HeartPulse className="size-7" strokeWidth={1.75} aria-hidden />
      </span>
      <h1 className="mt-8 text-[32px] leading-tight font-semibold tracking-[-0.02em] text-ink">
        Your rehabilitation, between appointments
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
        Follow your rehabilitation plan, check in after sessions, and understand how your recovery is changing.
      </p>

      <div className="mt-auto flex flex-col gap-2 pt-10">
        <Button to="/register">Create account</Button>
        <Button to="/login" variant="secondary">
          Log in
        </Button>
        <p className="mt-3 text-center text-[13px] text-ink-faint">Prototype · your data stays on this device</p>
      </div>
    </div>
  )
}
