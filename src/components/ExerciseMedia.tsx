import { useState } from 'react'

// A photograph of one exercise being performed. It shows that exercise and nothing else: a person doing a
// related activity, or the same body part doing something different, teaches the wrong movement, which is
// worse than teaching none. The picture is the instruction, so nothing is laid over it.
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

// The demonstration frame: 4:3, the same size and corner as everything else on the screen. There are no
// controls, because there is nothing to play — a still that pretends to be a film is a promise the screen
// can't keep.
export function ExerciseMedia({ name, photo }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-card bg-sunken px-8 text-center text-caption text-ink-soft">
        {name}
      </div>
    )
  }

  return (
    <img
      src={photo.src}
      alt={`${name}: ${photo.shows}`}
      width={1200}
      height={900}
      onError={() => setFailed(true)}
      className="aspect-[4/3] w-full rounded-card bg-sunken object-cover"
    />
  )
}
