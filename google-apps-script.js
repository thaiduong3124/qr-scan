/**
 * HƯỚNG DẪN CÀI ĐẶT
 * ==================
 * 1. Mở Google Sheet, tạo sheet tên "Products" với header dòng 1:
 *    | sku | name | price | unit |
 *
 * 2. Vào Extensions → Apps Script
 * 3. Xóa code mặc định, dán toàn bộ file này vào
 * 4. Nhấn Save (Ctrl+S)
 * 5. Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Nhấn Deploy, copy URL và dán vào phần cài đặt của ứng dụng
 *
 * Cấu trúc Google Sheet (sheet tên "Products"):
 * | sku       | name           | price   | unit |
 * | SP001     | Gạo ST25       | 35000   | kg   |
 * | SP002     | Đường Biên Hòa | 22000   | kg   |
 */

const SHEET_NAME = 'Products'

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]
}

function doGet(e) {
  const action = e.parameter.action

  if (action === 'getAll') {
    return handleGetAll()
  }
  if (action === 'add') {
    return handleAdd(e.parameter)
  }
  if (action === 'update') {
    return handleUpdate(e.parameter)
  }

  return jsonResponse({ error: 'Unknown action' })
}

function handleGetAll() {
  const sheet = getSheet()
  const rows = sheet.getDataRange().getValues()
  // skip header row (row 0)
  const products = rows.slice(1)
    .filter(row => row[0]) // skip empty rows
    .map(row => ({
      sku:   String(row[0]).trim(),
      name:  String(row[1]).trim(),
      price: Number(row[2]) || 0,
      unit:  String(row[3]).trim(),
    }))
  return jsonResponse(products)
}

function handleAdd(params) {
  const { sku, name, price, unit } = params
  if (!sku || !name) return jsonResponse({ success: false, error: 'Missing sku or name' })

  const sheet = getSheet()
  // check duplicate SKU
  const rows = sheet.getDataRange().getValues()
  const exists = rows.slice(1).some(row => String(row[0]).trim() === String(sku).trim())
  if (exists) return jsonResponse({ success: false, error: 'SKU already exists' })

  sheet.appendRow([sku.trim(), name.trim(), Number(price) || 0, (unit || '').trim()])
  return jsonResponse({ success: true })
}

function handleUpdate(params) {
  const { sku, name, price, unit } = params
  if (!sku) return jsonResponse({ success: false, error: 'Missing sku' })

  const sheet = getSheet()
  const rows = sheet.getDataRange().getValues()
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(sku).trim()) {
      const row = i + 1 // 1-indexed
      if (name !== undefined) sheet.getRange(row, 2).setValue(name.trim())
      if (price !== undefined) sheet.getRange(row, 3).setValue(Number(price) || 0)
      if (unit !== undefined) sheet.getRange(row, 4).setValue(unit.trim())
      return jsonResponse({ success: true })
    }
  }
  return jsonResponse({ success: false, error: 'SKU not found' })
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
