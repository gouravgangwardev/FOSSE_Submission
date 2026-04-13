import { useCallback } from 'react'
import { useWorkshops } from '../hooks/useWorkshops'
import { useWorkshopFilters } from '../context/WorkshopFiltersContext'
import WorkshopCard from '../components/WorkshopCard'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/EmptyState'
import { IconAlertTriangle, IconInbox } from '../components/Icons'
import styles from './WorkshopList.module.css'

export default function WorkshopList() {
  const { filters, setFilters, resetFilters } = useWorkshopFilters()
  const { workshops, count, loading, error, refetch } = useWorkshops(filters)

  const handleFilterChange = useCallback((f) => setFilters(f), [setFilters])

  return (
    <main className={styles.page} id="main-content">
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className="container">
          <p className={styles.heroEyebrow}>Learn by doing</p>
          <h1 id="hero-heading" className={styles.heroTitle}>
            Find your next<br />
            <span className={styles.heroAccent}>hands-on workshop</span>
          </h1>
          <p className={styles.heroSub}>
            Expert-led workshops in Python, ML, Design, DevOps and more —
            in-person and online across India.
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.content}>
          <FilterBar filters={filters} onChange={handleFilterChange} total={loading ? null : count} />

          {loading && (
            <div className={styles.loadingGrid} aria-label="Loading workshops" role="status">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton} aria-hidden="true">
                  <div className={styles.skLine} style={{ width: '55%', height: 13 }} />
                  <div className={styles.skLine} style={{ width: '90%', height: 20, marginTop: 4 }} />
                  <div className={styles.skLine} style={{ width: '80%', height: 13 }} />
                  <div className={styles.skLine} style={{ width: '60%', height: 13 }} />
                  <div className={styles.skLine} style={{ width: '100%', height: 5, marginTop: 12 }} />
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <EmptyState
              icon={<IconAlertTriangle size={48} />}
              title="Could not load workshops"
              message={error}
              action={<button className={styles.actionBtn} onClick={refetch}>Try again</button>}
            />
          )}

          {!loading && !error && workshops.length === 0 && (
            <EmptyState
              icon={<IconInbox size={48} />}
              title="No workshops found"
              message="Try adjusting your search or filters."
              action={<button className={styles.actionBtn} onClick={resetFilters}>Clear filters</button>}
            />
          )}

          {!loading && !error && workshops.length > 0 && (
            <section aria-label="Workshop listings">
              <div className={styles.grid}>
                {workshops.map((w, i) => (
                  <div key={w.id} className="animate-fade-up" style={{ animationDelay: `${i * 45}ms` }}>
                    <WorkshopCard workshop={w} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
