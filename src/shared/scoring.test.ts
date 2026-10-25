import { clearScores, getBestPercent, getScores, saveScore } from './scoring'

describe('scoring', () => {
  beforeEach(() => clearScores())

  it('starts with no scores', () => {
    expect(getScores()).toEqual([])
    expect(getBestPercent('log-analysis')).toBeNull()
  })

  it('saves and returns a score', () => {
    saveScore('log-analysis', 8, 10)
    const scores = getScores()
    expect(scores).toHaveLength(1)
    expect(scores[0]).toMatchObject({ moduleId: 'log-analysis', score: 8, maxScore: 10 })
  })

  it('reports the best percentage for a module', () => {
    saveScore('port-protocol', 5, 10)
    saveScore('port-protocol', 9, 10)
    saveScore('link-analyzer', 1, 4)
    expect(getBestPercent('port-protocol')).toBe(90)
    expect(getBestPercent('link-analyzer')).toBe(25)
  })

  it('rejects impossible scores', () => {
    expect(() => saveScore('incident-response', 11, 10)).toThrow()
    expect(() => saveScore('incident-response', -1, 10)).toThrow()
    expect(() => saveScore('incident-response', 0, 0)).toThrow()
  })
})
