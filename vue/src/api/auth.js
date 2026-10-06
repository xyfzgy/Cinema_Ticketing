import request from '@/utils/request'

export function register(data) {
  return request.post('/auth/register', data)
}

export function login(data) {
  return request.post('/auth/login', data)
}

export function logout() {
  return request.post('/auth/logout')
}

export function refresh() {
  return request.post('/auth/refresh', { refreshToken: localStorage.getItem('cinema_refresh_token') })
}

export function getProfile() {
  return request.get('/auth/me')
}

export function updateProfile(phone) {
  return request.put('/auth/user', { phone })
}

