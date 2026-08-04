export type Theme = 'light' | 'dark'

export interface Moment {
  id: string
  title: string
  date: string // ISO date, yyyy-mm-dd
  description: string
  photos: string[] // urls or base64 data URIs
  seeded?: boolean
}
