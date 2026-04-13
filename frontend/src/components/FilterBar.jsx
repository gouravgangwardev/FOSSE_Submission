import { useCategories } from '../hooks/useCategories'
import { IconSearch } from './Icons'
import styles from './FilterBar.module.css'

const LEVELS   = [['', 'All Levels'], ['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']]
const STATUSES = [['', 'Any Status'], ['upcoming', 'Upcoming'], ['ongoing', 'Ongoing'], ['completed', 'Completed']]
const MODES    = [['', 'Any Mode'], ['false', 'In-Person'], ['true', 'Online']]

export default function FilterBar({ filters, onChange, total }) {
  const { categories } = useCategories()

  function set(key, value) {
    onChange({ ...filters, [key]: value, page: undefined })
  }

  function reset() {
    onChange({ search: '' })
  }

  const hasActive = Object.values(filters).some(v => v && v !== '')

  return (
    <section className={styles.bar} aria-label="Workshop filters">
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <IconSearch size={18} />
        </span>
        <input
          className={styles.search}
          type="search"
          placeholder="Search workshops, instructors, topics…"
          value={filters.search ?? ''}
          aria-label="Search workshops"
          onChange={e => set('search', e.target.value)}
        />
      </div>

      <div className={styles.selects}>
        <Select label="Category" value={filters.category ?? ''} onChange={v => set('category', v)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </Select>

        <Select label="Level" value={filters.level ?? ''} onChange={v => set('level', v)}>
          {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>

        <Select label="Status" value={filters.status ?? ''} onChange={v => set('status', v)}>
          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>

        <Select label="Mode" value={filters.is_online ?? ''} onChange={v => set('is_online', v)}>
          {MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>

        {hasActive && (
          <button className={styles.clearBtn} onClick={reset} aria-label="Clear all filters">
            Clear
          </button>
        )}
      </div>

      {total != null && (
        <p className={styles.count} aria-live="polite">
          {total} workshop{total !== 1 ? 's' : ''} found
        </p>
      )}
    </section>
  )
}

function Select({ label, value, onChange, children }) {
  return (
    <label className={styles.selectLabel}>
      <span className="sr-only">{label}</span>
      <select
        className={styles.select}
        value={value}
        aria-label={label}
        onChange={e => onChange(e.target.value)}
      >
        {children}
      </select>
    </label>
  )
}
