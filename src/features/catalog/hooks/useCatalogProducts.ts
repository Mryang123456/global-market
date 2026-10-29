import { useMemo } from 'react'
import type { Product } from '../../../shared/lib/types'
import { products } from '../data/products'

export type CatalogFilters = {
  query: string
  categories: string[]
  priceRange: [number, number]
  colors: string[]
  materials: string[]
  inStockOnly: boolean
  sort: string
}

export function filterCatalogProducts(filters: CatalogFilters, catalog: Product[] = products): Product[] {
  const query = filters.query.trim().toLowerCase()
  const filtered = catalog.filter((product) => {
    const matchesQuery = !query || [product.name, product.category, product.brand, product.material]
      .join(' ')
      .toLowerCase()
      .includes(query)
    return matchesQuery
      && (!filters.categories.length || filters.categories.includes(product.category))
      && product.price >= filters.priceRange[0]
      && product.price <= filters.priceRange[1]
      && (!filters.colors.length || filters.colors.includes(product.color))
      && (!filters.materials.length || filters.materials.includes(product.material))
      && (!filters.inStockOnly || product.stock > 0)
  })

  return filtered.toSorted((a, b) => {
    if (filters.sort === 'Price: Low to high') return a.price - b.price
    if (filters.sort === 'Price: High to low') return b.price - a.price
    if (filters.sort === 'Top rated') return b.rating - a.rating
    return 0
  })
}

export function useCatalogProducts(filters: CatalogFilters): Product[] {
  const { categories, colors, inStockOnly, materials, priceRange, query, sort } = filters
  return useMemo(() => filterCatalogProducts({
    categories,
    colors,
    inStockOnly,
    materials,
    priceRange,
    query,
    sort,
  }), [
    categories,
    colors,
    inStockOnly,
    materials,
    priceRange,
    query,
    sort,
  ])
}
