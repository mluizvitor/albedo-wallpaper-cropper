import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CanvasProvider } from './hooks/useCanvas'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CanvasProvider>

      <App />

    </CanvasProvider>
  </React.StrictMode>,
)
