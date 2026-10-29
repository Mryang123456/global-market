import { App as AntdApp, ConfigProvider } from 'antd'
import { CartProvider } from '../features/cart/context/CartContext'
import { AppRouter } from './router'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#174d3b',
          borderRadius: 6,
          fontFamily: 'Inter, Arial, sans-serif',
        },
      }}
    >
      <CartProvider>
        <AntdApp>
          <AppRouter />
        </AntdApp>
      </CartProvider>
    </ConfigProvider>
  )
}
