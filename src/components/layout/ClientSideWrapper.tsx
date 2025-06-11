'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ClientSideWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export default function ClientSideWrapper({
  children,
  requireAuth = false,
  allowedRoles = []
}: ClientSideWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const { user, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    if (requireAuth && !user) {
      router.push('/login');
      return;
    }

    if (allowedRoles.length > 0 && (!userData?.role || !allowedRoles.includes(userData.role))) {
      router.push('/');
      return;
    }
  }, [user, userData, requireAuth, allowedRoles, router]);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}
