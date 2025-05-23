'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InstructorFinancialSummary } from '@/types';
import {
  ArrowTrendingUpIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface FinancialSummaryCardProps {
  summary: InstructorFinancialSummary;
}

export const FinancialSummaryCard = ({ summary }: FinancialSummaryCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    return format(new Date(Number(year), Number(month) - 1), 'MMMM yyyy', { locale: ptBR });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Resumo Financeiro</h2>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Total Earnings */}
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recebido</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pendente</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.pendingAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Commission Rate */}
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa da Plataforma</p>
              <p className="text-2xl font-bold text-gray-900">
                {(summary.commissionRate * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Earnings */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ganhos por Período
        </h3>
        
        {summary.periodEarnings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum ganho registrado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {summary.periodEarnings.map((period) => (
              <div
                key={period.period}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {formatPeriod(period.period)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {period.enrollments} matrícula{period.enrollments !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(period.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Payout Section */}
      {summary.nextPayout && (
        <div className="p-6 border-t border-gray-200 bg-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Próximo Pagamento
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Previsão para {format(
                  new Date(summary.nextPayout.estimatedDate),
                  "dd 'de' MMMM", 
                  { locale: ptBR }
                )}
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.nextPayout.amount)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
