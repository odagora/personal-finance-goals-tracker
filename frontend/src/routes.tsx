import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RootLayout } from '@/components/layouts/RootLayout';

// Pages
import { Home } from '@/pages/Home';
import { Login, Register } from '@/pages/Auth/index';
import { NewTransaction, ListTransactions } from '@/pages/Transactions/index';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
        ],
      },
      {
        path: '/transactions',
        element: (
          <ProtectedRoute>
            <ListTransactions />
          </ProtectedRoute>
        ),
      },
      {
        path: '/transactions/new',
        element: (
          <ProtectedRoute>
            <NewTransaction />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
