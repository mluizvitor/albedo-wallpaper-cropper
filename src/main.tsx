import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CanvasProvider } from './hooks/useCanvas';
import { SystemsProvider } from './hooks/useSystemsCollection';
import { LoaderProvider } from './hooks/useLoader';
import { SettingsProvider } from './hooks/useSettings';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <LoaderProvider>
    <SettingsProvider>
      <CanvasProvider>
        <SystemsProvider>
          <App />
        </SystemsProvider>
      </CanvasProvider>
    </SettingsProvider>
  </LoaderProvider>
);
