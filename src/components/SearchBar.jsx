import { useState, useCallback } from 'react'
import { formatPrice } from '../utils'

export default function SearchBar({ searchByName, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value
      setQuery(val)
      setResults(val.trim() ? searchByName(val) : [])
    },
    [searchByName]
  )

  const handleSelect = (product) => {
    setQuery('')
    setResults([])
    onSelect(product)
  }

  return (
    <div className="search-section">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder="Tìm theo tên sản phẩm..."
          value={query}
          onChange={handleChange}
          autoComplete="off"
        />
        {query && (
          <button className="search-clear" onClick={() => { setQuery(''); setResults([]) }}>✕</button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((p) => (
            <li key={p.sku} className="search-result-item" onClick={() => handleSelect(p)}>
              <div className="result-name">{p.name}</div>
              <div className="result-meta">
                <span className="result-sku">{p.sku}</span>
                <span className="result-price">{formatPrice(p.price)}/{p.unit}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {query.trim() && results.length === 0 && (
        <div className="search-empty">Không tìm thấy sản phẩm nào</div>
      )}
    </div>
  )
}
