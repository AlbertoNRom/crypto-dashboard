import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './app/providers';
import App from './app/page';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);