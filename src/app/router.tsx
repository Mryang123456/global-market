import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartDrawer } from '../features/cart/components/CartDrawer'
import { CartPage } from '../features/cart/pages/CartPage'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { ProductPage } from '../features/product/pages/ProductPage'
import { AppHeader } from '../shared/components/AppHeader'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<CatalogPage home />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CartDrawer />
    </BrowserRouter>
  )
}
