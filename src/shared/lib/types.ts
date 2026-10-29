export type Product = {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviewCount: number
  stock: number
  image: string
  color: string
  material: string
  brand: string
  sizes?: string[]
  description: string
}

export type CartLine = { id: string; size?: string; quantity: number }
