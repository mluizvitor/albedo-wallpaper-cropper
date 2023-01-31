import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { CanvasProvider } from "./hooks/useCanvas"
import { SystemsProvider } from "./hooks/useSystemsCollection"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CanvasProvider>
      <SystemsProvider>
        <App />
      </SystemsProvider>
    </CanvasProvider>
  </React.StrictMode>
)
