import national from '../data/national.json'

export type NationalData = typeof national

export async function getNationalData(): Promise<NationalData> {
  return national
}
