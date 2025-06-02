'use client';

import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Pagamento Cancelado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              O pagamento foi cancelado. Você pode tentar novamente quando quiser.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voltar para o Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
