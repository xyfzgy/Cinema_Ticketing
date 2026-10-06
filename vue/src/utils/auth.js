const TOKEN_KEY = 'cinema_token'
const USER_KEY = 'cinema_user'
const REFRESH_KEY = 'cinema_refresh_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function saveAuth(data) {
  const accessToken = data && (data.token || data.accessToken)
  if (accessToken) setToken(accessToken)
  if (data && data.user) setUser(data.user)
  if (data && data.user) {
    localStorage.setItem('username', data.user.username || data.user.name || '')
    localStorage.setItem('role', data.user.role || 'USER')
    localStorage.setItem(data.user.role === 'ADMIN' ? 'adminId' : 'customerId', String(data.user.id || ''))
  }
  if (accessToken) localStorage.setItem('token', accessToken)
  if (data && data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(REFRESH_KEY)
  ;['username', 'role', 'adminId', 'customerId', 'token'].forEach((key) => localStorage.removeItem(key))
}

export function isLoggedIn() {
  return !!getToken()
}

export function isAdmin() {
  const u = getUser()
  return !!u && u.role === 'ADMIN'
}
