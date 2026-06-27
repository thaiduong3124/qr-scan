import { useState, useCallback, useRef } from 'react'

async function testConnection(url) {
  try {
    const res = await fetch(`${url}?action=getAll`, { redirect: 'follow' })
    if (!res.ok) return `Lỗi HTTP ${res.status}`
    const text = await res.text()
    JSON.parse(text)
    return 'ok'
  } catch (e) {
    return e.message || 'Không kết nối được'
  }
}
import { useProducts } from './hooks/useProducts'
import QRScanner from './components/QRScanner'
import SearchBar from './components/SearchBar'
import ProductModal from './components/ProductModal'
import AddProductModal from './components/AddProductModal'
import EditProductModal from './components/EditProductModal'
import Setup from './components/Setup'
import SettingsModal from './components/SettingsModal'
import './App.css'

export default function App() {
  const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbwOhX3a8ZxnF7iLdWmcZvJcJwxD_YjQfi6ENNmUc5aorCVnNgcr6sWfhgELYSv2zijZ/exec'
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('qrscan_api_url') || DEFAULT_API_URL)
  const [scannerActive, setScannerActive] = useState(true)
  const [modal, setModal] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const scanningRef = useRef(false)

  const { loading, error, findBySku, searchByName, addProduct, updateProduct, refetch } = useProducts(apiUrl)

  const closeModal = useCallback(() => {
    setModal(null)
    scanningRef.current = false
    setScannerActive(true)
  }, [])

  const handleScan = useCallback(
    (code) => {
      if (scanningRef.current) return
      scanningRef.current = true
      setScannerActive(false)
      const product = findBySku(code)
      if (product) {
        setModal({ type: 'product', data: product })
      } else {
        setModal({ type: 'add', data: { sku: code } })
      }
    },
    [findBySku]
  )

  const handleEdit = useCallback((product) => {
    setModal({ type: 'edit', data: product })
  }, [])

  const handleAdd = useCallback(
    async (product) => {
      await addProduct(product)
      closeModal()
    },
    [addProduct, closeModal]
  )

  const handleUpdate = useCallback(
    async (product) => {
      await updateProduct(product)
      closeModal()
    },
    [updateProduct, closeModal]
  )

  const handleSetupSave = useCallback((url) => {
    localStorage.setItem('qrscan_api_url', url)
    setApiUrl(url)
  }, [])

  if (!apiUrl) {
    return <Setup onSave={handleSetupSave} />
  }

  return (
    <div className="app">
      <header className="header">
        <span className="header-title">QR <span>Scan</span> Giá</span>
        <button
          className="header-btn"
          title="Cài đặt"
          onClick={() => setShowSettings(true)}
        >
          ⚙
        </button>
      </header>

      <main className="main">
        {scannerActive && <QRScanner onScan={handleScan} />}
        {!scannerActive && !modal && (
          <div className="scanner-paused" onClick={closeModal}>
            <span>📷</span>
            <p>Nhấn để quét lại</p>
          </div>
        )}

        {loading && <div className="status-bar">Đang tải dữ liệu...</div>}
        {error && (
          <div className="status-bar status-bar--error">
            <span>{error}</span>
            <button className="retry-btn" onClick={refetch}>Thử lại</button>
          </div>
        )}

        <SearchBar
          searchByName={searchByName}
          onSelect={(product) => {
            setScannerActive(false)
            setModal({ type: 'product', data: product })
          }}
        />
      </main>

      {modal?.type === 'product' && (
        <ProductModal product={modal.data} onClose={closeModal} onEdit={handleEdit} />
      )}
      {modal?.type === 'add' && (
        <AddProductModal sku={modal.data.sku} onClose={closeModal} onAdd={handleAdd} />
      )}
      {modal?.type === 'edit' && (
        <EditProductModal product={modal.data} onClose={closeModal} onSave={handleUpdate} />
      )}

      {showSettings && (
        <SettingsModal
          apiUrl={apiUrl}
          testing={testing}
          testResult={testResult}
          onClose={() => { setShowSettings(false); setTestResult(null) }}
          onSave={(val) => { localStorage.setItem('qrscan_api_url', val); setApiUrl(val); setTestResult(null) }}
          onTest={async (url) => {
            setTesting(true)
            setTestResult(null)
            const result = await testConnection(url)
            setTestResult(result)
            setTesting(false)
          }}
        />
      )}
    </div>
  )
}
