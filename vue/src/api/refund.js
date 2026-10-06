import request from '@/utils/request'

export function createRefund(data) {
  return request.post('/refund/create', data)
}

export function listRefunds(orderId) {
  return request.get('/refund/list', { params: { orderId } })
}