'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { activityService } from '@/services/activityService';
import { enrollmentService } from '@/services/enrollmentService';
import { notificationService } from '@/services/notificationService';
import { Activity } from '@/services/activityService';
import { Enrollment } from '@/services/enrollmentService';
import { Notification } from '@/services/notificationService';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function InstrutorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Suspense boundary for initial data loading
  if (typeof window === 'undefined') {
    return null; // Return null during server-side rendering
  }
  const { user, userData } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Escutar atividades em tempo real
    const unsubscribeActivities = activityService.subscribeToActivities(
      (activities) => setActivities(activities),
      { instructorId: user.uid }
    );

    // Escutar matrículas em tempo real
    const unsubscribeEnrollments = enrollmentService.subscribeToEnrollments(
      (enrollments) => setEnrollments(enrollments),
      { instructorId: user.uid }
    );

    // Escutar notificações em tempo real
    const unsubscribeNotifications = notificationService.subscribeToNotifications(
      user.uid,
      (notifications) => setNotifications(notifications)
    );

    setLoading(false);

    return () => {
      unsubscribeActivities();
      unsubscribeEnrollments();
      unsubscribeNotifications();
    };
  }, [user]);

  const handleCreateActivity = () => {
    router.push('/dashboard/instrutor/nova-atividade');
  };

  const handleEditActivity = (id: string) => {
    router.push(`/dashboard/instrutor/atividades/${id}/editar`);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return;

    try {
      setLoading(true);
      await activityService.deleteActivity(id);
      // Não é necessário atualizar o estado local pois o subscribeToActivities já fará isso
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      setError('Erro ao excluir atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnrollment = async (id: string) => {
    try {
      await enrollmentService.updateEnrollment(id, { status: 'confirmed' });
    } catch (error) {
      console.error('Erro ao confirmar matrícula:', error);
      setError('Erro ao confirmar matrícula. Tente novamente.');
    }
  };

  const handleCancelEnrollment = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta matrícula?')) return;

    try {
      await enrollmentService.updateEnrollment(id, { status: 'cancelled' });
    } catch (error) {
      console.error('Erro ao cancelar matrícula:', error);
      setError('Erro ao cancelar matrícula. Tente novamente.');
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await notificationService.updateNotification(id, { read: true });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Painel do Instrutor</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-orange-600 focus:outline-none"
          >
            <BellIcon className="h-6 w-6" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-600 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button
            onClick={handleCreateActivity}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Atividade
          </button>
        </div>
      </div>

      {/* Notificações */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhuma notificação</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg ${
                          notification.read ? 'bg-gray-50' : 'bg-orange-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkNotificationAsRead(notification.id)}
                              className="text-sm text-orange-600 hover:text-orange-700"
                            >
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Atividades */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Minhas Atividades</h2>
          {activities.length === 0 ? (
            <p className="text-gray-500">Nenhuma atividade cadastrada</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {activity.image && (
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{activity.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Local:</span> {activity.beach}, {activity.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Horário:</span> {activity.horarios[0]?.horario}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Capacidade:</span> {activity.enrolledStudents}/{activity.horarios[0]?.limiteAlunos}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Preço:</span> R$ {Number(activity.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditActivity(activity.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-orange-600 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Matrículas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Matrículas Recentes</h2>
          {enrollments.length === 0 ? (
            <p className="text-gray-500">Nenhuma matrícula encontrada</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Atividade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pagamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enrollment.activityName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {enrollment.status === 'confirmed'
                            ? 'Confirmada'
                            : enrollment.status === 'pending'
                            ? 'Pendente'
                            : 'Cancelada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {enrollment.paymentStatus === 'paid'
                            ? 'Pago'
                            : enrollment.paymentStatus === 'pending'
                            ? 'Pendente'
                            : 'Reembolsado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {enrollment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmEnrollment(enrollment.id)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleCancelEnrollment(enrollment.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
