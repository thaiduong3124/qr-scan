export const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN').format(Number(price) || 0) + ' ₫'
