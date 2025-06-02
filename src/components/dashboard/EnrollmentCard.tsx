'use client';

import { Enrollment } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { PaymentButton } from '../payment/PaymentButton';

interface EnrollmentCardProps {
  enrollment: Enrollment;
  viewType: 'student' | 'instructor';
  onViewDetails: (enrollmentId: string) => void;
  onCancel?: (enrollmentId: string) => void;
  onMarkAttendance?: (enrollmentId: string, present: boolean) => void;
}

export const EnrollmentCard = ({
  enrollment,
  viewType,
  onViewDetails,
  onCancel,
  onMarkAttendance,
}: EnrollmentCardProps) => {
  const date = typeof enrollment.activityDetails.schedule.date === 'string'
    ? new Date(enrollment.activityDetails.schedule.date)
    : enrollment.activityDetails.schedule.date;

  const formattedDate = format(
    date,
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  const paymentStatusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pagamento Pendente' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pago' },
    refunded: { bg: 'bg-red-100', text: 'text-red-800', label: 'Reembolsado' },
  };

  const enrollmentStatusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Aguardando Confirmação' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Concluída' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Reembolsada' },
  };

  const status = enrollmentStatusConfig[enrollment.status];
  const paymentStatus = paymentStatusConfig[enrollment.paymentInfo.paymentStatus];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {enrollment.activityName}
          </h3>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            {formattedDate}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            {enrollment.activityDetails.schedule.time}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            {enrollment.activityDetails.location}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            {viewType === 'student' ? enrollment.instructorName : enrollment.studentName}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <span className={`${paymentStatus.text}`}>
                {paymentStatus.label}
              </span>
            </div>

            {viewType === 'student' && enrollment.status === 'pending' && (
              <PaymentButton
                payment={{
                  id: enrollment.id,
                  studentId: enrollment.studentId,
                  instructorId: enrollment.instructorId,
                  activityId: enrollment.activityId,
                  enrollmentId: enrollment.id,
                  studentName: enrollment.studentName,
                  instructorName: enrollment.instructorName,
                  activityName: enrollment.activityName,
                  amount: enrollment.paymentInfo.amount,
                  status: enrollment.paymentInfo.paymentStatus,
                  created: enrollment.created,
                  updated: enrollment.updated
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => onViewDetails(enrollment.id)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ver Detalhes
          </button>

          {viewType === 'instructor' && enrollment.status === 'pending' && (
            <>
              <button
                onClick={() => onCancel?.(enrollment.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar
              </button>
            </>
          )}

          {viewType === 'instructor' && enrollment.status === 'confirmed' && onMarkAttendance && (
            <button
              onClick={() => onMarkAttendance(enrollment.id, true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Marcar Presença
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
