import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWorkshops, useWorkshop } from '../../hooks/useWorkshops'

const mockWorkshop = {
  id: 1,
  title: 'Test Workshop',
  description: 'A test workshop',
  price: '500.00',
  status: 'upcoming',
  level: 'beginner',
}

vi.mock('../../api/client', () => ({
  api: {
    workshops: {
      list: vi.fn(),
      detail: vi.fn(),
    },
  },
}))

import { api } from '../../api/client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useWorkshops', () => {
  it('returns loading true initially', () => {
    api.workshops.list.mockResolvedValue({ results: [], count: 0 })
    const { result } = renderHook(() => useWorkshops({}))
    expect(result.current.loading).toBe(true)
  })

  it('returns workshops after successful fetch', async () => {
    api.workshops.list.mockResolvedValue({ results: [mockWorkshop], count: 1 })
    const { result } = renderHook(() => useWorkshops({}))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.workshops).toHaveLength(1)
    expect(result.current.workshops[0].title).toBe('Test Workshop')
  })

  it('returns error on fetch failure', async () => {
    api.workshops.list.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useWorkshops({}))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.workshops).toHaveLength(0)
  })
})

describe('useWorkshop', () => {
  it('returns loading true initially when id is provided', () => {
    api.workshops.detail.mockResolvedValue(mockWorkshop)
    const { result } = renderHook(() => useWorkshop(1))
    expect(result.current.loading).toBe(true)
  })

  it('returns workshop detail after successful fetch', async () => {
    api.workshops.detail.mockResolvedValue(mockWorkshop)
    const { result } = renderHook(() => useWorkshop(1))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.workshop).not.toBeNull()
    expect(result.current.workshop.id).toBe(1)
  })

  it('returns error when fetch fails', async () => {
    api.workshops.detail.mockRejectedValue(new Error('Not found'))
    const { result } = renderHook(() => useWorkshop(1))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Not found')
  })
})
