import { useContext } from 'react'
import { CartContext } from './cartStore'

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within a CartProvider')
  return value
}
