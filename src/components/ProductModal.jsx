import { useState } from 'react'
import { formatPrice } from '../utils'

export default function ProductModal({ product, onClose, onEdit }) {
  const [qty, setQty] = useState(1)
  const total = product.price * qty

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <span className="modal-tag">Sản phẩm</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-sku">Mã: {product.sku}</p>
          <div className="product-price-row">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span className="product-unit">/ {product.unit}</span>
          </div>
        </div>

        <div className="calc-section">
          <label className="calc-label">Số lượng</label>
          <div className="qty-row">
            <button
              className="qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >−</button>
            <input
              type="number"
              className="qty-input"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            />
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <div className="total-row">
            <span className="total-label">Thành tiền</span>
            <span className="total-value">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => onEdit(product)}>Sửa</button>
          <button className="btn btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  )
}
