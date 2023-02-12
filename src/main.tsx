import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CanvasProvider } from './hooks/useCanvas';
import { SystemsProvider } from './hooks/useSystemsCollection';
import { LoaderProvider } from './hooks/useLoader';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <LoaderProvider>
    <CanvasProvider>
      <SystemsProvider>
        <App />
      </SystemsProvider>
    </CanvasProvider>
  </LoaderProvider>
);
