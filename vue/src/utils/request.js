import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, getRefreshToken, saveAuth, clearAuth } from './auth'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090',
  timeout: 20000,
})

// 请求拦截器：统一打包 JWT 到 Authorization 请求头
service.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 续期控制：并发 401 时共享同一个 refresh Promise，避免重复刷新/重复 revoke
let refreshing = false
let refreshPromise = null

function refreshToken() {
  const token = getRefreshToken()
  if (!token) return Promise.resolve(false)
  if (!refreshing) {
    refreshing = true
    refreshPromise = axios
      .post(`${service.defaults.baseURL}/auth/refresh`, { refreshToken: token })
      .then((res) => {
        const body = res.data
        if (body && (body.code === '200' || body.code === 200) && body.data && body.data.accessToken) {
          saveAuth({ ...body.data, token: body.data.accessToken })
          return true
        }
        return false
      })
      .catch(() => false)
      .finally(() => {
        refreshing = false
        refreshPromise = null
      })
  }
  return refreshPromise
}

const noRefreshUrls = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端统一返回 { code, msg, data }，成功 code 为 "200"
    if (res && (res.code === '200' || res.code === 200)) {
      return res.data
    }
    const msg = (res && (res.message || res.msg)) || '请求失败'
    if (![2001, 2002, 2003].includes(Number(res?.code)) && !response.config?.silent) ElMessage.error(msg)
    if ([2001, 2002, 2003].includes(Number(res?.code))) {
      clearAuth()
      ElMessage.warning('登录已失效，请重新登录')
      if (router.currentRoute.value.path !== '/login') router.push('/login')
    }
    return Promise.reject(new Error(msg))
  },
  async (error) => {
    const { response, config } = error
    const status = response && response.status
    const data = response && response.data
    const msg = (data && (data.message || data.msg)) || (status ? error.message : '无法连接服务器，请检查后端服务')
    const url = (config && config.url) || ''

    // 401 且非登录相关接口时，先尝试用 refresh 续期并重试一次
    const canRefresh =
      status === 401 &&
      config &&
      !config._retried &&
      !noRefreshUrls.some((u) => url.includes(u))

    if (canRefresh) {
      config._retried = true
      const ok = await refreshToken()
      if (ok) {
        config.headers.Authorization = `Bearer ${getToken()}`
        return service(config)
      }
    }

    if (status === 401) {
      clearAuth()
      ElMessage.error('登录已失效，请重新登录')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    } else {
      ElMessage.error(msg)
    }
    return Promise.reject(error)
  },
)

export default service

