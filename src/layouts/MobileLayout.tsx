import { Outlet } from 'react-router'
import { BottomNav } from '../components/BottomNav'

export const appFrameId = 'app-frame'

type Props = {
  // Focused flows (an exercise session) hide the tab bar.
  nav?: boolean
}

// Full-bleed on a phone; a centred 390px frame on wider screens.
export function MobileLayout({ nav = true }: Props) {
  return (
    <div className="min-h-dvh bg-[#e7e3db] sm:flex sm:items-center sm:justify-center sm:py-8">
      {/* Modals portal into this frame (see appFrameId), so they cover the screen and the tab bar alike. */}
      <div
        id={appFrameId}
        className="relative mx-auto flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-canvas sm:h-[844px] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[2.75rem] sm:shadow-[0_24px_60px_-24px_rgb(29_28_33/0.25)]">
        {/* The tab bar floats over the page, so the scroll area ends clear of it rather than behind it. */}
        <main
          className={`no-scrollbar flex flex-1 flex-col overflow-y-auto ${
            nav ? 'pb-[calc(env(safe-area-inset-bottom)+5rem)]' : ''
          }`}
        >
          <Outlet />
        </main>
        {nav && <BottomNav />}
      </div>
    </div>
  )
}
