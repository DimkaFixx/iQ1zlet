import { apiRequest } from '../../../services/api'

export interface HelloResponse {
  id: number
  hello: string
}

export async function getHello(): Promise<HelloResponse> {
  return apiRequest<HelloResponse>('/hello/')
}