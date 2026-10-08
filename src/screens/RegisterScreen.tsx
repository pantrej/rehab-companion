import { Camera } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '../components/Avatar'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { initialsOf, register } from '../utils/auth'

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
    navigate('/onboarding', { replace: true })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-5 pt-[max(env(safe-area-inset-top),2.5rem)] pb-10">
        <BackButton to="/welcome" label="Back to welcome" />
        <h1 className="mt-5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">Create account</h1>

        {/* Profile image placeholder: initials until photos are supported. */}
        <div className="mt-8 flex items-center gap-4">
          <span className="relative">
            <Avatar initials={initialsOf(fullName) || '?'} size="lg" />
            <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-surface text-ink-soft ring-1 ring-line">
              <Camera className="size-3.5" strokeWidth={2} aria-hidden />
            </span>
          </span>
          <p className="text-[15px] leading-snug text-ink-soft">Profile photo · you can add one later</p>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <TextField
            label="Full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint="At least 8 characters. Prototype only: it isn’t stored."
          />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
        <Button type="submit">Create account</Button>
      </div>
    </form>
  )
}
