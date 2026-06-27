import { useState } from 'react'

export default function SettingsModal({ apiUrl, testing, testResult, onClose, onSave, onTest }) {
  const [url, setUrl] = useState(apiUrl)

  const handleSave = () => {
    const val = url.trim()
    if (val) onSave(val)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <span className="modal-tag">Cài đặt</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <div className="form-group">
            <label>Apps Script Web App URL</label>
            <input
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
            />
          </div>

          {testResult && (
            <div className={`test-result ${testResult === 'ok' ? 'test-result--ok' : 'test-result--fail'}`}>
              {testResult === 'ok'
                ? '✓ Kết nối thành công'
                : `✗ ${testResult}`}
            </div>
          )}

          <div className="settings-actions">
            <button
              className="btn btn-outline"
              style={{ flex: 1 }}
              disabled={testing || !url.trim()}
              onClick={() => onTest(url.trim())}
            >
              {testing ? 'Đang test...' : 'Test kết nối'}
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={!url.trim()}
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>

          <details className="setup-guide" style={{ marginTop: 16 }}>
            <summary>Kiểm tra các lỗi thường gặp</summary>
            <ul style={{ paddingLeft: 16, lineHeight: 1.9, marginTop: 8 }}>
              <li>Vào Apps Script → Deploy → Manage deployments → kiểm tra trạng thái</li>
              <li>Đảm bảo <em>Who has access</em> là <strong>Anyone</strong></li>
              <li>Sau khi sửa script phải <strong>tạo deployment mới</strong>, không dùng lại URL cũ</li>
              <li>Tên sheet phải là <code>Products</code> (phân biệt hoa thường)</li>
              <li>Dòng đầu tiên phải là header: <code>sku | name | price | unit</code></li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  )
}
