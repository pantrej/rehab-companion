import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

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
  clip?: DemoClip
}

// The demonstration slot. It plays on tap and loops, and says plainly which of the two it is showing:
// a real recording of the movement, or a drawing of it. If a clip is set but won't play on this device,
// the drawing takes over rather than leaving an empty frame.
export function ExerciseDemo({ name, instruction, clip }: Props) {
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
        <MovementIllustration playing={playing} label={`${name}: ${instruction}`} />
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

// A seated calf raise, drawn: the leg at rest, the heel lifting off the floor and lowering again. Line
// art on purpose — it illustrates the movement, it does not stand in for a clinician's recording.
// Three parts move together: the thigh hinges at the hip, the shin rises with the knee, and the foot
// pivots on the ball, which is what lifts the heel.
function MovementIllustration({ playing, label }: { playing: boolean; label: string }) {
  const motion = (name: string) => (playing ? name : '')
  return (
    <svg viewBox="0 0 320 240" className="size-full" role="img" aria-label={label}>
      {/* The seat and the floor, so the movement reads as a seated one. */}
      <rect x="14" y="52" width="86" height="16" rx="8" className="fill-[#dcd6cb]" />
      <rect x="20" y="68" width="10" height="126" rx="5" className="fill-[#dcd6cb]" />
      <line x1="14" y1="196" x2="300" y2="196" className="stroke-ink-faint/30" strokeWidth={2} strokeLinecap="round" />
      {/* Where the heel travels, left in place as the movement repeats. */}
      <path
        d="M158 190 C 160 182, 164 176, 170 172"
        fill="none"
        className="stroke-accent/35"
        strokeWidth={2}
        strokeDasharray="3 6"
        strokeLinecap="round"
      />

      <g className={motion('animate-thigh-lift')} style={{ transformOrigin: '62px 58px', transformBox: 'view-box' }}>
        <line x1="62" y1="58" x2="172" y2="62" className="stroke-[#cfc8bc]" strokeWidth={26} strokeLinecap="round" />
      </g>

      <g className={motion('animate-shin-lift')} style={{ transformBox: 'view-box' }}>
        <line x1="172" y1="62" x2="196" y2="186" className="stroke-[#cfc8bc]" strokeWidth={21} strokeLinecap="round" />
        <circle cx="172" cy="62" r="6" className="fill-accent/55" />
        <circle cx="196" cy="180" r="6" className="fill-accent/70" />
      </g>

      <g className={motion('animate-heel-raise')} style={{ transformOrigin: '208px 192px', transformBox: 'view-box' }}>
        <line x1="160" y1="190" x2="236" y2="190" className="stroke-[#cfc8bc]" strokeWidth={15} strokeLinecap="round" />
      </g>
    </svg>
  )
}
