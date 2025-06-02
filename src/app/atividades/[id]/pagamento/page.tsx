'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { activityService } from '@/services/activityService';
import { enrollmentService } from '@/services/enrollmentService';
import { Activity } from '@/types';
import { CheckCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/layout/Footer';
import { QRCodeSVG } from 'qrcode.react';

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [copied, setCopied] = useState(false);

  // Chave PIX de exemplo (em produção, isso viria do backend)
  const pixKey = '12345678900';
  const pixCopyPaste = `00020126580014BR.GOV.BCB.PIX0136${pixKey}520400005303986540599.905802BR5915NOME EMPRESA6008BRASILIA62070503***6304E2CA`;

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const activityData = await activityService.getActivity(params.id);
        if (activityData) {
          setActivity(activityData);
        } else {
          setError('Atividade não encontrada');
        }
      } catch (error) {
        console.error('Erro ao carregar atividade:', error);
        setError('Erro ao carregar atividade');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [params.id]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    if (!user) {
      setError('Você precisa estar logado para realizar o pagamento.');
      return;
    }

    if (!activity) {
      setError('Atividade não encontrada.');
      return;
    }

    try {
      setLoading(true);
      setPaymentStatus('processing');

      // Criar matrícula usando o enrollmentService
      const enrollmentId = await enrollmentService.createEnrollment({
        activityId: activity.id,
        studentId: user.uid,
        studentName: user.displayName || 'Aluno',
        instructorId: activity.instructorId,
        instructorName: activity.instructorName,
        activityName: activity.name,
        status: 'pending',
        paymentInfo: {
          amount: activity.price,
          commission: activity.price * 0.15, // 15% de comissão
          instructorAmount: activity.price * 0.85, // 85% para o instrutor
          paymentMethod: 'pix',
          paymentStatus: 'pending',
          paymentDate: new Date()
        },
        created: new Date(),
        updated: new Date()
      });

      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualizar status do pagamento
      await enrollmentService.updateEnrollment(enrollmentId, {
        status: 'confirmed',
        paymentInfo: {
          amount: activity.price,
          commission: activity.price * 0.15,
          instructorAmount: activity.price * 0.85,
          paymentMethod: 'pix',
          paymentStatus: 'paid',
          paymentDate: new Date()
        }
      });

      setPaymentStatus('completed');
      setTimeout(() => {
        router.push('/dashboard/aluno');
      }, 2000);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError('Erro ao processar pagamento. Tente novamente.');
      setPaymentStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Erro</h2>
          <p className="text-gray-600">{error || 'Atividade não encontrada'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-semibold mb-6">Pagamento com PIX</h1>

              {paymentStatus === 'pending' && (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Valor a pagar</h2>
                    <p className="text-3xl font-bold text-sky-600">
                      R$ {Number(activity.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-lg font-medium mb-4">Escaneie o QR Code</h2>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                      <QRCodeSVG value={pixCopyPaste} size={200} />
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-lg font-medium mb-2">Ou copie o código PIX</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-mono break-all">{pixCopyPaste}</p>
                      </div>
                      <button
                        onClick={handleCopyPix}
                        className="p-3 text-gray-600 hover:text-sky-600 transition-colors"
                      >
                        {copied ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <ClipboardIcon className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={handleSimulatePayment}
                      className="w-full bg-sky-600 text-white py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors font-medium"
                    >
                      Simular Pagamento
                    </button>
                  </div>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Processando pagamento...</p>
                </div>
              )}

              {paymentStatus === 'completed' && (
                <div className="text-center py-12">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Pagamento Confirmado!</h2>
                  <p className="text-gray-600 mb-4">
                    Você será redirecionado para o dashboard em instantes...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
