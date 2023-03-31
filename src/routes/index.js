import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CustomBrowserRouter } from './CustomRouter';
import PrivateRoute from './private/PrivateRoute';
import PublicRoute from './public/PublicRoute';
import PermissionRoute from './private/PermissionRoute';
import LoadingFallback from '../components/shared/element/LoadingFallback';
import ErrorBoundary from '../components/shared/element/ErrorBoundary';
import {
  publicRoutes,
  privateRoutes,
  errorRoutes,
} from './AppRouting';

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <CustomBrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* authenticated routes*/}
            <Route element={<PrivateRoute />}>
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <PermissionRoute
                      permissionRequired={route.permissionRequired}
                      element={route.element}
                    />
                  }
                />
              ))}
            </Route>

            {/* public routes */}
            <Route element={<PublicRoute />}>
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            {/* error pages */}
            {errorRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </CustomBrowserRouter>
    </ErrorBoundary>
  );
}
