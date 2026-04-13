import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'workshop_filters'

const defaultFilters = { search: '' }

function getInitialState() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (_) {}
  return defaultFilters
}

function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload }
    case 'RESET_FILTERS':
      return defaultFilters
    default:
      return state
  }
}

const WorkshopFiltersContext = createContext(null)

export function WorkshopFiltersProvider({ children }) {
  const [filters, dispatch] = useReducer(filtersReducer, undefined, getInitialState)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch (_) {}
  }, [filters])

  function setFilters(payload) {
    dispatch({ type: 'SET_FILTERS', payload })
  }

  function resetFilters() {
    dispatch({ type: 'RESET_FILTERS' })
  }

  return (
    <WorkshopFiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </WorkshopFiltersContext.Provider>
  )
}

export function useWorkshopFilters() {
  const ctx = useContext(WorkshopFiltersContext)
  if (!ctx) throw new Error('useWorkshopFilters must be used within WorkshopFiltersProvider')
  return ctx
}
