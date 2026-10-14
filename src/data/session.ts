import calfRaise from '../assets/demos/seated-calf-raise.webp'
import hipAbduction from '../assets/demos/standing-hip-abduction.webp'
import kneeExtension from '../assets/demos/seated-knee-extension.webp'
import supportedSquat from '../assets/demos/supported-squat.webp'
import type { Exercise } from '../types/session'

// Each exercise's demonstration shows that exercise being performed — not a related activity, not a
// photograph of rehabilitation in general. All four are photographs for now: the same person, the same
// room, the same chair, so the session reads as one set of instructions rather than four found pictures.
//
// A filmed demonstration replaces any of them when one exists. The player for that — our own controls,
// scrubber, mute and fullscreen over a WebM/MP4 pair — is in this branch's history at 2f33d27, and goes
// back in with the clip rather than waiting around for it.

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
    photo: {
      src: kneeExtension,
      shows: 'seated with the back supported, one knee straightened until the lower leg is level',
    },
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
    photo: {
      src: calfRaise,
      shows: 'seated tall with both feet flat on the floor, the position the heel lifts from',
    },
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
    photo: {
      src: supportedSquat,
      shows: 'standing behind the chair with both hands on its back, hips lowered into a shallow squat',
    },
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
    photo: {
      src: hipAbduction,
      shows: 'standing with one hand on the chair, the far leg lifted out to the side',
    },
  },
]

export const exerciseCount = sessionExercises.length
