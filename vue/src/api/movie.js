import request from '@/utils/request'

// 公开电影分页
export function listMovies(params) {
  return request.get('/movie/list', { params })
}

export function getMovie(id) {
  return request.get(`/movie/${id}`)
}

// 后台电影管理（create/update 走表单绑定，status 走 JSON）
export function adminListMovies(params) {
  return request.get('/admin/movie/list', { params })
}

export function adminCreateMovie(data) {
  return request.post('/admin/movie', data)
}

export function adminUpdateMovie(data) {
  return request.put('/admin/movie', data)
}

export function adminUpdateMovieStatus(data) {
  return request.put(`/admin/movie/${data.id}/status`, null, { params: { status: data.status } })
}

