import { ArrowRight, Lock, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
// Photo: Kampus Production on Pexels (free to use). Swap the file to replace it.
import loginImage from '../assets/login.webp'
import { AppleMark, AuthButton, AuthDivider, GoogleMark } from '../components/AuthButton'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { CurvedHero } from '../components/CurvedHero'
import { SocialSignInSheet } from '../components/SocialSignInSheet'
import type { SocialProvider } from '../components/SocialSignInSheet'
import { TextField } from '../components/TextField'
import { demoAccount, logIn } from '../utils/auth'
import { readCare } from '../utils/care'

const fieldIcon = { className: 'size-5', strokeWidth: 1.75 }

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [provider, setProvider] = useState<SocialProvider>()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return setError('Enter your email and password.')
    if (!logIn(email)) return setError('We couldn’t find an account with that email on this device.')
    // Returning users go straight to today; anyone without a setup starts it.
    navigate(readCare() ? '/' : '/onboarding', { replace: true })
  }

  const chooseEmail = () => {
    setProvider(undefined)
    document.querySelector<HTMLInputElement>('input[type="email"]')?.focus()
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <CurvedHero
        size="md"
        image={loginImage}
        imagePosition="58% 30%"
        curve="left"
        wash={false}
        header={<BackButton to="/welcome" label="Back to welcome" tone="frosted" />}
      />

      <div className="flex flex-1 flex-col px-5 pt-1 pb-6">
        <h1 className="text-[40px] leading-none font-bold tracking-[-0.03em] text-ink">Log in</h1>
        <p className="mt-3 text-body leading-relaxed text-ink-soft">
          Continue your rehabilitation journey and pick up where you left off.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <AuthButton align="center" icon={<GoogleMark />} onClick={() => setProvider('Google')}>
            Continue with Google
          </AuthButton>
          <AuthButton align="center" icon={<AppleMark />} onClick={() => setProvider('Apple')}>
            Continue with Apple
          </AuthButton>
        </div>

        <div className="my-6">
          <AuthDivider />
        </div>

        <div className="flex flex-col gap-5">
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail {...fieldIcon} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            icon={<Lock {...fieldIcon} />}
            revealable
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
        </div>

        <div className="mt-5 flex gap-4 rounded-card bg-accent-soft/45 p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent" aria-hidden>
            <UserRound className="size-[22px]" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] leading-snug text-ink-soft">
              Prototype: any password works. Try the demo account, {demoAccount.email}.
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail(demoAccount.email)
                setPassword('demo')
                setError(undefined)
              }}
              className="-mx-2 mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[15px] font-semibold text-accent hover:bg-accent-soft/70"
            >
              Use demo account
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button type="submit">Log in</Button>
      </div>

      {provider && (
        <SocialSignInSheet
          provider={provider}
          onClose={() => setProvider(undefined)}
          emailAction={<Button type="button" onClick={chooseEmail}>Log in with email</Button>}
        />
      )}
    </form>
  )
}
