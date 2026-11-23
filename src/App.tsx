import {useState} from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import IncidentResponse from './modules/incident-response/IncidentResponse'
import PortProtocol from './modules/port-protocol/PortProtocol'
import LogAnalysis from './modules/log-analysis/LogAnalysis'
import LinkAnalyzer from './modules/link-analyzer/LinkAnalyzer'
import { MODULES } from './shared/modules'


/**
 * App shell: header, navigation and page routes.
 * Owner: Karen. This is a starting point; restyle and restructure it freely.
 */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
  )
  
  return (
    <div className="app" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="site-header">
        <NavLink to="/" className="brand">
          CyberDrill
        </NavLink>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
          aria-pressed={darkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <nav 
          id="main-navigation"
          className={menuOpen ? 'nav-open' : ''}
          aria-label="Main"
          >
          <ul className="nav-list">
            {MODULES.map((m) => (
              <li key={m.id}>
                <NavLink 
                  to={m.path}
                  onClick={() => setMenuOpen (false)}
                >
                  {m.name}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink 
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/incident-response" element={<IncidentResponse />} />
          <Route path="/port-protocol" element={<PortProtocol />} />
          <Route path="/log-analysis" element={<LogAnalysis />} />
          <Route path="/link-analyzer" element={<LinkAnalyzer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>

      <footer className="site-footer">
        Practice content is written by the team from the official CompTIA Security+ exam objectives.
      </footer>
    </div>
  )
}
