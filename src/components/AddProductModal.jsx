import { useState } from 'react'

export default function AddProductModal({ sku, onClose, onAdd }) {
  const [form, setForm] = useState({ sku: sku || '', name: '', price: '', unit: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Vui lòng nhập tên sản phẩm')
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return setError('Đơn giá không hợp lệ')
    if (!form.unit.trim()) return setError('Vui lòng nhập đơn vị')
    setError('')
    setSaving(true)
    try {
      await onAdd({ ...form, price: Number(form.price) })
    } catch {
      setError('Lưu thất bại, thử lại.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-tag not-found">Chưa có sản phẩm</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          Mã <strong>{sku}</strong> chưa có trong danh sách. Điền thông tin để thêm mới.
        </p>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã sản phẩm (SKU)</label>
            <input className="form-input" value={form.sku} onChange={set('sku')} />
          </div>
          <div className="form-group">
            <label>Tên sản phẩm <span className="required">*</span></label>
            <input className="form-input" placeholder="VD: Gạo ST25" value={form.name} onChange={set('name')} autoFocus />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Đơn giá <span className="required">*</span></label>
              <input className="form-input" type="number" min={0} placeholder="0" value={form.price} onChange={set('price')} />
            </div>
            <div className="form-group">
              <label>Đơn vị <span className="required">*</span></label>
              <input className="form-input" placeholder="kg, cái, hộp..." value={form.unit} onChange={set('unit')} />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
