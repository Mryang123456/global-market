import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../app/app.css'
import '../app/fidelity.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
