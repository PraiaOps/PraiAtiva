'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { activityService } from '@/services/activityService';
import { enrollmentService } from '@/services/enrollmentService';
import { Activity } from '@/types';
import { Enrollment } from '@/types';
import { QrCodeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PagamentoPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userData } = useAuth();
  const enrollmentId = searchParams.get('enrollmentId');

  const [activity, setActivity] = useState<Activity | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (!user || !enrollmentId) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // Carregar atividade
        const activityData = await activityService.getActivity(params.id);
        if (!activityData) {
          throw new Error('Atividade não encontrada');
        }
        setActivity(activityData);

        // Carregar inscrição
        const enrollmentData = await enrollmentService.getEnrollment(enrollmentId);
        if (!enrollmentData) {
          throw new Error('Inscrição não encontrada');
        }
        setEnrollment(enrollmentData);

        // Se o pagamento já foi confirmado, atualizar estado
        if (enrollmentData.paymentStatus === 'paid') {
          setPaymentConfirmed(true);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, params.id, enrollmentId, router]);

  const handleConfirmPayment = async () => {
    if (!enrollment) return;

    try {
      setLoading(true);
      await enrollmentService.confirmEnrollment(enrollment.id);
      setPaymentConfirmed(true);
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      setError('Erro ao confirmar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activity || !enrollment) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {activity.name}
              </h2>
              <p className="text-gray-600">{activity.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor:</span>
                <span className="text-lg font-semibold text-gray-900">
                  R$ {activity.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status do Pagamento:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  enrollment.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {enrollment.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>

            {paymentConfirmed ? (
              <div className="text-center py-6">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pagamento Confirmado!
                </h3>
                <p className="text-gray-600 mb-4">
                  Sua inscrição foi confirmada com sucesso.
                </p>
                <button
                  onClick={() => router.push('/dashboard/aluno?tab=inscricoes')}
                  className="min-h-[44px] px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  Ver Minhas Inscrições
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Instruções de Pagamento
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Faça o pagamento via PIX</li>
                    <li>Após o pagamento, clique no botão abaixo para confirmar</li>
                    <li>O instrutor será notificado e confirmará sua inscrição</li>
                  </ol>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="min-h-[44px] px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processando...' : 'Confirmar Pagamento'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
