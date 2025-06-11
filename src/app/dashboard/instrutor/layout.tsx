'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function InstrutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (!userData?.role) {
        console.error('Papel do usuário não definido');
        router.push('/');
        return;
      }

      if (userData.role !== 'instructor') {
        console.error('Usuário não tem permissão de instrutor');
        router.push('/');
        return;
      }
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || !userData || userData.role !== 'instructor') {
    return null;
  }

  return <>{children}</>;
} 