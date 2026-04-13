import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateRange,
  formatPrice,
  levelColor,
  statusColor,
} from '../../utils/format'

describe('formatDate', () => {
  it('returns a formatted date string for a valid ISO date', () => {
    const result = formatDate('2025-09-01')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a dash for null input', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns a dash for undefined input', () => {
    expect(formatDate(undefined)).toBe('—')
  })
})

describe('formatDateRange', () => {
  it('returns a dash when start is missing', () => {
    expect(formatDateRange(null, null)).toBe('—')
  })

  it('returns a string for valid start and end dates', () => {
    const result = formatDateRange('2025-09-01', '2025-09-05')
    expect(typeof result).toBe('string')
    expect(result).toContain('2025')
  })

  it('handles same start and end date', () => {
    const result = formatDateRange('2025-09-01', '2025-09-01')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatPrice', () => {
  it('returns Free for zero price', () => {
    expect(formatPrice(0)).toBe('Free')
  })

  it('returns Free for null price', () => {
    expect(formatPrice(null)).toBe('Free')
  })

  it('returns a formatted price string for a positive number', () => {
    const result = formatPrice(1000)
    expect(typeof result).toBe('string')
    expect(result).toContain('1')
  })
})

describe('levelColor', () => {
  it('returns green for beginner', () => {
    expect(levelColor('beginner')).toBe('green')
  })

  it('returns amber for intermediate', () => {
    expect(levelColor('intermediate')).toBe('amber')
  })

  it('returns red for advanced', () => {
    expect(levelColor('advanced')).toBe('red')
  })

  it('returns gray for unknown level', () => {
    expect(levelColor('unknown')).toBe('gray')
  })
})

describe('statusColor', () => {
  it('returns indigo for upcoming', () => {
    expect(statusColor('upcoming')).toBe('indigo')
  })

  it('returns green for ongoing', () => {
    expect(statusColor('ongoing')).toBe('green')
  })

  it('returns gray for completed', () => {
    expect(statusColor('completed')).toBe('gray')
  })

  it('returns red for cancelled', () => {
    expect(statusColor('cancelled')).toBe('red')
  })

  it('returns gray for unknown status', () => {
    expect(statusColor('other')).toBe('gray')
  })
})
