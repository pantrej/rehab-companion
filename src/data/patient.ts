import { TODAY, daysBetween } from './calendar'

// Mock patient record for connected care. These clinical details come from the professional's records,
// so the app shows them; it never derives or diagnoses them.
const injuryDate = new Date(2026, 7, 18)

export const patientRecord = {
  age: 34,
  diagnosis: 'Thoracic spinal fracture',
  injuryDate: '18 August 2026',
  timeSinceInjury: `${Math.floor(daysBetween(injuryDate, TODAY) / 7)} weeks`,
  recoveryStage: 'Home rehabilitation',
  restrictions: 'Avoid high-impact loading',
}
