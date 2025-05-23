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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header with activity name and status */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">
              {enrollment.activityDetails.name}
            </h3>
            {viewType === 'instructor' ? (
              <p className="text-gray-600 text-sm">
                Aluno: {enrollment.studentDetails.name}
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Instrutor: {enrollment.instructorId}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className={`${status.bg} ${status.text} px-3 py-1.5 rounded-full text-sm font-semibold inline-flex whitespace-nowrap`}>
              {status.label}
            </div>
            <div className={`${paymentStatus.bg} ${paymentStatus.text} px-3 py-1.5 rounded-full text-sm font-semibold inline-flex whitespace-nowrap`}>
              {paymentStatus.label}
            </div>
          </div>
        </div>

        {/* Activity details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700 text-sm">
            <CalendarIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <ClockIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{enrollment.activityDetails.schedule.startTime}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm col-span-2">
            <MapPinIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{enrollment.activityDetails.location}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm col-span-2">
            <CurrencyDollarIcon className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>
              R$ {enrollment.paymentInfo.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {enrollment.status !== 'cancelled' &&
            enrollment.status !== 'completed' &&
            enrollment.status !== 'refunded' &&
            onCancel && (
              <button
                onClick={() => onCancel(enrollment.id)}
                className="min-h-[48px] flex-1 flex items-center justify-center px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 active:bg-red-100 transition-colors"
              >
                <XCircleIcon className="h-5 w-5 mr-2" />
                Cancelar
              </button>
            )}

          {viewType === 'instructor' &&
            enrollment.status === 'confirmed' &&
            onMarkAttendance && (
              <button
                onClick={() => onMarkAttendance(enrollment.id, true)}
                className="min-h-[48px] flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Marcar Presença
              </button>
            )}

          <button
            onClick={() => onViewDetails(enrollment.id)}
            className="min-h-[48px] flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
