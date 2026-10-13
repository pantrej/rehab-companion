import type { SignalTone } from '../types/recovery'

// Text colour for a status word. Neutral stays ink so colour only appears when it means something.
export const toneText: Record<SignalTone, string> = {
  positive: 'text-positive',
  neutral: 'text-ink',
  attention: 'text-attention',
}

// A small dot with a soft halo, for headline statuses.
export const toneDot: Record<SignalTone, string> = {
  positive: 'bg-positive ring-positive-soft',
  neutral: 'bg-ink-faint ring-line',
  attention: 'bg-attention ring-attention-soft',
}

// A plain status dot, for rows of signals.
export const toneSolid: Record<SignalTone, string> = {
  positive: 'bg-positive',
  neutral: 'bg-ink-faint',
  attention: 'bg-attention',
}

// Status words in rows stay ink unless they need attention; green is kept for the overall verdict,
// so it keeps its meaning.
export const toneStatusText: Record<SignalTone, string> = {
  positive: 'text-ink',
  neutral: 'text-ink',
  attention: 'text-attention',
}
