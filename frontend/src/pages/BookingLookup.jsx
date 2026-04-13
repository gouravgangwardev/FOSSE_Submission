import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { IconMagnify, IconCheckCircle, IconClock, IconXCircle } from '../components/Icons'
import styles from './BookingLookup.module.css'
import { formatDate, statusColor } from '../utils/format'

export default function BookingLookup() {
  const [code, setCode]       = useState('')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [booking, setBooking] = useState(null)
  const [errors, setErrors]   = useState({})

  function validate() {
    const errs = {}
    if (!code.trim())  errs.code = 'Confirmation code is required.'
    if (!email.trim()) errs.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setError(null)
    setBooking(null)
    try {
      const result = await api.bookings.lookup(code.trim(), email.trim())
      setBooking(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function statusIcon(status) {
    if (status === 'confirmed') return <IconCheckCircle size={28} />
    if (status === 'waitlisted') return <IconClock size={28} />
    return <IconXCircle size={28} />
  }

  return (
    <main className={styles.page} id="main-content">
      <div className="container">
        <div className={styles.inner}>
          <header className={styles.header}>
            <span className={styles.icon} aria-hidden="true"><IconMagnify size={48} /></span>
            <h1 className={styles.title}>Look up your booking</h1>
            <p className={styles.subtitle}>
              Enter your confirmation code and the email you used to register.
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Booking lookup form">
            <div className={styles.field}>
              <label htmlFor="code" className={styles.label}>
                Confirmation code <span aria-hidden="true" className={styles.req}>*</span>
              </label>
              <input
                id="code" type="text"
                className={`${styles.input} ${errors.code ? styles.inputErr : ''}`}
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setErrors(v => ({ ...v, code: '' })) }}
                placeholder="e.g. AB12CD34EF"
                autoCapitalize="characters" spellCheck={false}
                aria-required="true" aria-describedby={errors.code ? 'code-err' : undefined}
              />
              {errors.code && <p id="code-err" className={styles.fieldErr} role="alert">{errors.code}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="lookup-email" className={styles.label}>
                Email address <span aria-hidden="true" className={styles.req}>*</span>
              </label>
              <input
                id="lookup-email" type="email"
                className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })) }}
                placeholder="you@example.com" autoComplete="email"
                aria-required="true" aria-describedby={errors.email ? 'email-err' : undefined}
              />
              {errors.email && <p id="email-err" className={styles.fieldErr} role="alert">{errors.email}</p>}
            </div>

            {error && (
              <div className={styles.errorBox} role="alert">
                <strong>Not found:</strong> {error}
              </div>
            )}

            <button type="submit" className={styles.btn} disabled={loading} aria-busy={loading}>
              {loading ? <><Spinner size={18} /> Searching…</> : 'Find my booking'}
            </button>
          </form>

          {booking && (
            <div className={styles.result} role="region" aria-label="Booking result" aria-live="polite">
              <div className={styles.resultHeader}>
                <span className={styles.resultIcon} aria-hidden="true">
                  {statusIcon(booking.status)}
                </span>
                <div>
                  <p className={styles.resultTitle}>{booking.first_name} {booking.last_name}</p>
                  <Badge variant={statusColor(booking.status)}>{booking.status_display}</Badge>
                </div>
              </div>

              <dl className={styles.resultDetails}>
                <div className={styles.resultRow}>
                  <dt>Workshop</dt>
                  <dd><Link to={`/workshops/${booking.workshop}`} className={styles.link}>{booking.workshop_title}</Link></dd>
                </div>
                <div className={styles.resultRow}>
                  <dt>Date</dt>
                  <dd>{formatDate(booking.workshop_date)}</dd>
                </div>
                <div className={styles.resultRow}>
                  <dt>Email</dt>
                  <dd>{booking.email}</dd>
                </div>
                <div className={styles.resultRow}>
                  <dt>Booked on</dt>
                  <dd>{formatDate(booking.created_at)}</dd>
                </div>
                <div className={styles.resultRow}>
                  <dt>Confirmation</dt>
                  <dd className={styles.code}>{booking.confirmation_code}</dd>
                </div>
              </dl>

              <Link to={`/workshops/${booking.workshop}`} className={styles.viewBtn}>
                View workshop details →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
