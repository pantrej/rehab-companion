import { Camera, Lock, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '../components/Avatar'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { CurvedHero, ThemeCard } from '../components/CurvedHero'
import { TextField } from '../components/TextField'
import { initialsOf, register } from '../utils/auth'
import { readCare } from '../utils/care'

const fieldIcon = { className: 'size-5', strokeWidth: 1.75 }

type Errors = Partial<Record<'fullName' | 'email' | 'password', string>>

export function RegisterScreen() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!fullName.trim()) next.fullName = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter an email address, like name@example.com.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    register({ fullName: fullName.trim(), email: email.trim() })
    // Onboarding usually came first; only start it here if it hasn't been answered.
    navigate(readCare() ? '/' : '/onboarding', { replace: true })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <CurvedHero size="sm" header={<BackButton to="/welcome" label="Back to welcome" tone="frosted" />}>
        <ThemeCard compact icon={<UserRound className="size-5" strokeWidth={1.75} />} label="Your account" />
      </CurvedHero>
      <div className="flex flex-1 flex-col px-5 pt-1 pb-8">
        <h1 className="text-[32px] leading-[1.1] font-bold tracking-[-0.025em] text-ink">Create account</h1>
        <p className="mt-2 text-body leading-relaxed text-ink-soft">Your recovery, kept in one calm place.</p>

        {/* Profile image placeholder: initials until photos are supported. */}
        <div className="mt-6 flex items-center gap-4">
          <span className="relative">
            <Avatar initials={initialsOf(fullName) || '?'} size="lg" />
            <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-surface text-ink-soft ring-1 ring-line">
              <Camera className="size-3.5" strokeWidth={2} aria-hidden />
            </span>
          </span>
          <p className="text-[15px] leading-snug text-ink-soft">Profile photo · you can add one later</p>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <TextField
            label="Full name"
            autoComplete="name"
            icon={<UserRound {...fieldIcon} />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail {...fieldIcon} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            icon={<Lock {...fieldIcon} />}
            revealable
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint="At least 8 characters. Prototype only: it isn’t stored."
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-canvas from-70% to-canvas/0 px-5 pt-8 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button type="submit">Create account</Button>
      </div>
    </form>
  )
}
