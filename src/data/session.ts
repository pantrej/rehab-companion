import type { ExerciseFilm } from '../components/ExerciseVideo'
import type { Exercise } from '../types/session'

// Each exercise's demonstration must show that exercise being performed — not a related activity, not a
// photograph of rehabilitation in general.
//
// Three of them are published recordings, played from where they live: the still and the play control are
// ours, and tapping hands over to the publisher's own player on their own domain. Nothing is downloaded,
// re-hosted or re-cut, so nobody's licence is strained — and the movement shown is the movement
// prescribed, which is the whole point of the frame.
//
// The clinic's own recording replaces any of them: put the files in src/assets/demos as
// <exercise-name>.webm, .mp4 and .webp (a frame from the clip), import them, and use
//   film: { kind: 'file', sources: [{ src: webm, type: 'video/webm' }, { src: mp4, type: 'video/mp4' }], poster, seconds }
// Two sources because iOS needs H.264 MP4 and everything else prefers WebM; 4:3, static camera, the whole
// working body in frame. Nothing in the screen or the player changes.
const published = (id: string, credit: string): ExerciseFilm => ({
  kind: 'youtube',
  id,
  source: `https://www.youtube.com/watch?v=${id}`,
  credit,
})

const pending = (shot: string): ExerciseFilm => ({ pending: true, shot })

// Today's session, as the plan promises it on Home: four exercises, Mobility + Strength, about 25 minutes.
// They run seated first and standing after, which is how a home programme after a spinal injury is
// usually ordered: the easiest position to control comes first, and the leg is warm before it carries
// weight.
export const sessionExercises: Exercise[] = [
  {
    name: 'Seated knee extension',
    sets: 3,
    reps: 10,
    equipment: 'Chair with back support',
    instruction:
      'Sit tall with both feet flat. Straighten one knee until your lower leg is level, hold for two seconds, then lower it slowly.',
    // Cues in the words a therapist uses while watching: what to keep, what to avoid, whose range to work in.
    formTips: [
      'Keep your back supported against the chair.',
      'Move slowly, without swinging the leg.',
      'Work within the range your plan sets.',
    ],
    // The reference for this one (youtube.com/watch?v=FsPB8BCvZCc) has playback on other sites disabled
    // by its owner, so embedding it shows YouTube's own error box rather than the movement.
    film: pending(
      'Sitting tall in a chair with back support, both feet flat. One knee straightens until the lower leg is level, holds, then lowers slowly. 3/4 side view, static camera, whole body in frame.',
    ),
  },
  {
    name: 'Seated calf raise',
    sets: 3,
    reps: 12,
    equipment: 'Medium resistance band',
    instruction:
      'Keep your foot flat and slowly raise your heel while maintaining control throughout the movement.',
    formTips: [
      'Keep the ball of your foot planted as the heel lifts.',
      'Raise and lower at the same steady speed.',
      'Keep the band’s tension even throughout.',
    ],
    film: published('BxfKOyI8sUg', 'Demonstration on YouTube'),
  },
  {
    name: 'Supported squat',
    sets: 3,
    reps: 8,
    equipment: 'Chair for support',
    instruction:
      'Stand behind the chair with your hands resting on it. Bend your knees and lower your hips a little way, keeping your back long, then press back up.',
    formTips: [
      'Rest your hands on the chair rather than pulling on it.',
      'Let your hips travel back as your knees bend.',
      'Lower only as far as your plan sets.',
    ],
    // The reference for this one (na.physitrack.com/home-exercise-video/supported-squat) is a page, not a
    // recording that can be played in place, so this frame waits for a demonstration it can show.
    film: pending(
      'Standing behind a chair, hands resting on its back. Knees bend and hips travel back into a shallow squat, then press back up to standing. 3/4 side view, static camera, head to feet in frame.',
    ),
  },
  {
    name: 'Standing hip abduction',
    sets: 3,
    reps: 10,
    equipment: 'Chair for support',
    instruction:
      'Stand tall, holding the chair for balance. Lift one leg out to the side without leaning, then lower it with control.',
    formTips: [
      'Hold the chair lightly, for balance rather than support.',
      'Lift the leg to the side without leaning away from it.',
      'Lower it under control rather than letting it drop.',
    ],
    film: published('tpt4OB1DPh0', 'Demonstration on YouTube'),
  },
]

export const exerciseCount = sessionExercises.length
