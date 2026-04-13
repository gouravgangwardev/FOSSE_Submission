import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useDebounce } from './useDebounce'

export function useWorkshops(filters = {}) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const debouncedSearch = useDebounce(filters.search ?? '', 350)
  const effectiveFilters = { ...filters, search: debouncedSearch }

  const key = JSON.stringify(effectiveFilters)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.workshops.list(effectiveFilters)
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [key]) // eslint-disable-line

  useEffect(() => { fetch() }, [fetch])

  return { workshops: data?.results ?? [], count: data?.count ?? 0, loading, error, refetch: fetch }
}

export function useWorkshop(id) {
  const [workshop, setWorkshop] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.workshops.detail(id)
      .then(setWorkshop)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return { workshop, loading, error }
}
