'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  QuestionMarkCircleIcon // Mantido se usado em outro lugar
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import CapacityBar from '@/components/CapacityBar';

// Tipos
import { Enrollment, EnrollmentStatus, Activity as ActivityType } from '@/types/index'; // Importa tipos reais, renomeia Activity para evitar conflito
import { enrollmentService } from '@/services/enrollmentService'; // Importa enrollmentService
import { activityService } from '@/services/activityService'; // Importa activityService para uso no EnrollmentCard

// REMOVIDO: Definição local de Activity não é mais necessária

// REMOVIDO: ActivityCard não é usado no dashboard do aluno

// Componente para card de inscrição
const EnrollmentCard = ({
  enrollment,
  onCancel,
  showDetails,
}: {
  enrollment: Enrollment;
  onCancel: (id: string) => void;
  showDetails: (id: string) => void;
}) => {
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        setLoadingActivity(true);
        const activityData = await activityService.getActivity(enrollment.activityId);
        if (activityData) {
          setActivity(activityData);
        } else {
          setActivityError('Detalhes da atividade não encontrados');
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da atividade:', error);
        setActivityError('Erro ao carregar detalhes da atividade.');
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchActivityDetails();
  }, [enrollment.activityId]); // Dependência do ID da atividade

  const statusConfig: Record<EnrollmentStatus, { bg: string; text: string; label: string }> = {
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmado' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
    completed: { bg: 'bg-gray-200', text: 'text-gray-700', label: 'Concluído' }, // Adicione esta linha
  };

  const status = statusConfig[enrollment.status as EnrollmentStatus] || { bg: 'bg-gray-200', text: 'text-gray-700', label: 'Desconhecido' }; // Fallback para status desconhecido

  if (loadingActivity) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="p-4 sm:p-5 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="flex gap-2">
             <div className="h-10 bg-gray-300 rounded-lg w-1/2"></div>
             <div className="h-10 bg-gray-300 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (activityError) {
     return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro:</strong>
        <span className="block sm:inline"> {activityError}</span>
      </div>
     );
  }

  const formattedDate = activity?.horarios && activity.horarios.length > 0
    ? new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) // Usar data real da atividade se disponível
    : 'Data indisponível'; // Fallback

   const activityTime = activity?.horarios && activity.horarios.length > 0 ? activity.horarios[0].horario : 'Horário indisponível'; // Exemplo: pegar primeiro horário

   const activityLocation = activity?.beach ? `${activity.beach}, ${activity.city}` : 'Local indisponível';


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">{activity?.name || enrollment.activityName}</h3> {/* Usa nome da atividade buscada ou da matrícula */}
            <p className="text-gray-600 text-sm">Instrutor: {activity?.instructorName || 'Informação indisponível'}</p> {/* Usa nome do instrutor da atividade */}
          </div>
          <div className={`self-start sm:self-center ${status.bg} ${status.text} px-3 py-1.5 rounded-full text-sm font-semibold inline-flex`}>
            {status.label}
          </div>
        </div>

        <div className="flex flex-wrap gap-y-2">
          <div className="flex items-center text-gray-700 text-sm w-1/2">
            <CalendarIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{formattedDate}</span> {/* Usar data real da atividade */}
          </div>
          <div className="flex items-center text-gray-700 text-sm w-1/2">
            <ClockIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{activityTime}</span> {/* Usar horário real da atividade */}
          </div>
          <div className="flex items-center text-gray-700 text-sm w-full">
            <MapPinIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{activityLocation}</span> {/* Usar local real da atividade */}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {enrollment.status !== 'cancelled' && ( // Usa valor correto do status
            <button
              className="min-h-[48px] flex-1 flex items-center justify-center px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 active:bg-red-100 transition-colors"
              onClick={() => onCancel(enrollment.id)}
            >
              <XCircleIcon className="h-5 w-5 mr-2" />
              Cancelar
            </button>
          )}
          {activity && ( // Renderiza botão Detalhes apenas se a atividade foi carregada
            <button
              className="min-h-[48px] flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
              onClick={() => showDetails(activity.id)}
            >
              <ArrowRightIcon className="h-5 w-5 mr-2" />
              Detalhes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// Skeleton Loading para matrículas/cards (ajustado para EnrollmentCard)
const EnrollmentSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="p-4 space-y-4">
      <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="h-10 bg-gray-300 rounded-lg w-1/3"></div>
        <div className="h-10 bg-gray-300 rounded-lg w-1/3"></div>
      </div>
    </div>
  </div>
);


// REMOVIDO: Dados mockados para demonstração

export default function AlunoDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<string>('inscricoes'); // Padrão para 'inscricoes'
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState<boolean>(true); // Estado de carregamento para matrículas
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null); // Estado de erro para matrículas


  useEffect(() => {
    // Define a aba ativa com base na url ou padrão para 'inscricoes'
    setActiveTab(tab === 'inscricoes' || tab === 'perfil' ? tab : 'inscricoes');

    // Buscar matrículas reais do aluno logado
    if (user) {
      setLoadingEnrollments(true);
      const unsubscribe = enrollmentService.subscribeToEnrollments(
        { studentId: user.uid },
        (realEnrollments: Enrollment[]) => {
          console.log("Matrículas recebidas (antes do filtro):", realEnrollments);

          // Filtrar matrículas por status desejado (confirmed ou pending)
          const activeEnrollments = realEnrollments.filter(
            enrollment => enrollment.status === 'confirmed' || enrollment.status === 'pending'
          );

          console.log("Matrículas ativas (após o filtro):", activeEnrollments);

          setEnrollments(activeEnrollments); // Atualiza com os dados filtrados
          setLoadingEnrollments(false);
          setEnrollmentError(null); // Limpa erro em caso de sucesso
        },

        (error: any) => { // Tipagem explícita
          console.error('Erro ao buscar matrículas:', error);
          setEnrollments([]); // Limpa matrículas em caso de erro
          setEnrollmentError('Erro ao carregar suas matrículas.'); // Define mensagem de erro
          setLoadingEnrollments(false);
        }
      );
      // Limpa a subscrição ao desmontar o componente
      return () => unsubscribe();
    } else {
        // Se não houver usuário logado, define estados apropriados
        setEnrollments([]);
        setLoadingEnrollments(false);
        setEnrollmentError('Você precisa estar logado para ver suas matrículas.');
    }
  }, [tab, user]); // Adiciona 'user' como dependência

  // REMOVIDO: Função para simular a inscrição em uma atividade

  // REMOVIDO: Função para verificar inscrição em atividade mockada

  // Função para cancelar inscrição real (chama o service)
  const handleCancelEnrollment = async (enrollmentId: string) => {
    // Opcional: Adicionar um estado de loading para o cancelamento
    // setCancelingEnrollment(enrollmentId);

    try {
       await enrollmentService.cancelEnrollment(enrollmentId);
       console.log('Inscrição cancelada com sucesso:', enrollmentId);
       // A subscrição em tempo real (`subscribeToEnrollments`) atualizará a lista automaticamente
    } catch (error) {
       console.error('Erro ao cancelar inscrição:', error);
       // Opcional: setar um estado de erro para feedback ao usuário
    } finally {
       // Opcional: resetar estado de loading do cancelamento
       // setCancelingEnrollment(null);
    }
  };

  // Função para mostrar detalhes da atividade (redireciona para a página da atividade)
  const showActivityDetails = (activityId: string) => {
    router.push(`/atividades/${activityId}`);
  };

  // Renderizar conteúdo com base na aba selecionada
  const renderContent = () => {
    // O loading principal da página agora é o loadingEnrollments
    if (loadingEnrollments) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <EnrollmentSkeleton key={i} /> // Usar skeleton de enrollment
          ))}
        </div>
      );
    }

    // Exibir erro se houver ao carregar as matrículas
    if (enrollmentError) {
        return (
            <div className="text-center py-12 text-red-600">
                <p>{enrollmentError}</p>
                {/* Opcional: botão para tentar recarregar */}
            </div>
        );
    }


    switch (activeTab) {
      case 'inscricoes':
        return renderAtividadesInscritas();
      case 'perfil':
        return renderPerfil();
      default:
        return renderAtividadesInscritas();
    }
  };

  // Renderizar aba Atividades Inscritas
  function renderAtividadesInscritas() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">Minhas Inscrições</h2> {/* Título ajustado */}
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Você ainda não está inscrito em nenhuma atividade.</p>
              {/* Botão para explorar atividades - ajustar o link se necessário */}
              <button
                className="mt-4 min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                onClick={() => router.push('/atividades')} // Link corrigido para a página de listagem de atividades
              >
                Explorar Atividades
              </button>
            </div>
          ) : (
            enrollments.map((enrollment) => {
              // Não precisamos mais buscar foundActivity aqui, pois a busca é feita dentro do EnrollmentCard
              return (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  // activity={foundActivity} // Não passamos mais activity aqui
                  onCancel={handleCancelEnrollment}
                  showDetails={showActivityDetails}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Renderizar aba Meu Perfil (conteúdo mantido)
  const renderPerfil = () => {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-50 p-6">
              <div className="text-center">
                <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Foto de perfil" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-4xl font-bold">
                      {userData?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium">{userData?.displayName || user?.email}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <button className="mt-4 min-h-[44px] px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 active:bg-blue-100 transition-colors">
                  Alterar foto
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Informações Pessoais</h4>
                <div className="space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Telefone:</span> (21) 99999-9999</p>
                  <p className="text-gray-600"><span className="font-medium">Tipo de conta:</span> Aluno</p>
                  <p className="text-gray-600"><span className="font-medium">Membro desde:</span> {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <h4 className="text-lg font-medium mb-4">Editar Informações</h4>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={userData?.displayName || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg bg-gray-50"
                      defaultValue={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(99) 99999-9999"
                      defaultValue="(21) 99999-9999"
                      inputMode="tel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Experiência
                  </label>
                  <select
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="iniciante"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interesses
                  </label>
                  <input
                    type="text"
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Surf, Natação, Yoga"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe seus interesses por vírgula</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium mb-4">Alterar Senha</h4>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    >
                      Atualizar Senha
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
}
