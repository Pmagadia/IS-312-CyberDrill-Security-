/**
 * Shared scoring system used by every CyberDrill module.
 * Owner: Peterson. FIRST DRAFT: the function names and types below are the contract
 * other modules code against, so discuss changes with the team before renaming anything.
 *
 * Usage from a module when the user finishes an activity:
 *   saveScore('log-analysis', 8, 10)
 */

export type ModuleId = 'incident-response' | 'port-protocol' | 'log-analysis' | 'link-analyzer'

export interface ScoreRecord {
  moduleId: ModuleId
  /** Points earned in this attempt. */
  score: number
  /** Highest possible points for this attempt. */
  maxScore: number
  /** When the attempt finished, as an ISO date string. */
  completedAt: string
}

const STORAGE_KEY = 'cyberdrill-scores'

/** Returns every saved attempt, oldest first. Returns [] if nothing is saved or storage is blocked. */
export function getScores(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : []
  } catch {
    return []
  }
}

/** Saves one finished attempt and returns the record that was saved. */
export function saveScore(moduleId: ModuleId, score: number, maxScore: number): ScoreRecord {
  if (maxScore <= 0 || score < 0 || score > maxScore) {
    throw new Error('score must be between 0 and maxScore, and maxScore must be above 0')
  }
  const record: ScoreRecord = { moduleId, score, maxScore, completedAt: new Date().toISOString() }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...getScores(), record]))
  } catch {
    // Storage can be blocked (for example in private browsing). The app keeps working without saving.
  }
  return record
}

/** Best result for one module as a whole percentage (0-100), or null if it has not been attempted. */
export function getBestPercent(moduleId: ModuleId): number | null {
  const attempts = getScores().filter((r) => r.moduleId === moduleId)
  if (attempts.length === 0) return null
  return Math.max(...attempts.map((r) => Math.round((r.score / r.maxScore) * 100)))
}

/** Deletes all saved progress. */
export function clearScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clear if storage is blocked.
  }
}
