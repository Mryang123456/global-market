import { Button, Checkbox, InputNumber, Slider } from 'antd'
import type { ReactNode } from 'react'
import type { Product } from '../../../shared/lib/types'

const categories = ['Home & Living', 'Apparel', 'Accessories', 'Kitchen & Dining']
const colors = ['Green', 'Cream', 'Brown', 'White', 'Olive']
const materials = ['Cotton', 'Linen', 'Ceramic', 'Wood', 'Leather']

type CatalogFiltersProps = {
  products: Product[]
  categoriesSelected: string[]
  onCategoriesChange: (value: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (value: [number, number]) => void
  colorsSelected: string[]
  onColorsChange: (value: string[]) => void
  materialsSelected: string[]
  onMaterialsChange: (value: string[]) => void
  inStockOnly: boolean
  onInStockChange: (value: boolean) => void
  onClear: () => void
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="filter-section">
      <h3>{title}</h3>
      <div className="filter-section-content">{children}</div>
    </section>
  )
}

function toggle(values: string[], value: string, onChange: (value: string[]) => void) {
  onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])
}

export function CatalogFilters({
  products,
  categoriesSelected,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  colorsSelected,
  onColorsChange,
  materialsSelected,
  onMaterialsChange,
  inStockOnly,
  onInStockChange,
  onClear,
}: CatalogFiltersProps) {
  return (
    <aside className="filter-sidebar" aria-label="Product filters">
      <div className="filter-heading">
        <h2>Filters</h2>
        <Button type="link" onClick={onClear}>Clear all</Button>
      </div>
      <FilterSection title="Category">
        {categories.map((category) => (
          <Checkbox
            key={category}
            checked={categoriesSelected.includes(category)}
            onChange={() => toggle(categoriesSelected, category, onCategoriesChange)}
          >
            <span className="filter-option-label">{category}</span>
            <span className="filter-count">{products.filter((item) => item.category === category).length}</span>
          </Checkbox>
        ))}
      </FilterSection>
      <FilterSection title="Price (USD)">
        <div className="price-inputs">
          <InputNumber
            aria-label="Minimum price"
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            formatter={(value) => `$ ${value}`}
            onChange={(value) => onPriceRangeChange([Math.min(Number(value ?? 0), priceRange[1]), priceRange[1]])}
          />
          <InputNumber
            aria-label="Maximum price"
            min={priceRange[0]}
            max={500}
            value={priceRange[1]}
            formatter={(value) => `$ ${value}`}
            onChange={(value) => onPriceRangeChange([priceRange[0], Math.max(Number(value ?? 500), priceRange[0])])}
          />
        </div>
        <Slider range min={0} max={500} value={priceRange} onChange={(value) => onPriceRangeChange(value as [number, number])} />
      </FilterSection>
      <FilterSection title="Color">
        <div className="color-options">
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              aria-label={`Filter color ${color}`}
              aria-pressed={colorsSelected.includes(color)}
              className={`color-swatch color-${color.toLowerCase()}${colorsSelected.includes(color) ? ' selected' : ''}`}
              onClick={() => toggle(colorsSelected, color, onColorsChange)}
            />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Material">
        {materials.map((material) => (
          <Checkbox
            key={material}
            checked={materialsSelected.includes(material)}
            onChange={() => toggle(materialsSelected, material, onMaterialsChange)}
          >
            <span className="filter-option-label">{material}</span>
            <span className="filter-count">{products.filter((item) => item.material === material).length}</span>
          </Checkbox>
        ))}
      </FilterSection>
      <FilterSection title="Availability">
        <Checkbox checked={inStockOnly} onChange={(event) => onInStockChange(event.target.checked)}>
          In stock <span className="filter-count">{products.filter((item) => item.stock > 0).length}</span>
        </Checkbox>
      </FilterSection>
    </aside>
  )
}
