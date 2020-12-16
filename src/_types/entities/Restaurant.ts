export interface Restaurant {
  id: string

  name: string
  address1: string
  city: string
  state: string
  zip: string
  telephone: string // Formatted (123) 123-4567

  lat: string
  long: string

  tags: string // Comma-separated
  genre: string //  Comma-separated
  attire: string
  website: string
  hours: string
}
