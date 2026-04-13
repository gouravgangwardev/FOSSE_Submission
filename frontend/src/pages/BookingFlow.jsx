import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useWorkshop } from '../hooks/useWorkshops'
import { api } from '../api/client'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import {
  IconCalendar, IconMapPin, IconMonitor, IconUser, IconUsers,
  IconPartyPopper, IconAlertTriangle, IconTicket, IconClipboard
} from '../components/Icons'
import styles from './BookingFlow.module.css'
import { formatDateRange, formatPrice, levelColor, statusColor } from '../utils/format'

const STEPS = ['Details', 'Review', 'Confirm']

const INITIAL = {
  first_name: '', last_name: '', email: '',
  phone: '', organization: '', experience_level: '', special_requirements: '',
}

function Field({ label, id, required, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}{required && <span className={styles.req} aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p className={styles.fieldError} role="alert" id={`${id}-error`}>{error}</p>}
    </div>
  )
}

function StepIndicator({ current }) {
  return (
    <ol className={styles.steps} aria-label="Booking steps">
      {STEPS.map((s, i) => (
        <li key={s} className={`${styles.step} ${i < current ? styles.done : ''} ${i === current ? styles.active : ''}`}>
          <span className={styles.stepNum} aria-current={i === current ? 'step' : undefined}>
            {i < current ? '✓' : i + 1}
          </span>
          <span className={styles.stepLabel}>{s}</span>
          {i < STEPS.length - 1 && <span className={styles.stepLine} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

export default function BookingFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { workshop: w, loading, error: loadError } = useWorkshop(id)

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [booking, setBooking] = useState(null)

  function change(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(er => ({ ...er, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'First name is required.'
    if (!form.last_name.trim()) errs.last_name = 'Last name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    return errs
  }

  function goReview(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await api.bookings.create({ ...form, workshop: Number(id) })
      setBooking(result)
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className={styles.centered}><Spinner size={48} /></div>

  if (loadError || !w) return (
    <div className={styles.centered}>
      <p className={styles.errorMsg}>Workshop not found. <Link to="/" className={styles.link}>Go back</Link></p>
    </div>
  )

  return (
    <main className={styles.page} id="main-content">
      <div className="container">
        <Link to={`/workshops/${id}`} className={styles.backLink}>← Back to workshop</Link>

        <div className={styles.layout}>
          <div className={styles.formCol}>
            <StepIndicator current={step} />

            {step === 0 && (
              <section className={styles.card} aria-labelledby="details-heading">
                <h1 id="details-heading" className={styles.cardTitle}>Your details</h1>
                <form onSubmit={goReview} noValidate>
                  <div className={styles.row}>
                    <Field label="First name" id="first_name" required error={errors.first_name}>
                      <input id="first_name" name="first_name"
                        className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
                        value={form.first_name} onChange={change} autoComplete="given-name"
                        aria-required="true" aria-describedby={errors.first_name ? 'first_name-error' : undefined} />
                    </Field>
                    <Field label="Last name" id="last_name" required error={errors.last_name}>
                      <input id="last_name" name="last_name"
                        className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
                        value={form.last_name} onChange={change} autoComplete="family-name"
                        aria-required="true" aria-describedby={errors.last_name ? 'last_name-error' : undefined} />
                    </Field>
                  </div>

                  <Field label="Email address" id="email" required error={errors.email}>
                    <input id="email" name="email" type="email"
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      value={form.email} onChange={change} autoComplete="email"
                      aria-required="true" aria-describedby={errors.email ? 'email-error' : undefined} />
                  </Field>

                  <Field label="Phone number" id="phone" error={errors.phone}>
                    <input id="phone" name="phone" type="tel" className={styles.input}
                      value={form.phone} onChange={change} autoComplete="tel" placeholder="Optional" />
                  </Field>

                  <Field label="Organisation / College" id="organization" error={errors.organization}>
                    <input id="organization" name="organization" className={styles.input}
                      value={form.organization} onChange={change} placeholder="Optional" />
                  </Field>

                  <Field label="Your experience level" id="experience_level" error={errors.experience_level}>
                    <select id="experience_level" name="experience_level" className={styles.select}
                      value={form.experience_level} onChange={change}>
                      <option value="">Select…</option>
                      <option value="none">No experience</option>
                      <option value="beginner">Beginner (0–1 years)</option>
                      <option value="intermediate">Intermediate (1–3 years)</option>
                      <option value="advanced">Advanced (3+ years)</option>
                    </select>
                  </Field>

                  <Field label="Special requirements or questions" id="special_requirements" error={errors.special_requirements}>
                    <textarea id="special_requirements" name="special_requirements" className={styles.textarea}
                      rows={3} value={form.special_requirements} onChange={change}
                      placeholder="Accessibility needs, dietary requirements, questions for the instructor…" />
                  </Field>

                  <button type="submit" className={styles.btnPrimary}>
                    Review booking →
                  </button>
                </form>
              </section>
            )}

            {step === 1 && (
              <section className={styles.card} aria-labelledby="review-heading">
                <h1 id="review-heading" className={styles.cardTitle}>Review your booking</h1>

                <dl className={styles.reviewList}>
                  {[
                    ['Name', `${form.first_name} ${form.last_name}`],
                    ['Email', form.email],
                    form.phone && ['Phone', form.phone],
                    form.organization && ['Organisation', form.organization],
                    form.experience_level && ['Experience', form.experience_level],
                    form.special_requirements && ['Notes', form.special_requirements],
                  ].filter(Boolean).map(([k, v]) => (
                    <div key={k} className={styles.reviewRow}>
                      <dt className={styles.reviewKey}>{k}</dt>
                      <dd className={styles.reviewVal}>{v}</dd>
                    </div>
                  ))}
                </dl>

                {submitError && (
                  <div className={styles.submitError} role="alert">
                    <strong>Booking failed:</strong> {submitError}
                  </div>
                )}

                <div className={styles.reviewActions}>
                  <button className={styles.btnGhost} onClick={() => setStep(0)}>← Edit details</button>
                  <button className={styles.btnPrimary} onClick={submit} disabled={submitting}
                    aria-busy={submitting}>
                    {submitting ? <><Spinner size={18} /> Confirming…</> : 'Confirm booking'}
                  </button>
                </div>
              </section>
            )}

            {step === 2 && booking && (
              <section className={`${styles.card} ${styles.successCard}`} aria-labelledby="success-heading">
                <div className={styles.successIcon} aria-hidden="true">
                  <IconPartyPopper size={40} />
                </div>
                <h1 id="success-heading" className={styles.cardTitle}>
                  {booking.status === 'confirmed' ? "You're booked!" : "You're on the waitlist!"}
                </h1>
                <p className={styles.successMsg}>
                  {booking.status === 'confirmed'
                    ? `A confirmation has been registered for ${booking.email}.`
                    : `We've added you to the waitlist. We'll notify you at ${booking.email} if a spot opens up.`}
                </p>

                <div className={styles.confirmBox}>
                  <p className={styles.confirmLabel}>Confirmation code</p>
                  <p className={styles.confirmCode}>{booking.confirmation_code}</p>
                  <p className={styles.confirmHint}>Save this code to look up your booking later.</p>
                </div>

                <div className={styles.successActions}>
                  <Link to="/" className={styles.btnPrimary}>Browse more workshops</Link>
                  <Link to="/lookup" className={styles.btnGhost}>Look up my booking</Link>
                </div>
              </section>
            )}
          </div>

          <aside className={styles.summary} aria-label="Workshop summary">
            <div className={styles.summaryCard}>
              <div className={styles.summaryCategory}>
                <span>{w.category?.name}</span>
              </div>
              <h2 className={styles.summaryTitle}>{w.title}</h2>
              <div className={styles.summaryBadges}>
                <Badge variant={statusColor(w.status)} size="sm">{w.status_display}</Badge>
                <Badge variant={levelColor(w.level)} size="sm">{w.level_display}</Badge>
              </div>
              <dl className={styles.summaryDetails}>
                <div>
                  <dt><IconCalendar size={15} /></dt>
                  <dd>{formatDateRange(w.start_date, w.end_date)}</dd>
                </div>
                <div>
                  <dt>{w.is_online ? <IconMonitor size={15} /> : <IconMapPin size={15} />}</dt>
                  <dd>{w.is_online ? 'Online' : (w.city || w.location)}</dd>
                </div>
                <div>
                  <dt><IconUser size={15} /></dt>
                  <dd>{w.instructor_name}</dd>
                </div>
                <div>
                  <dt><IconUsers size={15} /></dt>
                  <dd>{w.is_full ? 'Waitlist only' : `${w.available_seats} seats left`}</dd>
                </div>
              </dl>
              <div className={styles.summaryPrice}>{formatPrice(w.price)}</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
