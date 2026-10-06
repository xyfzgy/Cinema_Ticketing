import request from '@/utils/request'

export function listMyOrders() {
  return request.get('/order/list')
}

export function getOrder(id) {
  return request.get('/order/detail', { params: { id } })
}

export function createOrder(data, idempotencyKey) {
  return request.post('/order/create', data, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

export function cancelOrder(id) {
  return request.post('/order/cancel', null, { params: { id } })
}

export function confirmPay(orderId) {
  return request.post('/payment/confirm', null, { params: { orderId } })
}