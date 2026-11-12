import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { createStore } from '../redux';

export const apiMock = {
  USD: { codein: 'BRL', name: 'Dólar Americano/Real Brasileiro', ask: '5.00' },
  EUR: { codein: 'BRL', name: 'Euro/Real Brasileiro', ask: '6.00' },
  USDT: { codein: 'BRLT', name: 'Tether/Real Brasileiro Turismo', ask: '5.1' },
};

export function mockRatesApi() {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => apiMock })));
}

export function renderApp(ui: ReactElement, route = '/') {
  const store = createStore();
  const user = userEvent.setup();
  render(
    <Provider store={ store }>
      <MemoryRouter
        initialEntries={ [route] }
        future={ { v7_startTransition: true, v7_relativeSplatPath: true } }
      >
        {ui}
      </MemoryRouter>
    </Provider>,
  );
  return { store, user };
}
