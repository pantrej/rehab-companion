import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { MovementIllustration } from './MovementIllustration'
import type { MovementId } from './MovementIllustration'

// A recorded demonstration of the movement: a short, muted, looping clip, with a still from it to show
// before it plays, and whatever credit its licence asks for.
export type DemoClip = {
  src: string
  // A frame from the clip, so the slot shows the movement rather than a grey box before it plays.
  poster?: string
  // Shown under the frame where the footage's licence asks to be credited.
  credit?: string
}

type Props = {
  name: string
  // What the movement is, said in words for anyone who can't see the demonstration.
  instruction: string
  // Which movement is drawn while there is no recording of it.
  movement: MovementId
  clip?: DemoClip
}

// The demonstration slot. It plays on tap and loops, and says plainly which of the two it is showing:
// a real recording of the movement, or a drawing of it. If a clip is set but won't play on this device,
// the drawing takes over rather than leaving an empty frame.
export function ExerciseDemo({ name, instruction, movement, clip }: Props) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const showClip = !!clip && !failed

  // The element is the source of truth: a browser can refuse to play (a power-saving mode, a codec it
  // doesn't have), and the control has to end up saying what actually happened.
  const toggle = () => {
    const next = !playing
    setPlaying(next)
    const element = video.current
    if (!showClip || !element) return
    if (!next) {
      element.pause()
      return
    }
    void element.play().catch(() => setPlaying(false))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={`${playing ? 'Pause' : 'Play'} the ${name.toLowerCase()} demonstration`}
      className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-card bg-sunken transition-colors hover:bg-line"
    >
      {showClip ? (
        <video
          ref={video}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => {
            setFailed(true)
            setPlaying(false)
          }}
          className="size-full object-cover"
          aria-label={`${name}: ${instruction}`}
        />
      ) : (
        <MovementIllustration movement={movement} playing={playing} label={`${name}: ${instruction}`} />
      )}

      {playing ? (
        <>
          <span className="absolute bottom-3 left-4 flex flex-col items-start text-caption text-ink-faint">
            {showClip ? 'Demonstration' : 'Movement illustration'}
            {showClip && clip.credit && <span className="text-[11px]">{clip.credit}</span>}
          </span>
          <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-surface/85 text-ink-soft backdrop-blur-sm">
            <Pause className="size-4 fill-current" aria-hidden />
          </span>
        </>
      ) : (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sunken/70">
          <span className="flex size-16 items-center justify-center rounded-full bg-surface text-accent shadow-card">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden />
          </span>
          <span className="text-[15px] font-medium text-ink-soft">Watch demonstration</span>
        </span>
      )}
    </button>
  )
}
