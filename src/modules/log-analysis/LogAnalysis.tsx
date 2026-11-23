/**
 * Log Analysis Challenge. Owner: Roland.
 * Simulated log files where the user flags suspicious lines, with a validated answer form.
 * When the user finishes an attempt, record it with saveScore() from '../../shared/scoring'.
 */

import { useState, type FormEvent } from 'react'
import { saveScore } from '../../shared/scoring'
import './LogAnalysis.css'

interface LogEntry {
  id: number
  timestamp: string
  source: string
  event: string
  details: string
  suspicious: boolean
  explanation: string
}

const LOGS: LogEntry[] = [
  {
    id: 1,
    timestamp: '2026-10-14 08:42:11',
    source: '192.168.1.24',
    event: 'LOGIN_SUCCESS',
    details: 'User: jsmith | Authentication successful',
    suspicious: false,
    explanation: 'A normal successful login from an internal workstation.',
  },
  {
    id: 2,
    timestamp: '2026-10-14 08:45:03',
    source: '203.0.113.77',
    event: 'LOGIN_FAILURE',
    details: 'User: admin | Invalid password',
    suspicious: true,
    explanation: 'An external IP attempting to access a privileged account.',
  },
  {
    id: 3,
    timestamp: '2026-10-14 08:45:08',
    source: '203.0.113.77',
    event: 'LOGIN_FAILURE',
    details: 'User: admin | Invalid password',
    suspicious: true,
    explanation: 'Repeated failed authentication attempts suggest a brute-force attack.',
  },
  {
    id: 4,
    timestamp: '2026-10-14 08:46:19',
    source: '10.0.0.15',
    event: 'FILE_ACCESS',
    details: 'User: mjones | Accessed shared project folder',
    suspicious: false,
    explanation: 'Routine access to an authorized shared resource.',
  },
  {
    id: 5,
    timestamp: '2026-10-14 08:49:32',
    source: '203.0.113.77',
    event: 'LOGIN_SUCCESS',
    details: 'User: admin | Authentication successful',
    suspicious: true,
    explanation: 'A successful login immediately following repeated failures is a strong compromise indicator.',
  },
  {
    id: 6,
    timestamp: '2026-10-14 08:51:04',
    source: '192.168.1.31',
    event: 'PASSWORD_CHANGE',
    details: 'User: abrown | Password updated through self-service portal',
    suspicious: false,
    explanation: 'A routine password change through the approved portal.',
  },
  {
    id: 7,
    timestamp: '2026-10-14 09:02:17',
    source: '10.0.0.22',
    event: 'VPN_CONNECTED',
    details: 'User: rlee | Corporate VPN connection established',
    suspicious: false,
    explanation: 'A normal VPN connection from an internal network.',
  },
  {
    id: 8,
    timestamp: '2026-10-14 09:07:45',
    source: '192.168.1.24',
    event: 'LOGOUT',
    details: 'User: jsmith | Session ended normally',
    suspicious: false,
    explanation: 'A normal user logout.',
  },
]

const ATTACKER_IP = '203.0.113.77'
const MAX_SCORE = LOGS.length + 2

function isValidIPv4(value: string): boolean {
  const parts = value.trim().split('.')
  return (
    parts.length === 4 &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255)
  )
}

export default function LogAnalysis() {
  const [selected, setSelected] = useState<number[]>([])
  const [attackerIP, setAttackerIP] = useState('')
  const [error, setError] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const toggleLog = (id: number) => {
    if (submitted) return
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const submitChallenge = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!attackerIP.trim()) {
      setError('Enter the suspected attacker IP address.')
      return
    }

    if (!isValidIPv4(attackerIP)) {
      setError('Enter a valid IPv4 address, such as 203.0.113.77.')
      return
    }

    const correctSelections = LOGS.filter(
      (log) => log.suspicious === selected.includes(log.id),
    ).length

    const ipPoints = attackerIP.trim() === ATTACKER_IP ? 2 : 0
    const finalScore = correctSelections + ipPoints

    setScore(finalScore)
    setSubmitted(true)
    setError('')
    saveScore('log-analysis', finalScore, MAX_SCORE)
  }

  const restart = () => {
    setSelected([])
    setAttackerIP('')
    setError('')
    setScore(null)
    setSubmitted(false)
  }

  return (
    <section className="page la">
      <p className="la-eyebrow">Security+ Practice</p>
      <h1>Log Analysis Challenge</h1>
      <p className="la-intro">
        Review the security events below. Identify suspicious activity and
        determine which IP address is responsible.
      </p>

      <div className="la-instructions">
        <strong>Scenario</strong>
        <p>
          A system administrator noticed unusual authentication activity on
          the company network. Review the logs and investigate the potential
          compromise.
        </p>
      </div>

      <form onSubmit={submitChallenge}>
        <div className="la-section-heading">
          <h2>Security Event Log</h2>
          <span>{selected.length} entries flagged</span>
        </div>

        <p className="la-hint">
          Select every suspicious event. Leave normal activity unselected.
        </p>

        <div className="la-log-list">
          {LOGS.map((log) => {
            const isSelected = selected.includes(log.id)

            return (
              <label
                key={log.id}
                className={`la-log ${isSelected ? 'is-selected' : ''} ${
                  submitted
                    ? log.suspicious
                      ? 'is-correct'
                      : isSelected
                        ? 'is-wrong'
                        : ''
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleLog(log.id)}
                  disabled={submitted}
                />
                <span className="la-log-content">
                  <span className="la-log-meta">
                    <time>{log.timestamp}</time>
                    <strong>{log.event}</strong>
                  </span>
                  <code>{log.source}</code>
                  <span>{log.details}</span>
                  {submitted && (
                    <span className="la-explanation">
                      {log.suspicious ? 'Suspicious' : 'Normal'} — {log.explanation}
                    </span>
                  )}
                </span>
              </label>
            )
          })}
        </div>

        <div className="la-answer">
          <label htmlFor="attacker-ip">Suspected attacker IP address</label>
          <input
            id="attacker-ip"
            type="text"
            value={attackerIP}
            onChange={(event) => setAttackerIP(event.target.value)}
            placeholder="Example: 203.0.113.77"
            disabled={submitted}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'ip-error' : undefined}
          />
          {error && (
            <p id="ip-error" className="la-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {!submitted ? (
          <button className="la-button" type="submit">
            Submit Analysis
          </button>
        ) : (
          <section className="la-results" aria-live="polite">
            <p className="la-eyebrow">Challenge complete</p>
            <h2>Your Results</h2>
            <p className="la-score">
              {score} / {MAX_SCORE}
            </p>
            <p className="la-percent">
              {Math.round(((score ?? 0) / MAX_SCORE) * 100)}%
            </p>
            <p>
              {attackerIP.trim() === ATTACKER_IP
                ? 'Correct attacker IP address.'
                : `The correct attacker IP was ${ATTACKER_IP}.`}
            </p>
            <p>
              Each correctly classified log entry earned one point.
              Identifying the attacker IP earned two additional points.
            </p>
            <button className="la-button" type="button" onClick={restart}>
              Try Again
            </button>
          </section>
        )}
      </form>
    </section>
  )
}
