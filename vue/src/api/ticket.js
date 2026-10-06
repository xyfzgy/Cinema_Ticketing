import request from '@/utils/request'

export function listTickets(orderId) {
  return request.get('/ticket/list', { params: { orderId } })
}