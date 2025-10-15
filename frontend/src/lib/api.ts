import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export const auth = {
  get access() { return localStorage.getItem('access') },
  set access(v: string | null) {
    if (v) {
      localStorage.setItem('access', v);
    } else {
      localStorage.removeItem('access');
    }
  },
  get refresh() { return localStorage.getItem('refresh') },
  set refresh(v: string | null) {
    if (v) {
      localStorage.setItem('refresh', v);
    } else {
      localStorage.removeItem('refresh');
    }
  },
  clear() { localStorage.removeItem('access'); localStorage.removeItem('refresh') }
}

export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use(cfg => {
  if (auth.access) {
    cfg.headers.Authorization = `Bearer ${auth.access}`
    console.log('Adding auth header:', cfg.headers.Authorization)
  } else {
    console.log('No access token found')
  }
  return cfg
})

// Auto-refresh access token on 401 responses
let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

function onRefreshed(newAccessToken: string | null) {
  pendingRequests.forEach(cb => cb(newAccessToken))
  pendingRequests = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!auth.refresh) {
        auth.clear()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            } else {
              reject(error)
            }
          })
        })
      }

      isRefreshing = true
      try {
        const resp = await api.post('/token/refresh/', { refresh: auth.refresh })
        const newAccess = resp.data?.access as string | undefined
        if (newAccess) {
          auth.access = newAccess
          onRefreshed(newAccess)
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return api(originalRequest)
        }
        auth.clear()
        onRefreshed(null)
        return Promise.reject(error)
      } catch (e) {
        auth.clear()
        onRefreshed(null)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
