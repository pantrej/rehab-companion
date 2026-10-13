import type { ReactNode } from 'react'
import { Button } from './Button'
import { Sheet } from './Sheet'

export type SocialProvider = 'Google' | 'Apple'

type Props = {
  provider: SocialProvider
  onClose: () => void
  // The email route that works in this prototype.
  emailAction: ReactNode
}

// Google and Apple sign-in are shown so the entry feels complete, but nothing connects to them:
// this sheet says so plainly and points to email, which works on this device.
export function SocialSignInSheet({ provider, onClose, emailAction }: Props) {
  return (
    <Sheet title={`${provider} sign-in isn’t connected yet`} onClose={onClose}>
      <p className="mt-3 text-body leading-relaxed text-ink-soft">
        This prototype doesn’t connect to {provider}, so nothing is shared with {provider}. Use your email instead:
        your prototype account stays on this device.
      </p>
      <div className="mt-6 flex flex-col gap-1">
        {emailAction}
        <Button variant="quiet" onClick={onClose}>
          Not now
        </Button>
      </div>
    </Sheet>
  )
}
