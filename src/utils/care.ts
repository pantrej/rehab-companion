import { useState } from 'react'
import { professional } from '../data/professional'
import type { CareState } from '../types/care'
import type { OnboardingAnswers } from '../types/onboarding'
import { readStored, storageKeys, writeStored } from './storage'

export function readCare(): CareState | null {
  const care = readStored<CareState | null>(storageKeys.care, null)
  if (care) return care
  // Setups saved before care modes existed were independent.
  const legacy = readStored<OnboardingAnswers | null>(storageKeys.setup, null)
  return legacy ? { mode: 'independent', setup: legacy } : null
}

export function saveCare(care: CareState) {
  writeStored(storageKeys.care, care)
}

// The care state for a screen. The professional exists only in connected care, so screens that
// check `professional` can never show an invented one.
export function useCare() {
  const [care, setCare] = useState(readCare)
  const update = (patch: Partial<CareState>) => {
    if (!care) return
    const next = { ...care, ...patch }
    saveCare(next)
    setCare(next)
  }
  return {
    care,
    connected: care?.mode === 'connected',
    professional: care?.mode === 'connected' ? professional : undefined,
    update,
  }
}

// "Anna Novak" in connected care; a neutral phrase otherwise, so copy never names a professional who isn't there.
export function professionalPhrase(name?: string) {
  return name ?? 'a rehabilitation professional'
}
