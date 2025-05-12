'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

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

type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  activitiesEnrolled: number;
  lastActivity: string;
  profileImage?: string;
};

// Componente Card de Atividade para Instrutor
const ActivityCard = ({ 
  activity, 
  onEdit,
  onDelete,
  onViewDetails
}: { 
  activity: Activity; 
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}) => {
  const formattedDate = new Date(activity.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const isFull = activity.currentParticipants >= activity.maxParticipants;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video relative bg-gray-300">
        <img 
          src={activity.image || '/images/placeholder.jpg'} 
          alt={activity.name}
          className="w-full h-full object-cover" 
        />
        
        <div className={`absolute top-3 right-3 ${isFull ? 'bg-red-500' : 'bg-green-500'} text-white font-bold px-3 py-1.5 rounded-full flex items-center shadow-md`}>
          <UserGroupIcon className="h-5 w-5 mr-1.5" />
          <span>{activity.currentParticipants}/{activity.maxParticipants}</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
          <h3 className="text-white font-bold text-lg sm:text-xl truncate">{activity.name}</h3>
          <p className="text-white/90 text-sm flex items-center">
            <span className="capitalize">{activity.category}</span>
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-y-2 mb-4">
          <div className="flex items-center text-gray-700 text-sm w-1/2">
            <CalendarIcon className="h-5 w-5 mr-1.5 text-amber-500 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm w-1/2">
            <ClockIcon className="h-5 w-5 mr-1.5 text-amber-500 flex-shrink-0" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm w-full">
            <MapPinIcon className="h-5 w-5 mr-1.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-900 font-bold text-lg">
            R$ {activity.price.toFixed(2)}
          </div>
          
          <div className="text-sm text-gray-600">
            {activity.duration}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="min-h-[44px] flex-1 flex items-center justify-center px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 active:bg-amber-300 transition-colors"
            onClick={() => onEdit(activity.id)}
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            <span>Editar</span>
          </button>
          
          <button
            className="min-h-[44px] flex-1 flex items-center justify-center px-3 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors"
            onClick={() => onViewDetails(activity.id)}
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            <span>Detalhes</span>
          </button>
          
          <button
            className="min-h-[44px] w-[44px] flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
            onClick={() => onDelete(activity.id)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Card de Aluno
const StudentCard = ({ student, onViewDetails }: { student: Student, onViewDetails: (id: string) => void }) => {
  const formattedDate = new Date(student.enrollmentDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-amber-100 flex-shrink-0">
            {student.profileImage ? (
              <img 
                src={student.profileImage} 
                alt={student.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-amber-800 font-bold text-xl">
                {student.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-gray-900 font-medium">{student.name}</h3>
            <p className="text-gray-500 text-sm">{student.email}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4 mt-3 sm:mt-0 sm:ml-auto">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{student.activitiesEnrolled}</span> atividades
          </div>
          
          <button
            className="min-h-[40px] px-3 py-2 bg-amber-600 text-white rounded-lg font-medium text-sm hover:bg-amber-700 active:bg-amber-800 transition-colors flex items-center"
            onClick={() => onViewDetails(student.id)}
          >
            <EyeIcon className="h-4 w-4 mr-1.5" />
            Detalhes
          </button>
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
    image: '/images/placeholder-surf.jpg'
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
    currentParticipants: 8,
    description: 'Aula para quem já tem experiência com SUP e quer aprimorar técnicas.',
    category: 'SUP',
    image: '/images/placeholder-sup.jpg'
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

const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Ana Paula Soares',
    email: 'ana.soares@exemplo.com',
    phone: '(21) 98765-4321',
    enrollmentDate: '2023-10-15',
    activitiesEnrolled: 3,
    lastActivity: 'Aula de Surf para Iniciantes'
  },
  {
    id: 's2',
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@exemplo.com',
    phone: '(21) 91234-5678',
    enrollmentDate: '2023-10-20',
    activitiesEnrolled: 1,
    lastActivity: 'Stand Up Paddle - Nível Intermediário'
  },
  {
    id: 's3',
    name: 'Mariana Costa',
    email: 'mariana.costa@exemplo.com',
    phone: '(21) 99876-5432',
    enrollmentDate: '2023-11-01',
    activitiesEnrolled: 2,
    lastActivity: 'Yoga na Praia'
  }
];

// Nova Atividade Form
const NovaAtividadeForm = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Atividade
              </label>
              <input
                type="text"
                className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="Ex: Aula de Surf para Iniciantes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Selecione uma categoria</option>
                <option value="surf">Surf</option>
                <option value="sup">Stand Up Paddle</option>
                <option value="yoga">Yoga</option>
                <option value="funcional">Funcional</option>
                <option value="natacao">Natação</option>
                <option value="corrida">Corrida</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <input
                type="text"
                className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="Ex: Praia de Copacabana"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário
              </label>
              <input
                type="time"
                className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-l-lg focus:ring-amber-500 focus:border-amber-500"
                  defaultValue="1"
                />
                <span className="inline-flex items-center min-h-[44px] px-3 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-lg">
                  horas
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$)
              </label>
              <div className="flex">
                <span className="inline-flex items-center min-h-[44px] px-3 bg-gray-100 text-gray-700 border border-r-0 border-gray-300 rounded-l-lg">
                  R$
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-r-lg focus:ring-amber-500 focus:border-amber-500"
                  defaultValue="50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número Máximo de Participantes
              </label>
              <input
                type="number"
                min="1"
                className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                defaultValue="10"
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                rows={4}
                className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="Descreva sua atividade em detalhes..."
              ></textarea>
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem da Atividade
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">Clique para enviar ou arraste a imagem</p>
                    <p className="text-xs text-gray-500">PNG, JPG ou WEBP (Máx. 2MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              className="min-h-[48px] px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium order-2 sm:order-1"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[48px] px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors order-1 sm:order-2"
            >
              Criar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function InstrutorDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>('atividades');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Definir a aba ativa com base nos parâmetros da URL
  useEffect(() => {
    if (tab === 'alunos') {
      setActiveTab('alunos');
    } else if (tab === 'nova-atividade') {
      setActiveTab('nova-atividade');
    } else if (tab === 'perfil') {
      setActiveTab('perfil');
    } else {
      setActiveTab('atividades');
    }
    
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [tab]);

  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [students, setStudents] = useState<Student[]>(mockStudents);

  // Funções para manipulação de atividades
  const handleEditActivity = (id: string) => {
    router.push(`/dashboard/instrutor/editar-atividade/${id}`);
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
      setActivities(activities.filter(activity => activity.id !== id));
    }
  };

  const handleViewActivityDetails = (id: string) => {
    router.push(`/dashboard/instrutor/atividade/${id}`);
  };

  // Funções para manipulação de alunos
  const handleViewStudentDetails = (id: string) => {
    router.push(`/dashboard/instrutor/aluno/${id}`);
  };

  const handleNewActivity = () => {
    router.push('/dashboard/instrutor?tab=nova-atividade');
  };

  const handleCancelNewActivity = () => {
    router.push('/dashboard/instrutor');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'alunos':
        return renderAlunos();
      case 'nova-atividade':
        return renderNovaAtividade();
      case 'perfil':
        return renderPerfil();
      default:
        return renderAtividades();
    }
  };

  // Renderizar aba de atividades do instrutor
  const renderAtividades = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <p className="text-gray-600">Gerencie suas atividades e veja os alunos inscritos.</p>
          </div>
          
          <button
            className="mt-3 sm:mt-0 min-h-[44px] flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 active:bg-amber-800 transition-colors"
            onClick={handleNewActivity}
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Nova Atividade
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loading
            Array(3).fill(0).map((_, index) => <ActivitySkeleton key={index} />)
          ) : activities.length === 0 ? (
            <div className="col-span-full bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Você ainda não tem atividades cadastradas.</p>
              <button
                className="mt-4 min-h-[48px] px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors"
                onClick={handleNewActivity}
              >
                Criar Primeira Atividade
              </button>
            </div>
          ) : (
            activities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
                onViewDetails={handleViewActivityDetails}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  // Renderizar aba de alunos
  const renderAlunos = () => {
    return (
      <div>
        <div className="mb-6">
          <p className="text-gray-600">Lista de alunos inscritos em suas atividades.</p>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            // Skeleton loading para alunos
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow animate-pulse p-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))
          ) : students.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Você ainda não tem alunos inscritos.</p>
            </div>
          ) : (
            students.map(student => (
              <StudentCard 
                key={student.id} 
                student={student}
                onViewDetails={handleViewStudentDetails}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  // Renderizar aba de nova atividade
  const renderNovaAtividade = () => {
    return (
      <div>
        <div className="mb-6">
          <p className="text-gray-600">Crie uma nova atividade para seus alunos.</p>
        </div>
        
        <NovaAtividadeForm onCancel={handleCancelNewActivity} />
      </div>
    );
  };

  // Renderizar aba de perfil do instrutor
  const renderPerfil = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gray-50 p-6">
            <div className="text-center">
              <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-amber-100 text-amber-600 text-4xl font-bold">
                    {userData?.displayName?.charAt(0) || user?.email?.charAt(0) || 'I'}
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-lg font-medium">{userData?.displayName || user?.email}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <button className="mt-4 min-h-[44px] px-4 py-2 border border-amber-600 text-amber-600 rounded-lg font-medium hover:bg-amber-50 active:bg-amber-100 transition-colors">
                Alterar foto
              </button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Estatísticas</h4>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Atividades</p>
                  <p className="text-2xl font-semibold text-amber-600">{activities.length}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Alunos</p>
                  <p className="text-2xl font-semibold text-amber-600">{students.length}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Avaliação</p>
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-semibold text-amber-600 mr-2">4.8</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className={`w-5 h-5 ${star <= 5 ? 'text-amber-500' : 'text-gray-300'}`}
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <h4 className="text-lg font-medium mb-4">Informações do Perfil</h4>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
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
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="(99) 99999-9999"
                    defaultValue="(21) 99999-9999"
                    inputMode="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidades
                  </label>
                  <select
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    defaultValue="surf"
                  >
                    <option value="surf">Surf</option>
                    <option value="sup">Stand Up Paddle</option>
                    <option value="yoga">Yoga</option>
                    <option value="funcional">Funcional</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografia
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Conte um pouco sobre sua experiência..."
                  defaultValue="Instrutor de surf com mais de 10 anos de experiência. Especializado em aulas para iniciantes e técnicas avançadas."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificações
                </label>
                <input
                  type="text"
                  className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Ex: CBSS, ISA, FPS"
                  defaultValue="CBSS, ISA"
                />
                <p className="text-xs text-gray-500 mt-1">Separe suas certificações por vírgula</p>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium mb-4">Configurações da Conta</h4>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full min-h-[44px] p-3 text-base border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 active:bg-amber-800 transition-colors"
                  >
                    Atualizar Senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
} 