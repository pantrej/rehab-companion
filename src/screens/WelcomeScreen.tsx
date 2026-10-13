import { HeartPulse, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
// Photo: Mikhail Nilov on Pexels (free to use). Swap the file to replace it.
import welcomeImage from '../assets/welcome.webp'
import { AppleMark, AuthButton, AuthDivider, GoogleMark } from '../components/AuthButton'
import { Button } from '../components/Button'
import { CurvedHero } from '../components/CurvedHero'
import { SocialSignInSheet } from '../components/SocialSignInSheet'
import type { SocialProvider } from '../components/SocialSignInSheet'

// Always shown at /welcome, even with a saved account, so every test session can start here.
export function WelcomeScreen() {
  const [provider, setProvider] = useState<SocialProvider>()

  return (
    <div className="flex flex-1 flex-col">
      <CurvedHero
        size="xl"
        image={welcomeImage}
        imagePosition="50% 30%"
        curve="left"
        wash={false}
        header={
          <span className="flex size-14 items-center justify-center rounded-[18px] bg-white/80 text-accent shadow-[0_10px_24px_-14px_rgb(75_42_173/0.55)] backdrop-blur-sm">
            <HeartPulse className="size-7" strokeWidth={1.75} aria-hidden />
            <span className="sr-only">Rehab Companion</span>
          </span>
        }
      />

      <div className="flex flex-1 flex-col px-5 pt-1 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <h1 className="text-[32px] leading-[1.1] font-bold tracking-[-0.025em] text-ink">
          Your rehabilitation, between appointments
        </h1>
        <p className="mt-3 text-body leading-relaxed text-ink-soft">
          Follow your rehabilitation plan, check in after sessions, and understand how your recovery is changing.
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-7">
          <AuthButton variant="primary" icon={<GoogleMark onColor />} onClick={() => setProvider('Google')}>
            Continue with Google
          </AuthButton>
          <AuthButton icon={<AppleMark />} onClick={() => setProvider('Apple')}>
            Continue with Apple
          </AuthButton>
          <AuthDivider />
          <AuthButton variant="soft" icon={<Mail className="size-[22px]" strokeWidth={1.75} />} to="/register">
            Continue with email
          </AuthButton>
          <p className="mt-1 text-center text-[15px] text-ink-soft">
            Already have an account?{' '}
            <Link to="/login" className="-mx-1.5 inline-flex min-h-11 items-center rounded-full px-1.5 font-semibold text-accent">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {provider && (
        <SocialSignInSheet
          provider={provider}
          onClose={() => setProvider(undefined)}
          emailAction={<Button to="/register">Continue with email</Button>}
        />
      )}
    </div>
  )
}
