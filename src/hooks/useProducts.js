import { useState, useEffect, useCallback } from 'react'

function resolveUrl(apiUrl) {
  if (!apiUrl) return ''
  // In dev, proxy /gas → script.google.com to bypass CORS
  if (import.meta.env.DEV) {
    return apiUrl.replace('https://script.google.com', '/gas')
  }
  return apiUrl
}

export function useProducts(apiUrl) {
  const url = resolveUrl(apiUrl)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${url}?action=getAll`, { redirect: 'follow' })
      if (!res.ok) {
        throw new Error(`Máy chủ trả về lỗi HTTP ${res.status}. Kiểm tra Apps Script đã deploy chưa.`)
      }
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error('Dữ liệu trả về không hợp lệ. Apps Script có thể chưa deploy đúng cách.')
      }
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Không kết nối được. Kiểm tra internet hoặc URL cấu hình.')
      } else {
        setError(err.message || 'Lỗi không xác định. Kiểm tra lại URL cấu hình.')
      }
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const findBySku = useCallback(
    (sku) => products.find((p) => p.sku?.toString().trim() === sku?.toString().trim()) ?? null,
    [products]
  )

  const searchByName = useCallback(
    (query) => {
      if (!query.trim()) return []
      const q = query.toLowerCase().trim()
      return products.filter((p) => p.name?.toLowerCase().includes(q))
    },
    [products]
  )

  const addProduct = useCallback(
    async (product) => {
      const params = new URLSearchParams({ action: 'add', ...product })
      const res = await fetch(`${url}?${params}`)
      const result = await res.json()
      if (result.success) {
        setProducts((prev) => [...prev, product])
      }
      return result
    },
    [url]
  )

  const updateProduct = useCallback(
    async (product) => {
      const params = new URLSearchParams({ action: 'update', ...product })
      const res = await fetch(`${url}?${params}`)
      const result = await res.json()
      if (result.success) {
        setProducts((prev) => prev.map((p) => (p.sku === product.sku ? product : p)))
      }
      return result
    },
    [url]
  )

  return { products, loading, error, findBySku, searchByName, addProduct, updateProduct, refetch: fetchProducts }
}
