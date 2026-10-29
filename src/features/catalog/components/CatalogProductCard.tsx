import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Button, Rate } from 'antd'
import type { Product } from '../../../shared/lib/types'

type CatalogProductCardProps = {
  product: Product
  favorite: boolean
  onFavoriteToggle: () => void
  onAdd: () => void
}

export function CatalogProductCard({ product, favorite, onFavoriteToggle, onAdd }: CatalogProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <Button
          className="favorite-button"
          type="text"
          aria-label={`${favorite ? 'Remove' : 'Add'} ${product.name} ${favorite ? 'from' : 'to'} favorites`}
          aria-pressed={favorite}
          icon={favorite ? <HeartFilled /> : <HeartOutlined />}
          onClick={onFavoriteToggle}
        />
      </div>
      <p className="product-category">{product.category}</p>
      <h3>{product.name}</h3>
      <b>${product.price.toFixed(2)}</b>
      <div className="product-rating">
        <Rate disabled value={product.rating} />
        <span>({product.reviewCount})</span>
      </div>
      <span className={`stock-status${product.stock ? '' : ' sold-out'}`}>
        <i />{product.stock ? 'In stock' : 'Sold out'}
      </span>
      <Button className="add-to-cart-button" disabled={!product.stock} onClick={onAdd}>
        {product.sizes?.length ? 'Choose options' : 'Add to cart'}
      </Button>
    </article>
  )
}
