import aqi from '../data/aqi.json'
import { fetchApi } from './client'

export type AqiRecord = (typeof aqi)[number]

export function getAqiData(): Promise<AqiRecord[]> {
  return fetchApi<AqiRecord[]>('/api/aqi', aqi)
}
