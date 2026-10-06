import request from '@/utils/request'

export function listCinemas() {
  return Promise.reject(new Error('影院模块暂未提供后端接口'))
}

export function listHalls(cinemaId) {
  return Promise.reject(new Error('影院模块暂未提供后端接口'))
}

export function adminListCinemas() {
  return request.get('/admin/hall/list').then((page) => page?.records || [])
}

export function adminCreateCinema(data) {
  return request.post('/admin/hall', data)
}

export function adminUpdateCinema(data) {
  return request.put('/admin/hall', data)
}

