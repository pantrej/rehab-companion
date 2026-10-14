import { Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// A photograph of one exercise being performed. It shows that exercise and nothing else: a person doing a
// related activity, or the same body part doing something different, teaches the wrong movement, which is
// worse than teaching none. The picture is the instruction, so nothing is laid over it but the control.
export type ExercisePhoto = {
  src: string
  // The position caught in the frame, said in words for anyone who can't see it. The instruction below the
  // frame says what the movement is; this says what this picture shows of it.
  shows: string
}

type Props = {
  name: string
  photo: ExercisePhoto
}

// The demonstration opened to fill the frame, for studying a position: the same picture, as large as the
// screen allows. Escape and the backdrop close it, like every other layer in the app.
function FullFrame({ name, photo, onClose }: { name: string; photo: ExercisePhoto; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-center">
      <div className="absolute inset-0 bg-ink/80" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${name} demonstration`}
        tabIndex={-1}
        className="relative px-4 outline-none"
      >
        <img src={photo.src} alt={`${name}: ${photo.shows}`} className="w-full rounded-card" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the demonstration"
          className="absolute top-3 right-7 flex size-10 items-center justify-center rounded-[20px] bg-ink/55 text-white backdrop-blur-sm"
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>
        <p className="mt-3 text-center text-caption text-white/70">{photo.shows}</p>
      </div>
    </div>
  )
}

// The demonstration frame: 4:3, the same size and corner as everything else on the screen. The control
// opens the picture full screen rather than playing anything — there is no film yet, and a control that
// does nothing is a promise the screen can't keep.
export function ExerciseMedia({ name, photo }: Props) {
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)

  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-card bg-sunken px-8 text-center text-caption text-ink-soft">
        {name}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`See the ${name.toLowerCase()} demonstration full screen`}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <img
          src={photo.src}
          alt={`${name}: ${photo.shows}`}
          width={1200}
          height={900}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-ink/35 to-ink/0 to-50%">
          <span className="flex size-16 items-center justify-center rounded-[32px] bg-surface/95 text-accent shadow-card backdrop-blur-sm">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden />
          </span>
        </span>
      </button>
      {open && <FullFrame name={name} photo={photo} onClose={() => setOpen(false)} />}
    </>
  )
}
