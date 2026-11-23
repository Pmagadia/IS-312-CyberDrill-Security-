
import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it } from '@jest/globals'
import LogAnalysis from './LogAnalysis'
import { clearScores, getModuleStats } from '../../shared/scoring'

beforeEach(() => {
  clearScores()
})

describe('Log Analysis Challenge', () => {
  it('renders all eight log entries', () => {
    render(<LogAnalysis />)

    expect(screen.getAllByRole('checkbox')).toHaveLength(8)
    expect(screen.getByText('Security Event Log')).toBeTruthy()
  })

  it('validates an empty IP address', () => {
    render(<LogAnalysis />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }))

    expect(screen.getByRole('alert').textContent).toContain(
      'Enter the suspected attacker IP address.',
    )
  })

  it('rejects an invalid IP address', () => {
    render(<LogAnalysis />)

    fireEvent.change(screen.getByLabelText('Suspected attacker IP address'), {
      target: { value: '999.999.999.999' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }))

    expect(screen.getByRole('alert').textContent).toContain(
      'Enter a valid IPv4 address',
    )
  })

  it('awards 10 points for a completely correct analysis', () => {
    render(<LogAnalysis />)

    const checkboxes = screen.getAllByRole('checkbox')

    ;[1, 2, 4].forEach((index) => {
      fireEvent.click(checkboxes[index])
    })

    fireEvent.change(screen.getByLabelText('Suspected attacker IP address'), {
      target: { value: '203.0.113.77' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }))

    expect(screen.getByText('10 / 10')).toBeTruthy()
    expect(screen.getByText('100%')).toBeTruthy()
  })

  it('saves the completed score to shared scoring storage', () => {
    render(<LogAnalysis />)

    const checkboxes = screen.getAllByRole('checkbox')

    ;[1, 2, 4].forEach((index) => {
      fireEvent.click(checkboxes[index])
    })

    fireEvent.change(screen.getByLabelText('Suspected attacker IP address'), {
      target: { value: '203.0.113.77' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }))

    expect(getModuleStats('log-analysis')?.bestPercent).toBe(100)
    expect(getModuleStats('log-analysis')?.attempts).toBe(1)
  })

  it('allows the user to restart the challenge', () => {
    render(<LogAnalysis />)

    fireEvent.change(screen.getByLabelText('Suspected attacker IP address'), {
      target: { value: '203.0.113.77' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit Analysis' }))
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    const checkboxes = screen.getAllByRole('checkbox')

    expect(
      checkboxes.every(
        (checkbox) => !(checkbox as HTMLInputElement).checked,
      ),
    ).toBe(true)

    expect(
      (screen.getByLabelText('Suspected attacker IP address') as HTMLInputElement)
        .value,
    ).toBe('')

    expect(
      screen.getByRole('button', { name: 'Submit Analysis' }),
    ).toBeTruthy()
  })
})
