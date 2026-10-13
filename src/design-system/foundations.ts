// What the design system page shows about the foundations. Values mirror src/styles/index.css,
// which is the source of truth; the page reads the live CSS variables to stay honest.

export type Swatch = { name: string; token: string; usage: string; onDark?: boolean }

export const palette: { group: string; note: string; swatches: Swatch[] }[] = [
  {
    group: 'Surfaces',
    note: 'A warm canvas with three levels on top: raised, featured, quiet.',
    swatches: [
      { name: 'Canvas', token: 'canvas', usage: 'Behind everything' },
      { name: 'Surface', token: 'surface', usage: 'Raised cards and sheets' },
      { name: 'Featured', token: 'featured', usage: 'The one focal card per screen' },
      { name: 'Subtle', token: 'subtle', usage: 'Supporting, recessive detail' },
      { name: 'Line', token: 'line', usage: 'Dividers inside a card' },
    ],
  },
  {
    group: 'Ink',
    note: 'Near-black for reading, two softer steps for context. Never pure black.',
    swatches: [
      { name: 'Ink', token: 'ink', usage: 'Headings and body', onDark: true },
      { name: 'Ink soft', token: 'ink-soft', usage: 'Supporting text', onDark: true },
      { name: 'Ink faint', token: 'ink-faint', usage: 'Captions, hints', onDark: true },
    ],
  },
  {
    group: 'Accent',
    note: 'One muted indigo for action and orientation. It never signals health.',
    swatches: [
      { name: 'Accent', token: 'accent', usage: 'Primary action, active tab', onDark: true },
      { name: 'Accent strong', token: 'accent-strong', usage: 'Pressed and hover', onDark: true },
      { name: 'Accent soft', token: 'accent-soft', usage: 'Secondary action, selection' },
    ],
  },
  {
    group: 'Signals',
    note: 'Meaning only. Green for the overall verdict; amber for caution and safety.',
    swatches: [
      { name: 'Positive', token: 'positive', usage: '“Appears on track”', onDark: true },
      { name: 'Positive soft', token: 'positive-soft', usage: 'Usual range, verdict halo' },
      { name: 'Attention', token: 'attention', usage: '“Worth checking”, safety', onDark: true },
      { name: 'Attention soft', token: 'attention-soft', usage: 'Caution notes' },
    ],
  },
]

export const typeScale = [
  { name: 'Display', token: 'text-display', spec: '40 / 44 · Semibold', sample: '3 × 12', usage: 'The one hero number' },
  { name: 'Title', token: 'text-title', spec: '26 / 31 · Semibold', sample: 'Appears on track', usage: 'Screen titles, verdicts' },
  { name: 'Section', token: 'text-section', spec: '18 / 25 · Semibold', sample: 'What changed', usage: 'Section headings' },
  { name: 'Body', token: 'text-body', spec: '16 / 25 · Regular', sample: 'Pain is holding steady while your sessions are getting easier.', usage: 'Reading text' },
  { name: 'Caption', token: 'text-caption', spec: '13 / 18 · Medium', sample: 'Based on 3 check-ins since 3 October', usage: 'Labels, time frames' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40]

export const radii = [
  { name: 'Control', value: '16 px', className: 'rounded-control', usage: 'Inputs, options' },
  { name: 'Card', value: '20 px', className: 'rounded-card', usage: 'Cards, sheets, media' },
  { name: 'Pill', value: 'Full', className: 'rounded-full', usage: 'Buttons, tabs, chips' },
]

export const elevation = [
  { name: 'Flat', className: 'bg-subtle', usage: 'Quiet surfaces sit in the canvas' },
  { name: 'Card', className: 'bg-surface shadow-card', usage: 'Raised just enough to group' },
  { name: 'Raised', className: 'bg-surface shadow-raised', usage: 'Sheets and the tab bar' },
]

export const principles = [
  { title: 'Calm over energetic', text: 'Soft surfaces and restrained colour; nothing competes with the next step.' },
  { title: 'Guidance over dashboards', text: 'Every screen answers what to do now, not just what happened.' },
  { title: 'Interpretation over raw metrics', text: 'Numbers arrive with what they mean and how sure we are.' },
  { title: 'Human over clinical', text: 'Plain language, never diagnosis. The professional stays in charge.' },
  { title: 'Confidence over gamification', text: 'No points, streaks or rings. Progress means recovery.' },
]
