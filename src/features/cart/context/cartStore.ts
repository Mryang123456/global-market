import { createContext } from 'react'
import type { CartLine } from '../../../shared/lib/types'

export type CartContextValue = {
  lines: CartLine[]
  count: number
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  add: (id: string, size?: string) => void
  set: (id: string, quantity: number, size?: string) => void
}

export const CartContext = createContext<CartContextValue | null>(null)
