import { getApiUrl } from './config'

async function request(path, options = {}) {
  const url = getApiUrl(path)
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  let data = {}
  try {
    const text = await res.text()
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }

  if (!res.ok) {
    const msg = data.error || data.message
    const details = data.details ? ` ${JSON.stringify(data.details)}` : ''
    throw new Error(msg ? `${msg}${details}` : `Request failed: ${res.status}`)
  }
  return data
}

export const api = {
  postBookings: (body) => request('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  postCoursePurchases: (body) => request('/api/course-purchases', { method: 'POST', body: JSON.stringify(body) }),
  postShopOrders: (body) => request('/api/shop-orders', { method: 'POST', body: JSON.stringify(body) }),
  postPaymentsCreateOrder: (body) => request('/api/payments/create-order', { method: 'POST', body: JSON.stringify(body) }),
  postPaymentsVerify: (body) => request('/api/payments/verify-payment', { method: 'POST', body: JSON.stringify(body) }),
  postChat: (body) => request('/api/chat', { method: 'POST', body: JSON.stringify(body) }),
}

export async function postCareerApplication(formData) {
  const url = getApiUrl('/api/career-applications')
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {}, // no Content-Type - browser sets multipart boundary
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed: ${res.status}`)
  }
  return data
}
