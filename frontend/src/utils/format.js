export function formatDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateRange(start, end) {
  if (!start) return '—'
  const s = new Date(start)
  const e = new Date(end)
  const fmt = (d) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(d)
  const fmtYear = (d) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
  if (s.toDateString() === e.toDateString()) return fmtYear(s)
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
    return `${fmt(s)} – ${fmtYear(e)}`
  return `${fmt(s)} – ${fmtYear(e)}`
}

export function formatPrice(price) {
  if (!price || Number(price) === 0) return 'Free'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
}

export function levelColor(level) {
  return { beginner: 'green', intermediate: 'amber', advanced: 'red' }[level] ?? 'gray'
}

export function statusColor(status) {
  return { upcoming: 'indigo', ongoing: 'green', completed: 'gray', cancelled: 'red' }[status] ?? 'gray'
}
