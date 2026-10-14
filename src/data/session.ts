import kneeMp4 from '../assets/demos/knee-extension.mp4'
import kneePoster from '../assets/demos/knee-extension.webp'
import kneeWebm from '../assets/demos/knee-extension.webm'
import calfMp4 from '../assets/demos/calf-raise.mp4'
import calfPoster from '../assets/demos/calf-raise.webp'
import calfWebm from '../assets/demos/calf-raise.webm'
import squatMp4 from '../assets/demos/squat.mp4'
import squatPoster from '../assets/demos/squat.webp'
import squatWebm from '../assets/demos/squat.webm'
import hipMp4 from '../assets/demos/hip-abduction.mp4'
import hipPoster from '../assets/demos/hip-abduction.webp'
import hipWebm from '../assets/demos/hip-abduction.webm'
import type { ExerciseFilm } from '../components/ExerciseVideo'
import type { Exercise } from '../types/session'

// Every exercise shows its own movement, never another's. These clips are drawn stand-ins, rendered from
// the movement each exercise actually asks for, and the screen says so on the frame. Replacing one with
// the clinic's own recording is a file swap: keep the shape below, set `kind: 'film'`, and add a credit
// where the footage asks for one. Two sources each, because iOS needs H.264 MP4 and the rest take WebM.
const film = (webm: string, mp4: string, poster: string): ExerciseFilm => ({
  sources: [
    { src: webm, type: 'video/webm' },
    { src: mp4, type: 'video/mp4' },
  ],
  poster,
  seconds: 2.8,
  kind: 'illustration',
})

// Today's session, as the plan promises it on Home: four exercises, Mobility + Strength, about 25 minutes.
// They run seated first and standing after, which is how a home programme after a spinal injury is
// usually ordered: the easiest position to control comes first, and the leg is warm before it carries
// weight. Each one is its own movement, with its own demonstration and its own cues.
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
    movement: 'knee-extension',
    film: film(kneeWebm, kneeMp4, kneePoster),
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
    movement: 'calf-raise',
    film: film(calfWebm, calfMp4, calfPoster),
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
    movement: 'squat',
    film: film(squatWebm, squatMp4, squatPoster),
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
    movement: 'hip-abduction',
    film: film(hipWebm, hipMp4, hipPoster),
  },
]

export const exerciseCount = sessionExercises.length
