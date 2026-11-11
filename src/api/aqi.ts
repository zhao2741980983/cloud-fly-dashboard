import aqi from '../data/aqi.json'
export type AqiRecord = (typeof aqi)[number]

export async function getAqiData(): Promise<AqiRecord[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/aqi`)
    if (!response.ok) throw new Error('aqi请求失败')
    return (await response.json()) as AqiRecord[]
  } catch {
    return aqi
  }
}
