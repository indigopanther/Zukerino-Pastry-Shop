import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FigmentLock from './figment-lock/FigmentLock'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FigmentLock siteId="977841b1-f003-44ca-b3c3-d67b745a49b1">
      <App />
    </FigmentLock>
  </StrictMode>,
)