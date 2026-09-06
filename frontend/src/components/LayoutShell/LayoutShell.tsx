'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import CustomerMobileNav from '@/components/MobileNav/CustomerMobileNav';
import AdminMobileNav from '@/components/MobileNav/AdminMobileNav';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {/* Customer Header */}
      {!isAdminRoute && <Navbar />}

      {/* Main Page Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Mobile Bottom Navigation Bars */}
      {!isAdminRoute ? <CustomerMobileNav /> : <AdminMobileNav />}

      {/* Customer Footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
