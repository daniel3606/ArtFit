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
  if (auth.access) cfg.headers.Authorization = `Bearer ${auth.access}`
  return cfg
})
