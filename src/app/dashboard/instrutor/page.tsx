'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnrollmentCard } from '@/components/dashboard/EnrollmentCard';
import { FinancialSummaryCard } from '@/components/dashboard/FinancialSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { enrollmentService } from '@/services/enrollmentService';
import type { Enrollment, InstructorFinancialSummary } from '@/types';

export default function InstrutorDashboard() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [financialSummary, setFinancialSummary] = useState<InstructorFinancialSummary>({
    totalEarnings: 0,
    pendingAmount: 0,
    periodEarnings: [],
    commissionRate: 0.15,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and is an instructor
    if (!authLoading && (!user || !userData?.isInstructor)) {
      router.push('/login?redirect=/dashboard/instrutor');
      return;
    }

    if (!user?.uid || !userData?.isInstructor) return;

    let unsubscribe: (() => void) | undefined;

    const loadData = async () => {
      try {
        setError(null);
        
        unsubscribe = enrollmentService.subscribeToInstructorEnrollments(
          user.uid,
          async (updatedEnrollments: Enrollment[]) => {
            setEnrollments(updatedEnrollments);
            
            try {
              const summary = await enrollmentService.getInstructorFinancialSummary(user.uid);
              setFinancialSummary(summary);
            } catch (error) {
              console.error('Erro ao buscar resumo financeiro:', error);
              setError('Não foi possível carregar o resumo financeiro');
            }
            
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Erro ao inicializar dashboard:', error);
        setError('Ocorreu um erro ao carregar o dashboard');
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, userData, authLoading, router]);

  const handleCancelEnrollment = async (enrollmentId: string) => {
    try {
      // Primeiro atualiza o status da matrícula
      await enrollmentService.updateEnrollmentStatus(enrollmentId, 'cancelled');
      
      // Se houver pagamento, iniciar processo de reembolso
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (enrollment?.paymentInfo.paymentStatus === 'paid') {
        await enrollmentService.updateEnrollmentStatus(
          enrollmentId, 
          'cancelled', 
          'refunded'
        );
      }
    } catch (error) {
      console.error('Erro ao cancelar matrícula:', error);
    }
  };

  const handleMarkAttendance = async (enrollmentId: string, present: boolean) => {
    try {
      await enrollmentService.updateAttendance(enrollmentId, {
        present,
        date: new Date(),
        notes: present ? 'Presença confirmada pelo instrutor' : 'Falta registrada'
      });
    } catch (error) {
      console.error('Erro ao marcar presença:', error);
    }
  };

  const handleViewDetails = (enrollmentId: string) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return;
    
    // TODO: Implementar rota para detalhes da matrícula
    window.location.href = `/atividades/${enrollment.activityId}/matriculas/${enrollmentId}`;
  };

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Resumo Financeiro */}
      <section className="mb-8">
        <FinancialSummaryCard summary={financialSummary} />
      </section>

      {/* Lista de Matrículas */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Matrículas</h2>
          <div className="space-x-2">
            <button
              onClick={() => window.location.href = '/atividades/criar'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nova Atividade
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">
                Nenhuma matrícula encontrada.
              </p>
              <p className="text-gray-500 text-sm">
                Crie uma atividade para começar a receber matrículas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  viewType="instructor"
                  onCancel={handleCancelEnrollment}
                  onMarkAttendance={handleMarkAttendance}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}