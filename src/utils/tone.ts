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
