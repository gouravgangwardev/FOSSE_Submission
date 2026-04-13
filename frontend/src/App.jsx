import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WorkshopList from './pages/WorkshopList'
import Spinner from './components/Spinner'
import styles from './App.module.css'

const WorkshopDetail = lazy(() => import('./pages/WorkshopDetail'))
const BookingFlow     = lazy(() => import('./pages/BookingFlow'))
const BookingLookup   = lazy(() => import('./pages/BookingLookup'))

function NotFound() {
  return (
    <main className={styles.notFound} id="main-content">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h1>Page not found</h1>
      <a href="/">Back to workshops</a>
    </main>
  )
}

export default function App() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <div className={styles.content}>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Spinner /></div>}>
          <Routes>
            <Route path="/" element={<WorkshopList />} />
            <Route path="/workshops/:id" element={<WorkshopDetail />} />
            <Route path="/workshops/:id/book" element={<BookingFlow />} />
            <Route path="/lookup" element={<BookingLookup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
