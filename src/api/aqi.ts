import aqi from '../data/aqi.json'
export type AqiRecord = (typeof aqi)[number]

export async function getAqiData(): Promise<AqiRecord[]> {
  return aqi
}
