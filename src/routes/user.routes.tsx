import React from 'react';
import {Route, Routes} from "react-router";


// Helpers
import ErrorBoundaryRouter from '@/helpers/ErrorBoundary';

// Pages
import UploadFile from '@/views/pages/employees/UploadFile';
import Data from '@/views/pages/employees/Data';

/**
 * Define routes which require authentication
 */
function UserRoutes() {
  return (
    <Routes>
      test
      <Route
        path="/"
        errorElement={<ErrorBoundaryRouter />}
        element={<UploadFile />}
      />
      <Route
        path="/data/:dataId"
        errorElement={<ErrorBoundaryRouter />}
        element={<Data />}
      />
    </Routes>
  );
}

export default UserRoutes;
