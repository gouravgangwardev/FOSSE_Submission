import { useParams, Link } from 'react-router-dom'
import { useWorkshop } from '../hooks/useWorkshops'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { IconCalendar, IconMapPin, IconMonitor, IconUsers, IconAlertTriangle } from '../components/Icons'
import styles from './WorkshopDetail.module.css'
import { formatDateRange, formatDate, formatPrice, levelColor, statusColor } from '../utils/format'

export default function WorkshopDetail() {
  const { id } = useParams()
  const { workshop: w, loading, error } = useWorkshop(id)

  if (loading) return (
    <div className={styles.centered}><Spinner size={48} /></div>
  )
  if (error || !w) return (
    <div className={styles.centered}>
      <EmptyState
        icon={<IconAlertTriangle size={48} />}
        title="Workshop not found"
        message={error ?? 'This workshop does not exist.'}
        action={<Link to="/" className={styles.backLink}>Back to workshops</Link>}
      />
    </div>
  )

  const seatsPercent = Math.round(((w.max_participants - w.available_seats) / w.max_participants) * 100)

  return (
    <main className={styles.page} id="main-content">
      <div className={`container ${styles.breadcrumb}`}>
        <Link to="/">Workshops</Link>
        <span aria-hidden="true"> / </span>
        <span>{w.title}</span>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <article className={styles.main}>
            <header className={styles.header}>
              <div className={styles.categoryRow}>
                <span className={styles.categoryName}>{w.category?.name}</span>
              </div>
              <h1 className={styles.title}>{w.title}</h1>
              <div className={styles.badgeRow}>
                <Badge variant={statusColor(w.status)}>{w.status_display}</Badge>
                <Badge variant={levelColor(w.level)}>{w.level_display}</Badge>
                {w.is_online && <Badge variant="blue">Online</Badge>}
              </div>
            </header>

            <section className={styles.section} aria-labelledby="about-heading">
              <h2 id="about-heading" className={styles.sectionTitle}>About this workshop</h2>
              <p className={styles.description}>{w.description}</p>
            </section>

            {w.tag_list?.length > 0 && (
              <section className={styles.section} aria-labelledby="topics-heading">
                <h2 id="topics-heading" className={styles.sectionTitle}>Topics covered</h2>
                <div className={styles.tags}>
                  {w.tag_list.map(t => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </section>
            )}

            <section className={styles.section} aria-labelledby="instructor-heading">
              <h2 id="instructor-heading" className={styles.sectionTitle}>Your instructor</h2>
              <div className={styles.instructorCard}>
                <div className={styles.instructorAvatar} aria-hidden="true">
                  {w.instructor_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className={styles.instructorName}>{w.instructor_name}</p>
                  {w.instructor_bio && <p className={styles.instructorBio}>{w.instructor_bio}</p>}
                </div>
              </div>
            </section>
          </article>

          <aside className={styles.sidebar} aria-label="Booking information">
            <div className={styles.sidebarCard}>
              <p className={styles.price}>{formatPrice(w.price)}</p>

              <dl className={styles.details}>
                <div className={styles.detailRow}>
                  <dt><IconCalendar size={16} /> Date</dt>
                  <dd>{formatDateRange(w.start_date, w.end_date)}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>{w.is_online ? <IconMonitor size={16} /> : <IconMapPin size={16} />} Location</dt>
                  <dd>{w.is_online ? 'Online' : `${w.location}${w.city ? ', ' + w.city : ''}`}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt><IconUsers size={16} /> Seats</dt>
                  <dd>{w.is_full ? 'Full — Waitlist open' : `${w.available_seats} of ${w.max_participants} left`}</dd>
                </div>
              </dl>

              <div
                className={styles.seatsBar}
                role="progressbar"
                aria-valuenow={seatsPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${seatsPercent}% booked`}
              >
                <div className={styles.seatsProgress} style={{ width: `${seatsPercent}%` }} />
              </div>

              {w.status === 'upcoming' || w.status === 'ongoing' ? (
                <Link
                  to={`/workshops/${w.id}/book`}
                  className={`${styles.bookBtn} ${w.is_full ? styles.bookBtnSecondary : styles.bookBtnPrimary}`}
                  aria-label={`Book ${w.title}`}
                >
                  {w.is_full ? 'Join waitlist' : 'Book my spot'}
                </Link>
              ) : (
                <div className={styles.closedNotice}>
                  Bookings are {w.status === 'completed' ? 'closed' : 'cancelled'} for this workshop.
                </div>
              )}

              <p className={styles.lastUpdated}>Updated {formatDate(w.updated_at)}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
