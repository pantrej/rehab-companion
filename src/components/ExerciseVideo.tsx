import { Clapperboard, Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState } from 'react'

// A demonstration of one exercise, or the absence of one. A demonstration shows that exercise being
// performed: not a related activity, not the same body part doing something else, not a photograph of
// rehabilitation in general. Nothing else belongs in this frame — a person doing the wrong movement
// teaches the wrong movement, and an exercise screen that shows one is worse than one that shows none.
export type ExerciseFilm =
  | {
      pending?: false
      // Best source first; a browser takes the first it can play. WebM for most, H.264 MP4 for iOS.
      sources: { src: string; type: string }[]
      // A frame from the demonstration itself.
      poster: string
      // How long it runs, in seconds, for the indicator on the still.
      seconds: number
      // Shown over the footage where its licence or its clinic asks to be credited.
      credit?: string
    }
  | {
      // No demonstration of this exercise exists yet. The frame says so and offers nothing to play.
      pending: true
      // What has to be filmed, so whoever records it knows exactly what the shot is.
      shot: string
    }

type Props = {
  name: string
  // What the movement is, in words, for anyone who can't see the demonstration.
  instruction: string
  film: ExerciseFilm
}

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

// The demonstration of one exercise: a still of the movement, a play control, and the clip itself in
// place. Nothing navigates away, and nothing covers the frame with a label — the picture is the
// instruction, so it is the thing that is shown.
export function ExerciseVideo({ name, instruction, film }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [at, setAt] = useState(0)
  const [failed, setFailed] = useState(false)
  // The clip's own length once it is known; until then, the length the exercise says it is.
  const [length, setLength] = useState(film.pending ? 0 : film.seconds)

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

  // A device that can't play the clip keeps the frame it was going to play: the still, held.
  // Nothing to show yet: say that, rather than filling the frame with something else.
  if (film.pending) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-card bg-sunken px-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface text-ink-soft shadow-card">
          <Clapperboard className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="text-[15px] font-medium text-ink">Demonstration film</span>
        <span className="text-caption leading-snug text-ink-soft">{name} · not yet recorded</span>
      </div>
    )
  }

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${name}: ${instruction}`}
        style={{ backgroundImage: `url(${film.poster})` }}
        className="aspect-[4/3] w-full overflow-hidden rounded-card bg-sunken bg-cover bg-center"
      />
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
        onLoadedMetadata={(e) => setLength(e.currentTarget.duration || length)}
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

      {film.credit && (
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {film.credit}
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
            {clock(length)}
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
