import { App, Button, Drawer, Empty, InputNumber } from 'antd'
import { Link } from 'react-router-dom'
import { products } from '../../catalog/data/products'
import { useCart } from '../context/useCart'

const recommendedIds = ['pillow', 'mug', 'blanket']

export function CartDrawer() {
  const cart = useCart()
  const { message } = App.useApp()
  const subtotal = cart.lines.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.id)
    return sum + (product?.price ?? 0) * line.quantity
  }, 0)
  const recommendations = recommendedIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product && !cart.lines.some((line) => line.id === product.id))

  return (
    <Drawer
      className="cart-drawer"
      title={`Your Bag (${cart.count})`}
      open={cart.drawerOpen}
      onClose={() => cart.setDrawerOpen(false)}
      size="default"
      styles={{ wrapper: { width: 'min(480px, 100vw)' } }}
      destroyOnHidden={false}
    >
      <div className="cart-drawer-content">
        {cart.lines.length ? (
          <div className="drawer-lines">
            {cart.lines.map((line) => {
              const product = products.find((item) => item.id === line.id)
              if (!product) return null
              return (
                <article className="drawer-line" key={`${line.id}|${line.size ?? ''}`}>
                  <img src={product.image} alt="" />
                  <div className="drawer-line-info">
                    <Link to={`/products/${product.id}`} onClick={() => cart.setDrawerOpen(false)}>
                      {product.name}{line.size ? ` — ${line.size}` : ''}
                    </Link>
                    <b>${product.price.toFixed(2)}</b>
                    <InputNumber
                      aria-label={`Quantity of ${product.name}`}
                      min={1}
                      max={product.stock}
                      value={line.quantity}
                      onChange={(value) => cart.set(line.id, Number(value), line.size)}
                    />
                  </div>
                  <Button
                    className="remove-line"
                    type="text"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => cart.set(line.id, 0, line.size)}
                  >
                    ×
                  </Button>
                </article>
              )
            })}
          </div>
        ) : (
          <Empty className="drawer-empty" description="Your bag is empty">
            <Button type="primary" onClick={() => cart.setDrawerOpen(false)}>Continue shopping</Button>
          </Empty>
        )}
        {cart.lines.length > 0 && (
          <section className="drawer-checkout">
            <div className="subtotal-row"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
            <Button block type="primary" onClick={() => message.info('Checkout is a demo. No payment will be processed.')}>
              Proceed to checkout (demo)
            </Button>
            <p>This is a demo experience. No payment will be processed.</p>
          </section>
        )}
        {recommendations.length > 0 && (
          <section className="recommendations">
            <h2>You may also like</h2>
            {recommendations.map((product) => product && (
              <article className="recommendation-item" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div><b>{product.name}</b><span>${product.price.toFixed(2)}</span></div>
                <Button
                  disabled={!product.stock}
                  onClick={() => {
                    cart.add(product.id)
                    message.success(`${product.name} added to your bag`)
                  }}
                >
                  Add
                </Button>
              </article>
            ))}
          </section>
        )}
      </div>
    </Drawer>
  )
}
