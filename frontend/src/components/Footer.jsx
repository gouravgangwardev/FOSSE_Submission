import { Link } from 'react-router-dom'
import { IconGraduationCap } from './Icons'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="WorkshopHub home">
            <IconGraduationCap size={20} />
            <span>WorkshopHub</span>
          </Link>
          <p className={styles.tagline}>Expert-led workshops, in-person & online.</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className={styles.links}>
            <li><Link to="/">Browse workshops</Link></li>
            <li><Link to="/lookup">My booking</Link></li>
          </ul>
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} WorkshopHub</p>
      </div>
    </footer>
  )
}
