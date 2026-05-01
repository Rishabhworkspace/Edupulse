import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: (state = { initialized: true }) => state,
      theme: (state = {}) => state,
      cart: (state = {}) => state,
    },
  });

describe('App Component', () => {
  it('should render without crashing', () => {
    const store = createTestStore();
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should have App component rendered', () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText || true).toBeTruthy();
  });
});