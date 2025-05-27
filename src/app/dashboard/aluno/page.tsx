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
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import CapacityBar from '@/components/CapacityBar';

// Tipos
type Activity = {
  id: string;
  name: string;
  instructor: string;
  instructorId: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  category: string;
  image: string;
};

type Enrollment = {
  id: string;
  activityId: string;
  activityName: string;
  date: string;
  time: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  instructor: string;
  location: string;
};

// Componente de card de atividade
const ActivityCard = ({ 
  activity, 
  isEnrolled, 
  enrollingActivity,
  onEnroll 
}: { 
  activity: Activity; 
  isEnrolled: boolean; 
  enrollingActivity: string | null;
  onEnroll: (id: string) => void;
}) => {
  const formattedDate = new Date(activity.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return (
    <div className="activity-card group bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-sky-100 overflow-hidden flex flex-col animate-fade-in">
      <div className="relative h-44 sm:h-48 w-full overflow-hidden">
        {activity.image ? (
          <img
            src={activity.image}
            alt={activity.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={e => {
              // fallback dinâmico: se não encontrar a imagem, mostra uma imagem padrão de acordo com a categoria
              const fallbackMap: Record<string, string> = {
                'Surf': '/images/surf.jpg',
                'SUP': '/images/standup.jpg',
                'Bem-estar': '/images/standup.jpg',
                'Beach Tennis': '/images/beach-tennis.jpg',
                'Vôlei': '/images/volei-de-praia.jpg',
                'Funcional': '/images/funcional.jpg',
                'Yoga': '/images/standup.jpg',
                'Kitesurf': '/images/kitesurf.jpg',
                'Caiaque': '/images/caiaque.jpg',
                'default': '/images/beach-activities.jpg'
              };
              const cat = activity.category || 'default';
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackMap[cat as keyof typeof fallbackMap] || fallbackMap['default'];
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">Imagem não disponível</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 text-sky-700 font-bold px-3 py-1 rounded-full text-xs shadow">
          R$ {activity.price.toFixed(2)}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base md:text-lg font-semibold mb-1 hover:text-primary-600 transition-colors truncate" title={activity.name}>
          {activity.name}
        </h3>
        <div className="flex items-center text-gray-600 mb-2 gap-2">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span className="text-xs md:text-sm truncate">{activity.instructor}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2 gap-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="text-xs md:text-sm truncate">{activity.location}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2 gap-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span className="text-xs md:text-sm truncate">{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2 gap-2">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span className="text-xs md:text-sm truncate">{activity.time} ({activity.duration})</span>
        </div>
        <div className="mb-2">
          <CapacityBar filled={activity.currentParticipants} total={activity.maxParticipants} className="ml-0 flex-shrink-0" />
        </div>
        <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">{activity.description}</p>
        <div className="mt-auto">
          {isEnrolled ? (
            <button
              className="w-full min-h-[48px] flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
              disabled
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Inscrito
            </button>
          ) : activity.currentParticipants >= activity.maxParticipants ? (
            <button
              className="w-full min-h-[48px] flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
              disabled
            >
              Esgotado
            </button>
          ) : (
            <button
              className="w-full min-h-[48px] flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
              onClick={() => onEnroll(activity.id)}
              disabled={enrollingActivity === activity.id}
            >
              {enrollingActivity === activity.id ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : (
                'Inscrever-se'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para card de inscrição
const EnrollmentCard = ({ 
  enrollment, 
  activity,
  onCancel,
  showDetails
}: { 
  enrollment: Enrollment; 
  activity: Activity | undefined;
  onCancel: (id: string) => void;
  showDetails: (id: string) => void;
}) => {
  const formattedDate = new Date(enrollment.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const statusConfig = {
    confirmado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmado' },
    pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
    cancelado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
  };
  
  const status = statusConfig[enrollment.status];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">{enrollment.activityName}</h3>
            <p className="text-gray-600 text-sm">Instrutor: {enrollment.instructor}</p>
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
            <span>{enrollment.time}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm w-full">
            <MapPinIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{enrollment.location}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {enrollment.status !== 'cancelado' && (
            <button
              className="min-h-[48px] flex-1 flex items-center justify-center px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 active:bg-red-100 transition-colors"
              onClick={() => onCancel(enrollment.id)}
            >
              <XCircleIcon className="h-5 w-5 mr-2" />
              Cancelar
            </button>
          )}
          {activity && (
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

// Dados mockados para demonstração
const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Aula de Surf para Iniciantes',
    instructor: 'João Silva',
    instructorId: 'inst1',
    location: 'Praia de Copacabana',
    date: '2023-11-25',
    time: '08:00',
    duration: '2 horas',
    price: 80,
    maxParticipants: 10,
    currentParticipants: 5,
    description: 'Aula perfeita para quem quer começar no surf. Equipamentos inclusos.',
    category: 'Surf',
    image: '/images/surf.jpg'
  },
  {
    id: '2',
    name: 'Stand Up Paddle - Nível Intermediário',
    instructor: 'Maria Santos',
    instructorId: 'inst2',
    location: 'Praia de Ipanema',
    date: '2023-11-26',
    time: '09:30',
    duration: '1.5 horas',
    price: 65,
    maxParticipants: 8,
    currentParticipants: 3,
    description: 'Aula para quem já tem experiência com SUP e quer aprimorar técnicas.',
    category: 'SUP',
    image: '/images/standup.jpg'
  },
  {
    id: '3',
    name: 'Yoga na Praia',
    instructor: 'Ana Costa',
    instructorId: 'inst3',
    location: 'Praia do Leblon',
    date: '2023-11-27',
    time: '07:00',
    duration: '1 hora',
    price: 50,
    maxParticipants: 15,
    currentParticipants: 8,
    description: 'Comece o dia com uma revigorante sessão de yoga à beira-mar.',
    category: 'Bem-estar',
    image: '/images/placeholder-yoga.jpg'
  }
];

const mockEnrollments: Enrollment[] = [
  {
    id: 'e1',
    activityId: '1',
    activityName: 'Aula de Surf para Iniciantes',
    date: '2023-11-25',
    time: '08:00',
    status: 'confirmado',
    instructor: 'João Silva',
    location: 'Praia de Copacabana'
  },
  {
    id: 'e2',
    activityId: '3',
    activityName: 'Yoga na Praia',
    date: '2023-11-27',
    time: '07:00',
    status: 'pendente',
    instructor: 'Ana Costa',
    location: 'Praia do Leblon'
  }
];

export default function AlunoDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>('atividades');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrollingActivity, setEnrollingActivity] = useState<string | null>(null);
  
  useEffect(() => {
    // Define a aba ativa com base na url ou padrão para 'atividades'
    if (tab === 'inscricoes') {
      setActiveTab('inscricoes');
    } else if (tab === 'perfil') {
      setActiveTab('perfil');
    } else {
      setActiveTab('atividades');
    }
    
    // Simular carregamento de dados
    const loadData = setTimeout(() => {
      // Dados de exemplo para atividades
      setActivities([
        {
          id: '1',
          name: 'Beach Tennis - Iniciantes',
          instructor: 'Mariana Costa',
          instructorId: 'inst123',
          location: 'Praia de Copacabana, Posto 4',
          date: '2025-05-18',
          time: '09:00',
          duration: '60 min',
          price: 60,
          maxParticipants: 8,
          currentParticipants: 5,
          description: 'Aulas para iniciantes com foco em técnicas básicas e fundamentos do jogo.',
          category: 'Beach Tennis',
          image: '/images/atividades/beach-tennis.jpg'
        },
        {
          id: '2',
          name: 'Vôlei de Praia - Avançado',
          instructor: 'Pedro Almeida',
          instructorId: 'inst456',
          location: 'Praia do Recreio, Posto 10',
          date: '2025-05-19',
          time: '16:30',
          duration: '90 min',
          price: 75,
          maxParticipants: 6,
          currentParticipants: 6,
          description: 'Treino avançado para jogadores com experiência. Foco em estratégias de jogo e técnicas avançadas.',
          category: 'Vôlei',
          image: '/images/atividades/volei-praia.jpg'
        },
        {
          id: '3',
          name: 'Funcional na Areia',
          instructor: 'Juliana Santos',
          instructorId: 'inst789',
          location: 'Praia da Barra, Posto 3',
          date: '2025-05-20',
          time: '07:00',
          duration: '45 min',
          price: 45,
          maxParticipants: 15,
          currentParticipants: 8,
          description: 'Treino funcional de alta intensidade aproveitando a resistência da areia. Para todos os níveis.',
          category: 'Funcional',
          image: '/images/atividades/funcional-praia.jpg'
        },
        {
          id: '4',
          name: 'SUP - Stand Up Paddle',
          instructor: 'Rodrigo Lima',
          instructorId: 'inst101',
          location: 'Praia de Ipanema, Posto 9',
          date: '2025-05-21',
          time: '08:30',
          duration: '60 min',
          price: 90,
          maxParticipants: 5,
          currentParticipants: 3,
          description: 'Aula de Stand Up Paddle com instrutor experiente. Equipamento incluso.',
          category: 'SUP',
          image: '/images/atividades/sup.jpg'
        }
      ]);
      
      // Dados de exemplo para inscrições
      setEnrollments([
        {
          id: 'e1',
          activityId: '1',
          activityName: 'Beach Tennis - Iniciantes',
          date: '2025-05-18',
          time: '09:00',
          status: 'confirmado',
          instructor: 'Mariana Costa',
          location: 'Praia de Copacabana, Posto 4'
        }
      ]);
      
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(loadData);
  }, [tab]);

  // Função para simular a inscrição em uma atividade
  const handleEnroll = (activityId: string) => {
    setEnrollingActivity(activityId);
    
    // Simulação de processamento
    setTimeout(() => {
      const activity = activities.find(a => a.id === activityId);
      
      if (activity) {
        const newEnrollment: Enrollment = {
          id: `e${Date.now()}`,
          activityId: activity.id,
          activityName: activity.name,
          date: activity.date,
          time: activity.time,
          status: 'pendente',
          instructor: activity.instructor,
          location: activity.location
        };
        
        setEnrollments([...enrollments, newEnrollment]);
        
        // Atualizar número de participantes
        setActivities(activities.map(a => 
          a.id === activityId 
            ? {...a, currentParticipants: a.currentParticipants + 1}
            : a
        ));
      }
      
      setEnrollingActivity(null);
    }, 1000);
  };

  // Verificar se o usuário já está inscrito em uma atividade
  const isEnrolled = (activityId: string) => {
    return enrollments.some(e => e.activityId === activityId);
  };

  // Função para cancelar inscrição
  const handleCancelEnrollment = (enrollmentId: string) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    
    if (enrollment) {
      // Atualizar número de participantes na atividade
      setActivities(activities.map(a => 
        a.id === enrollment.activityId 
          ? {...a, currentParticipants: Math.max(0, a.currentParticipants - 1)}
          : a
      ));
      
      // Remover inscrição
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
    }
  };

  // Função para mostrar detalhes da atividade
  const showActivityDetails = (activityId: string) => {
    router.push(`/atividades/${activityId}`);
  };

  // Renderizar conteúdo com base na aba selecionada
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}
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

  // Renderizar aba Atividades Inscritas (substitui "Atividades Disponíveis")
  function renderAtividadesInscritas() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">Atividades inscritas</h2>
        <div className="space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => <ActivitySkeleton key={i} />)
          ) : enrollments.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Você ainda não está inscrito em nenhuma atividade.</p>
              <button
                className="mt-4 min-h-[48px] px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                onClick={() => router.push('/dashboard/aluno?tab=inscricoes')}
              >
                Ver Atividades
              </button>
            </div>
          ) : (
            enrollments.map((enrollment) => {
              const foundActivity = activities.find(a => a.id === enrollment.activityId);
              return (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  activity={foundActivity}
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

  // Renderizar aba Meu Perfil
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