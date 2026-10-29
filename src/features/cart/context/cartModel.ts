import { products } from '../../catalog/data/products'
import type { CartLine } from '../../../shared/lib/types'

export type CartState = { lines: CartLine[] }
export type CartAction =
  | { type: 'add'; id: string; size?: string }
  | { type: 'set'; id: string; quantity: number; size?: string }

const lineKey = (id: string, size?: string) => `${id}|${size ?? ''}`
const emptyState = (): CartState => ({ lines: [] })

function validLine(value: unknown): CartLine | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<CartLine>
  if (typeof candidate.id !== 'string' || !Number.isInteger(candidate.quantity) || (candidate.quantity ?? 0) < 1) {
    return null
  }
  const product = products.find((item) => item.id === candidate.id)
  if (!product || candidate.quantity! > product.stock) return null
  if (product.sizes?.length) {
    if (typeof candidate.size !== 'string' || !product.sizes.includes(candidate.size)) return null
  } else if (candidate.size !== undefined) {
    return null
  }
  return { id: candidate.id, size: candidate.size, quantity: candidate.quantity! }
}

export function readCartState(raw: string | null): { state: CartState; invalid: boolean } {
  if (raw === null) return { state: emptyState(), invalid: false }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { state: emptyState(), invalid: true }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { state: emptyState(), invalid: true }
  }
  const stored = parsed as { version?: unknown; lines?: unknown }
  if (stored.version !== 1 || !Array.isArray(stored.lines)) {
    return { state: emptyState(), invalid: true }
  }

  const lines = new Map<string, CartLine>()
  let invalid = false
  for (const rawLine of stored.lines) {
    const line = validLine(rawLine)
    if (!line) {
      invalid = true
      continue
    }
    const key = lineKey(line.id, line.size)
    const existing = lines.get(key)
    const quantity = Math.min(line.quantity + (existing?.quantity ?? 0), products.find((item) => item.id === line.id)!.stock)
    if (existing) invalid = true
    lines.set(key, { ...line, quantity })
  }
  return { state: { lines: [...lines.values()] }, invalid }
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  const product = products.find((item) => item.id === action.id)
  if (!product || (product.sizes?.length && (!action.size || !product.sizes.includes(action.size)))) return state
  if (!product.sizes?.length && action.size !== undefined) return state

  const key = lineKey(action.id, action.size)
  const existing = state.lines.find((line) => lineKey(line.id, line.size) === key)
  const requestedQuantity = action.type === 'add'
    ? (existing?.quantity ?? 0) + 1
    : Number.isFinite(action.quantity) ? Math.floor(action.quantity) : 0
  const quantity = Math.max(0, Math.min(requestedQuantity, product.stock))
  const otherLines = state.lines.filter((line) => lineKey(line.id, line.size) !== key)

  return {
    lines: quantity > 0
      ? [...otherLines, { id: action.id, size: action.size, quantity }]
      : otherLines,
  }
}

export function serializeCartState(state: CartState): string {
  return JSON.stringify({ version: 1, ...state })
}
