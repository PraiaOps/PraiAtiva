'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import ClientSideWrapper from '@/components/layout/ClientSideWrapper';

// Tipos
type User = {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'instrutor' | 'aluno';
  createdAt: string;
  lastLogin?: string;
};

type Stats = {
  totalUsers: number;
  totalActivities: number;
  totalInstructors: number;
  totalStudents: number;
  pendingActivities: number;
  recentRegistrations: number;
};

// Dados mockados
const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'admin@praiativa.com',
    displayName: 'Administrador',
    role: 'admin',
    createdAt: '2023-11-01',
    lastLogin: '2023-11-23'
  },
  {
    id: 'u2',
    email: 'joao.instrutor@exemplo.com',
    displayName: 'João Silva',
    role: 'instrutor',
    createdAt: '2023-11-05',
    lastLogin: '2023-11-22'
  },
  {
    id: 'u3',
    email: 'maria.aluna@exemplo.com',
    displayName: 'Maria Oliveira',
    role: 'aluno',
    createdAt: '2023-11-10',
    lastLogin: '2023-11-21'
  },
  {
    id: 'u4',
    email: 'pedro.instrutor@exemplo.com',
    displayName: 'Pedro Santos',
    role: 'instrutor',
    createdAt: '2023-11-12',
    lastLogin: '2023-11-20'
  },
  {
    id: 'u5',
    email: 'ana.aluna@exemplo.com',
    displayName: 'Ana Costa',
    role: 'aluno',
    createdAt: '2023-11-15',
    lastLogin: '2023-11-19'
  }
];

const mockStats: Stats = {
  totalUsers: 250,
  totalActivities: 45,
  totalInstructors: 15,
  totalStudents: 230,
  pendingActivities: 8,
  recentRegistrations: 12
};

export default function AdminDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [stats, setStats] = useState<Stats>(mockStats);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Redirecionar se não for admin
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userData && !userData.isAdmin && userData.role !== 'admin') {
        router.push('/atividades');
      }
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <ClientSideWrapper requireAuth allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold">Painel Administrativo</h1>
            <p className="mt-2">Bem-vindo, {userData?.displayName || user?.email}</p>
          </div>
        </div>

        {/* Menu de navegação */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              <button
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'visao-geral' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('visao-geral')}
              >
                Visão Geral
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'usuarios' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('usuarios')}
              >
                Usuários
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'atividades' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('atividades')}
              >
                Atividades
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'configuracoes' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('configuracoes')}
              >
                Configurações
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 py-8">
          {/* Visão Geral */}
          {activeTab === 'visao-geral' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Visão Geral</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card de Estatísticas de Usuários */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <UsersIcon className="h-8 w-8 text-purple-500" />
                    <h3 className="text-lg font-medium ml-2">Usuários</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Usuários:</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instrutores:</span>
                      <span className="font-semibold">{stats.totalInstructors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alunos:</span>
                      <span className="font-semibold">{stats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Novos (7 dias):</span>
                      <span className="font-semibold">{stats.recentRegistrations}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-4 text-sm text-purple-600 hover:text-purple-800"
                    onClick={() => setActiveTab('usuarios')}
                  >
                    Ver Detalhes →
                  </button>
                </div>
                
                {/* Card de Estatísticas de Atividades */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-purple-500" />
                    <h3 className="text-lg font-medium ml-2">Atividades</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Atividades:</span>
                      <span className="font-semibold">{stats.totalActivities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pendentes de Aprovação:</span>
                      <span className="font-semibold">{stats.pendingActivities}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-4 text-sm text-purple-600 hover:text-purple-800"
                    onClick={() => setActiveTab('atividades')}
                  >
                    Ver Detalhes →
                  </button>
                </div>
                
                {/* Card de Acesso Rápido */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Acesso Rápido</h3>
                  
                  <div className="space-y-3">
                    <Link 
                      href="/admin-setup" 
                      className="flex items-center text-gray-700 hover:text-purple-600"
                    >
                      <CogIcon className="h-5 w-5 mr-2" />
                      <span>Configuração de Admin</span>
                    </Link>
                    
                    <Link 
                      href="/cadastro/instrutor" 
                      className="flex items-center text-gray-700 hover:text-purple-600"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      <span>Adicionar Instrutor</span>
                    </Link>
                    
                    <Link 
                      href="/atividades" 
                      className="flex items-center text-gray-700 hover:text-purple-600"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>Ver Atividades</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usuários */}
          {activeTab === 'usuarios' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  Adicionar Usuário
                </button>
              </div>
              
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Função
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criado em
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último login
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'instrutor' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                              {user.role === 'admin' ? 'Admin' : user.role === 'instrutor' ? 'Instrutor' : 'Aluno'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button 
                              className="text-purple-600 hover:text-purple-900"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                            >
                              Editar
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Atividades */}
          {activeTab === 'atividades' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Gerenciar Atividades</h2>
              
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Funcionalidade em desenvolvimento.</p>
                <p className="mt-2 text-gray-500">Aqui serão listadas todas as atividades para aprovação e gerenciamento.</p>
              </div>
            </div>
          )}

          {/* Configurações */}
          {activeTab === 'configuracoes' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Configurações do Sistema</h2>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Configurações Gerais</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Plataforma
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          defaultValue="PraiAtiva"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email de Contato
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          defaultValue="contato@praiativa.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Segurança</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="aprovacao-instrutores"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="aprovacao-instrutores" className="font-medium text-gray-700">
                            Exigir aprovação para novos instrutores
                          </label>
                          <p className="text-gray-500">
                            Novos instrutores precisarão ser aprovados por um administrador antes de publicar atividades.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notificacoes-admins"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notificacoes-admins" className="font-medium text-gray-700">
                            Enviar notificações aos administradores
                          </label>
                          <p className="text-gray-500">
                            Notificar todos os administradores sobre novos cadastros e atividades pendentes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientSideWrapper>
  );
}