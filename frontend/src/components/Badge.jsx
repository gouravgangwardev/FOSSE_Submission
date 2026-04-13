import styles from './Badge.module.css'

export default function Badge({ children, variant = 'gray', size = 'md' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  )
}
