import styles from './Spinner.module.css'
export default function Spinner({ size = 32, label = 'Loading…' }) {
  return (
    <span className={styles.wrap} role="status" aria-label={label}>
      <span className={styles.ring} style={{ width: size, height: size }} />
    </span>
  )
}
