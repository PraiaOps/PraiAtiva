'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { activityService } from '@/services/activityService';
import { enrollmentService } from '@/services/enrollmentService';
import { Activity, Enrollment } from '@/types';
import {
  MapPinIcon,
  StarIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Footer from '@/components/layout/Footer';
import CapacityBar from '@/components/CapacityBar';

export default function ActivityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const activityData = await activityService.getActivity(params.id);
        if (activityData) {
          // Ensure clean data before setting state
          const cleanActivity = {
            ...activityData,
            horarios: Array.isArray(activityData.horarios)
              ? activityData.horarios.map(h => ({
                  periodo: h.periodo || '',
                  horario: h.horario || '',
                  local: h.local || 'areia',
                  limiteAlunos: h.limiteAlunos || 0,
                  alunosMatriculados: h.alunosMatriculados || 0,
                  diaSemana: h.diaSemana || '',
                }))
              : [],
          };
          setActivity(cleanActivity);

          // Se o usuário estiver logado, verificar se está matriculado
          if (user) {
            const enrollments = await enrollmentService.listEnrollments({
              studentId: user.uid,
              activityId: params.id,
            });

            // Ordenar por data de atualização e pegar a mais recente
            const sortedEnrollments = enrollments.sort((a, b) => {
              const dateA = new Date(a.updatedAt || a.createdAt);
              const dateB = new Date(b.updatedAt || b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });

            if (sortedEnrollments.length > 0) {
              setEnrollment(sortedEnrollments[0]);
            }
          }
        } else {
          setError('Atividade não encontrada');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, user]);

  const handlePayment = () => {
    router.push(`/atividades/${params.id}/pagamento`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Erro</h2>
          <p className="text-gray-600">{error || 'Atividade não encontrada'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header com imagem */}
        <div className="relative h-64 md:h-96">
          {activity.image ? (
            <img
              src={activity.image}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagem não disponível</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {activity.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>
                  {activity.beach}, {activity.city}
                </span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 mr-1" />
                <span>
                  {activity.rating} ({activity.reviews} avaliações)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Sobre a Atividade
                </h2>
                <p className="text-gray-600 mb-6">{activity.description}</p>

                <h3 className="text-xl font-semibold mb-4">
                  Horários Disponíveis
                </h3>
                <div className="space-y-4">
                  {Array.isArray(activity.horarios) &&
                  activity.horarios.length > 0 ? (
                    activity.horarios.map((horario, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <ClockIcon className="h-5 w-5 text-sky-600 mr-2" />
                            <span className="font-medium">
                              {horario.periodo}
                            </span>
                          </div>
                          <CapacityBar
                            filled={horario.alunosMatriculados}
                            total={horario.limiteAlunos}
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{horario.horario}</p>
                          <p>Local: {horario.local}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhum horário disponível
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Instrutor</h3>
                  <div className="flex items-center">
                    <UserIcon className="h-10 w-10 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{activity.instructorName}</p>
                      <p className="text-sm text-gray-600">
                        {activity.entrepreneur}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Valor</span>
                    <span className="text-2xl font-bold text-sky-600">
                      R$ {Number(activity.price).toFixed(2)}
                    </span>
                  </div>

                  {enrollment && (enrollment.status === 'confirmed' || enrollment.status === 'pending') ? (
                    // Mostra status se enrollment existe E o status for confirmed ou pending
                    <button
                       className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                      disabled
                    >
                      {enrollment.status === 'confirmed'
                        ? 'Inscrito'
                        : 'Aguardando Confirmação'} {/* Ajuste o texto conforme seus status */}
                    </button>
                  ) : (
                    <button
                      onClick={handlePayment}
                      className="w-full bg-sky-600 text-white py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors font-medium"
                    >
                      Pagar com PIX
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
