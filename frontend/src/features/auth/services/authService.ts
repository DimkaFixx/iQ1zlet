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