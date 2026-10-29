import { App, Button, Rate, Select } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../../cart/context/useCart'
import { products } from '../../catalog/data/products'

export function ProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.id === slug)
  const [size, setSize] = useState<string>()
  const navigate = useNavigate()
  const cart = useCart()
  const { message } = App.useApp()

  if (!product) {
    return <main className="not-found"><h1>Product not found</h1><Button onClick={() => navigate('/catalog')}>Back to catalog</Button></main>
  }

  const needsSize = Boolean(product.sizes?.length)

  return (
    <main className="product-detail">
      <img className="detail-image" src={product.image} alt={product.name} />
      <section className="detail-copy">
        <Button type="link" onClick={() => navigate(-1)}>← Back to shopping</Button>
        <p className="product-category">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="detail-rating"><Rate disabled value={product.rating} /><span>({product.reviewCount} reviews)</span></div>
        <h2>${product.price.toFixed(2)}</h2>
        <p>{product.description}</p>
        <p className="detail-stock">{product.stock ? 'In stock and ready to ship' : 'Currently sold out'}</p>
        {needsSize && (
          <label className="size-select">
            <span>Choose size</span>
            <Select
              aria-label="Select size"
              placeholder="Select size"
              value={size}
              options={product.sizes?.map((value) => ({ value }))}
              onChange={setSize}
            />
          </label>
        )}
        <Button
          className="detail-add-button"
          type="primary"
          disabled={!product.stock || (needsSize && !size)}
          onClick={() => {
            cart.add(product.id, size)
            cart.setDrawerOpen(true)
            message.success(`${product.name} added to your bag`)
          }}
        >
          Add to bag
        </Button>
      </section>
    </main>
  )
}
