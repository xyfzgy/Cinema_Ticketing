import request from '@/utils/request'

export function listScreenings() {
  return request.get('/schedule/page', { params: { current: 1, size: 100, onlyFuture: true }, silent: true }).then((page) => page?.records || [])
}

export function getScreening(id) {
  return request.get(`/schedule/${id}`)
}

// 场次座位，返回 ScreeningSeat 列表
export function getScreeningSeats(screeningId) {
  return request.get(`/seat/${screeningId}`)
}
