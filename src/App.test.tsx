import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('shows a link to every module and the dashboard', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toHaveTextContent('Incident Response Simulator')
    expect(nav).toHaveTextContent('Port & Protocol Match')
    expect(nav).toHaveTextContent('Log Analysis Challenge')
    expect(nav).toHaveTextContent('Suspicious Link Analyzer')
    expect(nav).toHaveTextContent('Dashboard')
  })

  it('opens a module page from its address', () => {
    renderAt('/log-analysis')
    expect(screen.getByRole('heading', { level: 1, name: 'Log Analysis Challenge' })).toBeInTheDocument()
  })
})
