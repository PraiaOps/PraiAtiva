'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ActivityForm from '@/components/dashboard/ActivityForm';

export default function NovaAtividadePage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  
  // Prevenir renderização no servidor
  if (typeof window === 'undefined') {
    return null;
  }

  // Verificar se o usuário está autenticado e é um instrutor
  if (!authLoading && (!user || !userData?.isInstructor)) {
    router.push('/login?redirect=/dashboard/instrutor/nova-atividade');
    return null;
  }

  const handleSuccess = () => {
    router.push('/dashboard/instrutor');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nova Atividade</h1>
          <p className="mt-2 text-gray-600">
            Preencha os campos abaixo para criar uma nova atividade. Os campos marcados com * são obrigatórios.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <ActivityForm mode="create" />
        </div>
      </div>
    </div>
  );
} 