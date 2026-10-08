import type { InsightSignal, RecoverySignal } from '../types/recovery'
import { recoveryOverall, recoverySignals } from './today'

const details: Record<RecoverySignal['id'], string> = {
  pain: 'Pain has remained between 2–3/10 across recent sessions.',
  mobility: 'You reported better movement in 3 consecutive check-ins.',
  difficulty: 'Average difficulty decreased from 7/10 to 5/10.',
}

// Interpretation stays tentative ("may", "appears"): it supports the professional plan, never diagnoses.
export const recoveryInsightScreen = {
  title: 'Your recovery',
  subtitle: 'Based on your recent sessions',
  overall: recoveryOverall,
  signals: recoverySignals.map((s): InsightSignal => ({ ...s, detail: details[s.id] })),
  noticed: 'Your exercises are becoming easier while your pain has remained stable.',
  meaning: 'Your current rehabilitation plan appears to be becoming easier to tolerate.',
  nextStep: {
    heading: 'What should I do next?',
    recommendation: 'Continue as planned',
    detail: 'No significant negative change has been detected in your recent recovery signals.',
  },
  safetyNote: 'This does not replace professional medical advice.',
}
