import { memo } from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'
import { IconCalendar, IconMapPin, IconMonitor, IconUser } from './Icons'
import styles from './WorkshopCard.module.css'
import { formatDateRange, formatPrice, levelColor, statusColor } from '../utils/format'

function WorkshopCard({ workshop }) {
  const {
    id, title, description, category, instructor_name,
    level, level_display, status, status_display,
    start_date, end_date, location, city, is_online,
    max_participants, available_seats, is_full, price, tag_list,
  } = workshop

  const seatsPercent = Math.round(((max_participants - available_seats) / max_participants) * 100)

  return (
    <article className={styles.card} aria-label={`Workshop: ${title}`}>
      <div className={styles.cardTop}>
        <div className={styles.categoryRow}>
          <span className={styles.categoryName}>{category?.name ?? 'Workshop'}</span>
          <Badge variant={statusColor(status)} size="sm">{status_display}</Badge>
        </div>

        <h2 className={styles.title}>
          <Link to={`/workshops/${id}`}>{title}</Link>
        </h2>

        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.metaRow}>
          <IconCalendar size={16} />
          <span>{formatDateRange(start_date, end_date)}</span>
        </div>
        <div className={styles.metaRow}>
          {is_online ? <IconMonitor size={16} /> : <IconMapPin size={16} />}
          <span>{is_online ? 'Online' : (city || location)}</span>
        </div>
        <div className={styles.metaRow}>
          <IconUser size={16} />
          <span>{instructor_name}</span>
        </div>
      </div>

      <div className={styles.seatsRow} aria-label={`${available_seats} of ${max_participants} seats available`}>
        <div className={styles.seatsBar}>
          <div className={styles.seatsProgress} style={{ width: `${seatsPercent}%` }} />
        </div>
        <span className={styles.seatsLabel}>
          {is_full ? 'Full — Waitlist available' : `${available_seats} / ${max_participants} seats left`}
        </span>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.badges}>
          <Badge variant={levelColor(level)} size="sm">{level_display}</Badge>
          {tag_list?.slice(0, 2).map(t => (
            <Badge key={t} variant="gray" size="sm">{t}</Badge>
          ))}
        </div>

        <div className={styles.footerRight}>
          <span className={styles.price}>{formatPrice(price)}</span>
          <Link
            to={`/workshops/${id}`}
            className={`${styles.btn} ${is_full ? styles.btnSecondary : styles.btnPrimary}`}
          >
            {is_full ? 'Waitlist' : 'Book now'}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default memo(WorkshopCard)
