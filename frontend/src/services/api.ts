const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: RequestMethod
  body?: unknown
  headers?: Record<string, string>
}

async function tryRefresh(): Promise<string | null> {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return null
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
      return data.access_token
    }
    return null
  } catch {
    return null
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401) {
    // try refresh once
    const newToken = await tryRefresh()
    if (!newToken) {
      // redirect to login
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }

    // retry original request with new token
    const retry = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (!retry.ok) {
      throw new Error(`HTTP ${retry.status}`)
    }

    return retry.json() as Promise<T>
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}