const BASE_URL = '/api'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data?.detail || Object.values(data).flat().join(' ') || `HTTP ${response.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  workshops: {
    list: (params = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
      ).toString()
      return request(`/workshops/${qs ? '?' + qs : ''}`)
    },
    detail: (id) => request(`/workshops/${id}/`),
  },
  categories: {
    list: () => request('/categories/'),
  },
  bookings: {
    create: (data) => request('/book/', { method: 'POST', body: JSON.stringify(data) }),
    lookup: (code, email) => request(`/booking/lookup/?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`),
  },
}
