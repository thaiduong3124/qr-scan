import { useState } from 'react'

export default function Setup({ onSave }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!url.trim().startsWith('https://')) return setError('URL phải bắt đầu bằng https://')
    setError('')
    onSave(url.trim())
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-icon">📦</div>
        <h1 className="setup-title">QR Scan Giá</h1>
        <p className="setup-desc">
          Nhập URL của Google Apps Script để kết nối với dữ liệu sản phẩm.
        </p>

        <div className="form-group">
          <label>Apps Script Web App URL</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://script.google.com/macros/s/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSave} disabled={!url.trim()}>
          Bắt đầu
        </button>

        <details className="setup-guide">
          <summary>Hướng dẫn cài đặt Google Apps Script</summary>
          <ol>
            <li>Tạo Google Sheet với các cột: <code>sku | name | price | unit</code></li>
            <li>Mở <strong>Extensions → Apps Script</strong></li>
            <li>Dán code từ file <code>google-apps-script.js</code> vào editor</li>
            <li>Nhấn <strong>Deploy → New deployment → Web app</strong></li>
            <li>Chọn <em>"Anyone"</em> ở mục "Who has access"</li>
            <li>Copy URL và dán vào ô trên</li>
          </ol>
        </details>
      </div>
    </div>
  )
}
