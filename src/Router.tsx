import React, {JSX} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router';

// Helpers
import ErrorBoundaryRouter from '@/helpers/ErrorBoundary';
import Preloader from '@/helpers/Preloader';

// Components
import Dispatcher from '@/views/Dispatcher';

/**
 * Application router
 *
 * @returns {JSX.Element}
 * @constructor
 */
function AppRouter(): JSX.Element {
  return (
    <React.Suspense fallback={<Preloader />}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={<Dispatcher />}
            errorElement={<ErrorBoundaryRouter />}
          />
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}

export default AppRouter;
