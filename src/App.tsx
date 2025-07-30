import React, {JSX} from 'react';
import ReactDOM from 'react-dom/client';

// Helpers
import ErrorBoundary from '@/helpers/ErrorBoundary';

// Router
import AppRouter from './Router';

// Store providers
import { CSVsProvider } from '@/store/providers/CSVsProvider';

// Locales
import './Locales';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/js/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

/**
 * Main application
 *
 * @returns {JSX.Element}
 * @constructor
 */
function App(): JSX.Element {
  return (
    <CSVsProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </CSVsProvider>
  );
}

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <App />
  );
}
