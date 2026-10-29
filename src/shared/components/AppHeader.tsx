import { ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { App, Badge, Button, Input } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../features/cart/context/useCart'

const categories = ['Home & Living', 'Apparel', 'Accessories', 'Kitchen & Dining']

export function AppHeader() {
  const cart = useCart()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const searchQuery = new URLSearchParams(location.search).get('q') ?? ''
  const currentCategory = new URLSearchParams(location.search).get('category')
  const onCatalog = location.pathname === '/catalog'

  function search(value: string) {
    const params = new URLSearchParams()
    if (value.trim()) params.set('q', value.trim())
    navigate(`/catalog${params.size ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="site-header">
      <header className="header-main">
        <Link className="brand" to="/" aria-label="Global Goods home">Global Goods</Link>
        <HeaderSearch key={searchQuery} initialQuery={searchQuery} onSearch={search} />
        <div className="header-actions">
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => message.info('Sign in is not available in this demo.')}
          >
            <span className="sign-in-label">Sign in</span>
          </Button>
          <Button
            aria-label="Open shopping bag"
            type="text"
            icon={<Badge count={cart.count} size="small"><ShoppingOutlined /></Badge>}
            onClick={() => cart.setDrawerOpen(true)}
          />
        </div>
      </header>
      <nav className="category-nav" aria-label="Product categories">
        <Link className={onCatalog && !currentCategory ? 'category-link active' : 'category-link'} to="/catalog">New In</Link>
        {categories.map((category) => (
          <Link
            key={category}
            to={`/catalog?category=${encodeURIComponent(category)}`}
            className={currentCategory === category ? 'category-link active' : 'category-link'}
          >
            {category}
          </Link>
        ))}
        {['Wellness', 'Travel', 'Gifts', 'Editorial'].map((item) => (
          <button
            className="category-link category-link-disabled"
            key={item}
            type="button"
            disabled
            title={`${item} collection coming soon`}
          >
            {item} <span className="coming-soon">Coming soon</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function HeaderSearch({ initialQuery, onSearch }: { initialQuery: string; onSearch: (query: string) => void }) {
  const [query, setQuery] = useState(initialQuery)
  return (
    <Input.Search
      aria-label="Search products"
      placeholder="Search for products, categories, or inspiration..."
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onSearch={onSearch}
    />
  )
}
