import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { demoAccount, logIn } from '../utils/auth'
import { readCare } from '../utils/care'

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return setError('Enter your email and password.')
    if (!logIn(email)) return setError('We couldn’t find an account with that email on this device.')
    // Returning users go straight to today; anyone without a setup starts it.
    navigate(readCare() ? '/' : '/onboarding', { replace: true })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <BackButton to="/welcome" label="Back to welcome" />
        <h1 className="mt-5 text-title font-semibold text-ink">Log in</h1>

        <div className="mt-8 flex flex-col gap-5">
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
        </div>

        <div className="mt-6 rounded-card bg-subtle p-4">
          <p className="text-sm text-ink-soft">
            Prototype: any password works. Try the demo account, {demoAccount.email}.
          </p>
          <Button
            variant="text"
            className="mt-1 -mb-1"
            onClick={() => {
              setEmail(demoAccount.email)
              setPassword('demo')
              setError(undefined)
            }}
          >
            Use demo account
          </Button>
        </div>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button type="submit">Log in</Button>
      </div>
    </form>
  )
}
