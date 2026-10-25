import { Link } from 'react-router-dom'
import { MODULES } from '../shared/modules'

export default function Home() {
  return (
    <section className="page">
      <h1>CyberDrill</h1>
      <p className="lead">Hands-on practice for the CompTIA Security+ exam. Pick a module to start.</p>
      <ul className="card-grid">
        {MODULES.map((m) => (
          <li key={m.id} className="card">
            <h2>
              <Link to={m.path}>{m.name}</Link>
            </h2>
            <p>{m.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
