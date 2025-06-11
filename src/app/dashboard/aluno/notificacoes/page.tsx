'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import { type Notification } from '@/types';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function NotificacoesPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribeNotifications =
      notificationService.subscribeToNotifications(user.uid, notifications => {
        setNotifications(notifications);
        setLoading(false);
      });

    return () => {
      unsubscribeNotifications();
    };
  }, [user]);
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      setError('Erro ao marcar notificação como lida. Tente novamente.');
    }
  };
  const handleMarkAllAsRead = async () => {
    try {
      if (!user) return;
      await notificationService.markAllAsRead(user.uid);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      setError(
        'Erro ao marcar todas as notificações como lidas. Tente novamente.'
      );
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
        <h1 className="text-2xl font-semibold text-gray-900">Notificações</h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Lista de Notificações */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma notificação
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Você não tem notificações no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
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
                      </p>                      <p className="mt-1 text-xs text-gray-400">
                        {typeof notification.createdAt === 'object' && 'seconds' in notification.createdAt 
                          ? new Date(notification.createdAt.seconds * 1000).toLocaleString()
                          : notification.createdAt instanceof Date 
                            ? notification.createdAt.toLocaleString()
                            : ''}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-sm text-orange-600 hover:text-orange-700"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
