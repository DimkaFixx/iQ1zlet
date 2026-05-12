import { apiRequest } from '../../../services/api'

export interface AuthUser {
  id: number
  nickname: string
  email: string | null
  created_at?: string | null
}

export interface AuthResponse {
  message: string
  user: AuthUser
  access_token?: string
  token_type?: string
  refresh_token?: string
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  nickname: string
  email?: string
  password: string
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function refresh(refresh_token: string) {
  return apiRequest<{ access_token: string }>('/auth/refresh', {
    method: 'POST',
    body: { refresh_token },
  })
}