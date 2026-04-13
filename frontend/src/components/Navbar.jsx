import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IconGraduationCap, IconMenu, IconX } from './Icons'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header} role="banner">
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
      <nav className={`container ${styles.nav}`} aria-label="Main navigation">
        <Link to="/" className={styles.logo} aria-label="WorkshopHub home">
          <IconGraduationCap size={22} />
          <span className={styles.logoText}>WorkshopHub</span>
        </Link>

        <ul className={`${styles.links} ${open ? styles.open : ''}`} role="list" id="nav-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Browse</NavLink></li>
          <li><NavLink to="/lookup" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>My Booking</NavLink></li>
        </ul>

        <button
          className={styles.hamburger}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <IconX size={22} /> : <IconMenu size={22} />}
        </button>
      </nav>
    </header>
  )
}
