import { App, Button, Empty, Select, Tag } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Product } from '../../../shared/lib/types'
import { useCart } from '../../cart/context/useCart'
import { CatalogFilters } from '../components/CatalogFilters'
import { CatalogProductCard } from '../components/CatalogProductCard'
import { products } from '../data/products'
import { useCatalogProducts } from '../hooks/useCatalogProducts'

type CatalogPageProps = { home?: boolean }

function toggle(values: string[], value: string, update: (next: string[]) => void) {
  update(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])
}

export function CatalogPage({ home = false }: CatalogPageProps) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const cart = useCart()
  const { message } = App.useApp()
  const query = params.get('q')?.trim() ?? ''
  const paramsKey = params.toString()
  const selectedCategories = useMemo(() => new URLSearchParams(paramsKey).getAll('category'), [paramsKey])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState(params.get('sort') === 'popular' ? 'Top rated' : 'Featured')
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set())
  const filteredProducts = useCatalogProducts({
    query,
    categories: selectedCategories,
    priceRange,
    colors: selectedColors,
    materials: selectedMaterials,
    inStockOnly,
    sort,
  })

  function updateCategories(next: string[]) {
    setParams((current) => {
      current.delete('category')
      next.forEach((category) => current.append('category', category))
      return current
    })
  }

  function addToCart(product: Product) {
    if (product.sizes?.length) {
      navigate(`/products/${product.id}`)
      return
    }
    cart.add(product.id)
    message.success(`${product.name} added to your bag`)
  }

  function clearFilters() {
    updateCategories([])
    setPriceRange([0, 500])
    setSelectedColors([])
    setSelectedMaterials([])
    setInStockOnly(false)
  }

  const activeFilters = selectedCategories.length + selectedColors.length + selectedMaterials.length
    + Number(priceRange[0] > 0 || priceRange[1] < 500) + Number(inStockOnly)

  return (
    <>
      {home && (
        <section className="hero">
          <div className="hero-copy">
            <h1>A more considered home, every day</h1>
            <p>Curated objects, apparel and essentials from around the world.</p>
            <Button type="primary" onClick={() => navigate('/catalog?category=Home%20%26%20Living')}>
              Shop Home &amp; Living
            </Button>
          </div>
        </section>
      )}
      <main className="catalog-layout">
        <CatalogFilters
          products={products}
          categoriesSelected={selectedCategories}
          onCategoriesChange={updateCategories}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          colorsSelected={selectedColors}
          onColorsChange={setSelectedColors}
          materialsSelected={selectedMaterials}
          onMaterialsChange={setSelectedMaterials}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          onClear={clearFilters}
        />
        <section className="catalog-content" aria-label="Products">
          <div className="catalog-toolbar">
            <div>
              <p className="catalog-eyebrow">Thoughtfully chosen, made to last</p>
              <h2>{filteredProducts.length} products</h2>
            </div>
            <label className="sort-control">
              <span>Sort by</span>
              <Select
                aria-label="Sort products"
                value={sort}
                options={['Featured', 'Price: Low to high', 'Price: High to low', 'Top rated'].map((value) => ({ value }))}
                onChange={setSort}
              />
            </label>
          </div>
          <div className="filter-summary" aria-live="polite">
            {selectedCategories.map((item) => (
              <Tag closable onClose={() => toggle(selectedCategories, item, updateCategories)} key={item}>{item}</Tag>
            ))}
            {selectedColors.map((item) => (
              <Tag closable onClose={() => toggle(selectedColors, item, setSelectedColors)} key={item}>{item}</Tag>
            ))}
            {selectedMaterials.map((item) => (
              <Tag closable onClose={() => toggle(selectedMaterials, item, setSelectedMaterials)} key={item}>{item}</Tag>
            ))}
            {inStockOnly && <Tag closable onClose={() => setInStockOnly(false)}>In stock</Tag>}
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <Tag closable onClose={() => setPriceRange([0, 500])}>${priceRange[0]} – ${priceRange[1]}</Tag>
            )}
            {activeFilters === 0 && query && <Tag>Search: {query}</Tag>}
          </div>
          {filteredProducts.length ? (
            <div className="grid">
              {filteredProducts.map((product) => (
                <CatalogProductCard
                  key={product.id}
                  product={product}
                  favorite={favorites.has(product.id)}
                  onFavoriteToggle={() => setFavorites((current) => {
                    const next = new Set(current)
                    if (next.has(product.id)) next.delete(product.id)
                    else next.add(product.id)
                    return next
                  })}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>
          ) : (
            <Empty description="No products match your filters" />
          )}
        </section>
      </main>
    </>
  )
}
