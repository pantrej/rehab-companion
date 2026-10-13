import type { DayState } from '../data/days'

// One semantic treatment per day state, used as soft tints and small indicators, never as floods.
// `tint` is a solid colour so the hero's wave can flow seamlessly into the plan card.
export const dayTheme: Record<DayState, { tint: string; label: string; line: string }> = {
  // Active: the saturated purple carries the action; the card is a soft lavender.
  active: { tint: '#f0ebfb', label: 'text-accent', line: 'stroke-accent' },
  // On track and done.
  completed: { tint: '#eaf2ec', label: 'text-positive', line: 'stroke-positive' },
  // Upcoming: informational, warm neutral.
  upcoming: { tint: '#f7efe5', label: 'text-[#8a5f2e]', line: 'stroke-accent' },
  // Rest: intentional recovery, not a finished task.
  rest: { tint: '#e8eff8', label: 'text-rest', line: 'stroke-rest' },
  // Needs attention: restrained coral, not an alarm.
  attention: { tint: '#fbebe8', label: 'text-concern', line: 'stroke-concern' },
  // A session that didn't happen: plain neutral, so a missed day is stated, never scolded.
  missed: { tint: '#f1eee8', label: 'text-ink-soft', line: 'stroke-ink-faint' },
}
