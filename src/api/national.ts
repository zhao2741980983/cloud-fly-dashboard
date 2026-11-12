import national from '../data/national.json'
import { fetchApi } from './client'

export type NationalData = typeof national

export function getNationalData(): Promise<NationalData> {
  /**
   * 配置了 VITE_API_BASE 时请求 `${VITE_API_BASE}/api/national`；
   * 未配置（线上 GitHub Pages）时直接返回本地 JSON，不再发起请求。
   */
  return fetchApi<NationalData>('/api/national', national)
}
