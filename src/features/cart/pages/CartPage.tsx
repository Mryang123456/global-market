import { Button, Empty, InputNumber } from 'antd'
import { Link } from 'react-router-dom'
import { products } from '../../catalog/data/products'
import { useCart } from '../context/useCart'

export function CartPage() {
  const cart = useCart()
  const total = cart.lines.reduce((sum, line) => sum + (products.find((product) => product.id === line.id)?.price ?? 0) * line.quantity, 0)

  if (!cart.lines.length) return <main className="cart-page"><Empty description="Your bag is empty" /><Link to="/catalog">Continue shopping</Link></main>

  return <main className="cart-page"><section><h1>Your Bag</h1>{cart.lines.map((line) => { const product = products.find((item) => item.id === line.id)!; return <div className="line" key={`${line.id}|${line.size ?? ''}`}><b>{product.name}{line.size ? ` — ${line.size}` : ''}</b><span>${product.price}.00</span><InputNumber min={1} max={product.stock} value={line.quantity} onChange={(value) => cart.set(line.id, Number(value), line.size)} /><Button danger onClick={() => cart.set(line.id, 0, line.size)}>Remove</Button></div> })}<h2>Subtotal ${total}.00</h2><Button type="primary">Proceed to checkout (demo)</Button><p>No payment will be processed.</p></section></main>
}
