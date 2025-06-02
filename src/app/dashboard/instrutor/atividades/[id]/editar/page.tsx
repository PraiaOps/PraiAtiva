'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ActivityForm from '@/components/dashboard/ActivityForm';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Activity } from '@/types';

interface EditActivityPageProps {
  params: {
    id: string;
  };
}

export default function EditActivityPage({ params }: EditActivityPageProps) {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado e é um instrutor
    if (!authLoading && (!user || !userData?.isInstructor)) {
      router.push('/login?redirect=/dashboard/instrutor');
      return;
    }

    const loadActivity = async () => {
      try {
        const activityDoc = await getDoc(doc(db, 'activities', params.id));
        
        if (!activityDoc.exists()) {
          setError('Atividade não encontrada');
          return;
        }

        const activityData = activityDoc.data() as Activity;
        
        // Verificar se o usuário é o dono da atividade
        if (activityData.instructorId !== user?.uid) {
          setError('Você não tem permissão para editar esta atividade');
          return;
        }

        setActivity({
          id: activityDoc.id,
          ...activityData
        });
      } catch (err) {
        console.error('Erro ao carregar atividade:', err);
        setError('Ocorreu um erro ao carregar a atividade');
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      loadActivity();
    }
  }, [user, userData, authLoading, router, params.id]);

  const handleSuccess = () => {
    router.push('/dashboard/instrutor');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/dashboard/instrutor')}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Editar Atividade</h1>
          <p className="mt-2 text-gray-600">
            Atualize as informações da atividade abaixo. Os campos marcados com * são obrigatórios.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activity && (
            <ActivityForm
              initialData={activity}
              mode="edit"
            />
          )}
        </div>
      </div>
    </div>
  );
} 