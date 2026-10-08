// Prototype persistence: values live in this browser only. Storage can be unavailable (private mode,
// blocked site data), so every access is guarded and falls back.

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // The prototype carries on without persistence.
  }
}

export const storageKeys = {
  care: 'rehab.care',
  // Older independent-only setups; read once and migrated into `care`.
  setup: 'rehab.setup',
  lastCheckIn: 'rehab.lastCheckIn',
  appointmentNote: 'rehab.appointmentNote',
}
