import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { store } from './redux';
import { attachPersistence } from './redux/persist';

attachPersistence(store);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={ store }>
      <BrowserRouter future={ { v7_startTransition: true, v7_relativeSplatPath: true } }>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
