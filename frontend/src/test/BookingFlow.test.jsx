import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BookingFlow from '../../pages/BookingFlow'

vi.mock('../../hooks/useWorkshops', () => ({
  useWorkshop: () => ({
    workshop: {
      id: 1,
      title: 'Test Workshop',
      description: 'A test workshop',
      category: { name: 'Tech', icon: '' },
      instructor_name: 'Jane Doe',
      level: 'beginner',
      level_display: 'Beginner',
      status: 'upcoming',
      status_display: 'Upcoming',
      start_date: '2025-09-01',
      end_date: '2025-09-02',
      location: 'Pune',
      city: 'Pune',
      is_online: false,
      max_participants: 30,
      available_seats: 10,
      is_full: false,
      price: '1000.00',
      tag_list: [],
    },
    loading: false,
    error: null,
  }),
}))

vi.mock('../../api/client', () => ({
  api: {
    bookings: {
      create: vi.fn(),
    },
  },
}))

describe('BookingFlow', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/workshops/1/book']}>
        <Routes>
          <Route path="/workshops/:id/book" element={<BookingFlow />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Test Workshop')).toBeTruthy()
  })

  it('shows step 1 Details by default', () => {
    render(
      <MemoryRouter initialEntries={['/workshops/1/book']}>
        <Routes>
          <Route path="/workshops/:id/book" element={<BookingFlow />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Details')).toBeTruthy()
  })

  it('shows first name field in step 1', () => {
    render(
      <MemoryRouter initialEntries={['/workshops/1/book']}>
        <Routes>
          <Route path="/workshops/:id/book" element={<BookingFlow />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByLabelText(/first name/i)).toBeTruthy()
  })
})
