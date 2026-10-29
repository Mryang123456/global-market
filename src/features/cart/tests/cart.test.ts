import { describe, expect, it } from 'vitest'
import { products } from '../../catalog/data/products'
import { cartReducer, readCartState } from '../context/cartModel'

describe('cart stock policy', () => {
  it('defines a whole-number stock ceiling for every product', () => {
    expect(products.every((product) => Number.isInteger(product.stock) && product.stock >= 0)).toBe(true)
  })

  it('keeps different product variants in separate cart lines', () => {
    const first = cartReducer({ lines: [] }, { type: 'add', id: 'sneakers', size: 'EU 38' })
    const second = cartReducer(first, { type: 'add', id: 'sneakers', size: 'EU 39' })

    expect(second.lines).toEqual([
      { id: 'sneakers', size: 'EU 38', quantity: 1 },
      { id: 'sneakers', size: 'EU 39', quantity: 1 },
    ])
  })

  it('caps quantities at stock and removes zero-quantity lines', () => {
    const capped = cartReducer({ lines: [] }, { type: 'set', id: 'vase', quantity: 100 })
    expect(capped.lines).toEqual([{ id: 'vase', size: undefined, quantity: 8 }])
    expect(cartReducer(capped, { type: 'set', id: 'vase', quantity: 0 }).lines).toEqual([])
  })

  it('discards malformed, unavailable, and invalid-variant saved lines', () => {
    const result = readCartState(JSON.stringify({
      version: 1,
      lines: [
        { id: 'vase', quantity: 2 },
        { id: 'missing', quantity: 1 },
        { id: 'sneakers', size: 'EU 99', quantity: 1 },
        { id: 'vase', quantity: 1.5 },
      ],
    }))

    expect(result.invalid).toBe(true)
    expect(result.state.lines).toEqual([{ id: 'vase', size: undefined, quantity: 2 }])
  })

  it('rejects unknown storage versions and malformed JSON', () => {
    expect(readCartState('{"version":2,"lines":[]}')).toEqual({ state: { lines: [] }, invalid: true })
    expect(readCartState('{bad json')).toEqual({ state: { lines: [] }, invalid: true })
  })
})
