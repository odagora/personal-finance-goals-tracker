import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

export function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
