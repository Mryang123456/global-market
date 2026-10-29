import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { CartLine } from '../../../shared/lib/types'
import { cartReducer, readCartState, serializeCartState } from './cartModel'
import { CartContext, type CartContextValue } from './cartStore'

function loadCart() {
  if (typeof window === 'undefined') return { lines: [] as CartLine[] }
  try {
    const result = readCartState(window.localStorage.getItem('cart:v1'))
    if (result.invalid) console.warn('Invalid cart data was found in localStorage and has been discarded.')
    return result.state
  } catch (error) {
    console.error('Unable to read the saved cart from localStorage.', error)
    return { lines: [] }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem('cart:v1', serializeCartState(state))
    } catch (error) {
      console.error('Unable to save the cart to localStorage.', error)
    }
  }, [state])

  const value = useMemo<CartContextValue>(() => ({
    lines: state.lines,
    count: state.lines.reduce((sum, line) => sum + line.quantity, 0),
    drawerOpen,
    setDrawerOpen,
    add: (id, size) => dispatch({ type: 'add', id, size }),
    set: (id, quantity, size) => dispatch({ type: 'set', id, quantity, size }),
  }), [state, drawerOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
