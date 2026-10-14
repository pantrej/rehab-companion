import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState } from 'react'
import { MovementIllustration } from './MovementIllustration'
import type { MovementId } from './MovementIllustration'

export type ExerciseFilm = {
  // Best source first; a browser takes the first one it can play. WebM for most, H.264 MP4 for iOS.
  sources: { src: string; type: string }[]
  // The frame shown before it plays: the demonstration itself, not a decorative photo.
  poster: string
  // How long it runs, in seconds, for the indicator on the still.
  seconds: number
  // 'illustration' is a drawn stand-in and says so on the frame; 'film' is a recording of the movement.
  kind: 'illustration' | 'film'
  // Shown with the footage where its licence or its clinic asks to be credited.
  credit?: string
}

type Props = {
  name: string
  // What the movement is, in words, for anyone who can't see the demonstration.
  instruction: string
  film: ExerciseFilm
  // Drawn instead if the clip can't play on this device.
  movement: MovementId
}

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

// The demonstration of one exercise: a still of the movement, a play control, and the clip itself in
// place. Nothing navigates away, and nothing covers the frame with a label — the picture is the
// instruction, so it is the thing that is shown.
export function ExerciseVideo({ name, instruction, film, movement }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [at, setAt] = useState(0)
  const [failed, setFailed] = useState(false)
  // The clip's own length once it is known; until then, the length the exercise says it is.
  const [length, setLength] = useState(film.seconds)

  const play = () => {
    const element = video.current
    if (!element) return
    setStarted(true)
    void element
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false)
        setStarted(false)
      })
  }

  const toggle = () => {
    const element = video.current
    if (!element) return
    if (element.paused) play()
    else {
      element.pause()
      setPlaying(false)
    }
  }

  const seek = (time: number) => {
    setAt(time)
    if (video.current) video.current.currentTime = time
  }

  const fullscreen = () => {
    const element = frame.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null
    const native = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    // iOS plays fullscreen from the video element itself; everywhere else the frame goes full.
    if (element?.requestFullscreen) void element.requestFullscreen().catch(() => native?.webkitEnterFullscreen?.())
    else if (native?.webkitEnterFullscreen) native.webkitEnterFullscreen()
    else element?.webkitRequestFullscreen?.()
  }

  if (failed) {
    return (
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-card bg-sunken">
        <MovementIllustration movement={movement} playing label={`${name}: ${instruction}`} />
        <span className="absolute top-3 left-3 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          Drawn movement
        </span>
      </div>
    )
  }

  return (
    <div ref={frame} className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-sunken">
      <video
        ref={video}
        poster={film.poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={`${name}: ${instruction}`}
        onLoadedMetadata={(e) => setLength(e.currentTarget.duration || film.seconds)}
        onTimeUpdate={(e) => setAt(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        className="size-full object-cover"
      >
        {film.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      {/* What this footage is. A drawn stand-in says so plainly, so nobody takes it for a recording. */}
      {(film.kind === 'illustration' || film.credit) && (
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {film.kind === 'illustration' ? 'Drawn movement · film to follow' : film.credit}
        </span>
      )}

      {!started ? (
        <button
          type="button"
          onClick={play}
          aria-label={`Play the ${name.toLowerCase()} demonstration`}
          className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-ink/35 to-ink/0 to-50% focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-surface/95 text-accent shadow-card backdrop-blur-sm">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden />
          </span>
          <span className="absolute right-3 bottom-3 rounded-full bg-ink/55 px-2 py-0.5 text-[12px] font-medium text-white tabular-nums backdrop-blur-sm">
            {clock(film.seconds)}
          </span>
        </button>
      ) : (
        // Enough control to study a movement: stop it where you want it, scrub back, hear it, fill the screen.
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-linear-to-t from-ink/65 to-ink/0 px-3 pt-8 pb-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause the demonstration' : 'Play the demonstration'}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            {playing ? <Pause className="size-4 fill-current" aria-hidden /> : <Play className="ml-0.5 size-4 fill-current" aria-hidden />}
          </button>
          <input
            type="range"
            min={0}
            max={Math.max(length, 0.1)}
            step={0.05}
            value={at}
            aria-label="Position in the demonstration"
            aria-valuetext={`${clock(at)} of ${clock(length)}`}
            onChange={(e) => seek(Number(e.target.value))}
            style={{ '--fill': `${(at / Math.max(length, 0.1)) * 100}%` } as React.CSSProperties}
            className="video-scrubber min-w-0 flex-1"
          />
          <span className="shrink-0 text-[12px] font-medium text-white tabular-nums">{clock(length - at)}</span>
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute the demonstration' : 'Mute the demonstration'}
            aria-pressed={!muted}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            {muted ? <VolumeX className="size-[18px]" strokeWidth={2} aria-hidden /> : <Volume2 className="size-[18px]" strokeWidth={2} aria-hidden />}
          </button>
          <button
            type="button"
            onClick={fullscreen}
            aria-label="Show the demonstration full screen"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            <Maximize2 className="size-[18px]" strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
