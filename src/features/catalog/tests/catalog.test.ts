import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { filterCatalogProducts, type CatalogFilters } from '../hooks/useCatalogProducts'

const defaultFilters: CatalogFilters = {
  query: '',
  categories: [],
  priceRange: [0, 500],
  colors: [],
  materials: [],
  inStockOnly: false,
  sort: 'Featured',
}

describe('catalogue', () => {
  it('has searchable metadata and non-negative stock', () => {
    expect(products.every((product) => product.name && product.brand && product.color && product.stock >= 0)).toBe(true)
  })

  it('filters catalog results by search, category, price, color, material, and stock', () => {
    const result = filterCatalogProducts({
      ...defaultFilters,
      query: 'canvas',
      categories: ['Apparel'],
      priceRange: [50, 100],
      colors: ['White'],
      materials: ['Cotton'],
      inStockOnly: true,
    })

    expect(result.map((product) => product.id)).toEqual(['sneakers'])
  })

  it('sorts filtered products by price and rating', () => {
    const lowToHigh = filterCatalogProducts({ ...defaultFilters, sort: 'Price: Low to high' })
    const topRated = filterCatalogProducts({ ...defaultFilters, sort: 'Top rated' })

    expect(lowToHigh[0].price).toBeLessThanOrEqual(lowToHigh[1].price)
    expect(topRated[0].rating).toBeGreaterThanOrEqual(topRated[1].rating)
  })
})
