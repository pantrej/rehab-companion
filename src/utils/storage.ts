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
  account: 'rehab.account',
  signedIn: 'rehab.signedIn',
  care: 'rehab.care',
  // True while the saved setup was answered before any account, so the next new account adopts it.
  pendingSetup: 'rehab.pendingSetup',
  // Older independent-only setups; read once and migrated into `care`.
  setup: 'rehab.setup',
  lastCheckIn: 'rehab.lastCheckIn',
  appointmentNote: 'rehab.appointmentNote',
  // How rest days felt, by date.
  restFeelings: 'rehab.restFeelings',
}

// A check-in saved today (on this device) means today's session is complete. Every screen that builds
// day data reads it the same way, so Home, the calendar and Progress never disagree about today.
export function checkedInToday() {
  const at = readStored<{ at?: string } | null>(storageKeys.lastCheckIn, null)?.at
  return !!at && new Date(at).toDateString() === new Date().toDateString()
}
