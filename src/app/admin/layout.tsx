
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('vivaan_admin_auth');
    if (!auth && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center font-headline text-3xl font-extrabold text-primary animate-pulse">Loading Admin...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F9F6EF] font-body text-[#100C06]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto overflow-hidden">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
