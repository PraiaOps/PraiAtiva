'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { activityService } from '@/services/activityService';
import { enrollmentService } from '@/services/enrollmentService';
import { Activity } from '@/types';
import { Enrollment } from '@/types';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  PhotoIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import CapacityBar from '@/components/CapacityBar';
import Image from 'next/image';

// Componente de card de atividade
const ActivityCard = ({ activity, onEnroll }: { activity: Activity; onEnroll: (activity: Activity) => void }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      setError(null);
      await onEnroll(activity);
    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      setError('Erro ao se inscrever. Tente novamente.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Garantir que horarios seja um array
  const horarios = Array.isArray(activity.horarios) ? activity.horarios : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {activity.imageUrl ? (
          <Image
            src={activity.imageUrl}
            alt={activity.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {activity.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {activity.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <UserIcon className="h-4 w-4 mr-2" />
            <span>Instrutor: {activity.instructorName}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>R$ {activity.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="h-4 w-4 mr-2" />
            <span>
              {activity.enrolledStudents} / {activity.maxStudents} alunos
            </span>
          </div>
        </div>

        {horarios.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Horários:</h4>
            <div className="space-y-2">
              {horarios.map((horario, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {horario.diaSemana} - {horario.horario}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {horario.local}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleEnroll}
          disabled={isEnrolling || activity.enrolledStudents >= activity.maxStudents}
          className="w-full min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnrolling ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processando...
            </span>
          ) : activity.enrolledStudents >= activity.maxStudents ? (
            'Vagas Esgotadas'
          ) : (
            'Inscrever-se'
          )}
        </button>
      </div>
    </div>
  );
};

// Componente de card de inscrição
const EnrollmentCard = ({ 
  enrollment, 
  activity,
  onCancel,
  showDetails 
}: { 
  enrollment: Enrollment; 
  activity?: Activity;
  onCancel: (id: string) => void;
  showDetails: (id: string) => void;
}) => {
  const formattedDate = new Date(enrollment.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const status = {
    pending: { label: 'Pendente', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    confirmed: { label: 'Confirmado', bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-800' }
  }[enrollment.status];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">{enrollment.activityName}</h3>
            <p className="text-gray-600 text-sm">Instrutor: {enrollment.instructorName}</p>
          </div>
          <div className={`self-start sm:self-center ${status.bg} ${status.text} px-3 py-1.5 rounded-full text-sm font-semibold inline-flex`}>
            {status.label}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-y-2">
          <div className="flex items-center text-gray-700 text-sm w-1/2">
            <CalendarIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm w-1/2">
            <ClockIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{enrollment.horario}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm w-full">
            <MapPinIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{enrollment.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => showDetails(enrollment.activityId)}
            className="flex-1 min-h-[40px] px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            Ver Detalhes
          </button>
          {enrollment.status === 'pending' && (
            <button
              onClick={() => onCancel(enrollment.id)}
              className="flex-1 min-h-[40px] px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 active:bg-red-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading para atividades
const ActivitySkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-300"></div>
    <div className="p-4 space-y-4">
      <div className="h-5 bg-gray-300 rounded-md w-3/4"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-6 bg-gray-300 rounded-md w-1/4"></div>
        <div className="h-6 bg-gray-300 rounded-md w-1/4"></div>
      </div>
      <div className="h-12 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

export default function AlunoDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'atividades';

  const [activities, setActivities] = useState<Activity[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingActivity, setEnrollingActivity] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar atividades
        const activitiesData = await activityService.listActivities();
        setActivities(activitiesData);

        // Carregar inscrições do aluno
        const enrollmentsData = await enrollmentService.listEnrollments({ studentId: user.uid });
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  // Função para inscrever em uma atividade
  const handleEnroll = async (activity: Activity) => {
    if (!user || !userData) return;
    
    setEnrollingActivity(activity.id);
    
    try {
      // Criar inscrição
      const enrollmentId = await enrollmentService.createEnrollment({
        activityId: activity.id,
        studentId: user.uid,
        studentName: userData.name,
        instructorId: activity.instructorId,
        instructorName: activity.instructorName,
        activityName: activity.name,
        paymentInfo: {
          amount: activity.price,
          commission: activity.price * 0.15,
          instructorAmount: activity.price * 0.85,
          paymentMethod: 'pix',
          paymentStatus: 'pending',
          paymentDate: new Date(),
        },
      });

      // Redirecionar para página de pagamento
      router.push(`/atividades/${activity.id}/pagamento?enrollmentId=${enrollmentId}`);
    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      setError('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setEnrollingActivity(null);
    }
  };

  // Filtrar atividades disponíveis (não inscritas)
  const availableActivities = activities.filter(
    activity => !enrollments.some(e => e.activityId === activity.id)
  );

  // Filtrar atividades inscritas
  const enrolledActivities = activities.filter(
    activity => enrollments.some(e => e.activityId === activity.id)
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Minhas Atividades</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/dashboard/aluno?tab=atividades')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'atividades'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Atividades Disponíveis
            </button>
            <button
              onClick={() => router.push('/dashboard/aluno?tab=inscricoes')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'inscricoes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Minhas Inscrições
            </button>
          </div>
        </div>

        {activeTab === 'atividades' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableActivities.map((activity) => (
                  <ActivityCard
                    key={`available-${activity.id}`}
                    activity={activity}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Nenhuma atividade disponível no momento.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledActivities.map((activity) => (
                  <ActivityCard
                    key={`enrolled-${activity.id}`}
                    activity={activity}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Você ainda não está inscrito em nenhuma atividade.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}