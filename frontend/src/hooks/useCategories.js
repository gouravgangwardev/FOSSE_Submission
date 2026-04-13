import { useState, useEffect } from 'react'
import { api } from '../api/client'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    api.categories.list()
      .then(data => setCategories(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
