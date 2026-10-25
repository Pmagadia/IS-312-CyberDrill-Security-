import { getBestPercent } from '../shared/scoring'
import { MODULES } from '../shared/modules'

/**
 * Progress dashboard. Owner: Roland.
 * Starting point: lists the best score per module. Add the chart and styling here.
 */
export default function Dashboard() {
  return (
    <section className="page">
      <h1>Your Progress</h1>
      <ul className="score-list">
        {MODULES.map((m) => {
          const best = getBestPercent(m.id)
          return (
            <li key={m.id}>
              <span>{m.name}</span>
              <strong>{best === null ? 'Not started' : `${best}%`}</strong>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
