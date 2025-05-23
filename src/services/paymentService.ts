import { loadStripe } from '@stripe/stripe-js';
import { 
  Transaction,
  Enrollment
} from '@/types';

// Inicializar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

class PaymentService {
  /**
   * Iniciar processo de pagamento
   */
  async initiatePayment(enrollment: Enrollment) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      // Criar sessão de pagamento com o Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId: enrollment.id,
          amount: enrollment.paymentInfo.amount,
          studentEmail: enrollment.studentDetails.email,
          activityName: enrollment.activityDetails.name,
        }),
      });

      const session = await response.json();

      // Redirecionar para página de checkout do Stripe
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Erro ao iniciar pagamento:', error);
      throw error;
    }
  }

  /**
   * Processar pagamento bem-sucedido
   */
  async processSuccessfulPayment(sessionId: string): Promise<void> {
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  /**
   * Iniciar processo de reembolso
   */
  async initiateRefund(
    enrollmentId: string,
    reason: string
  ): Promise<void> {
    try {
      const response = await fetch('/api/create-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate refund');
      }
    } catch (error) {
      console.error('Erro ao iniciar reembolso:', error);
      throw error;
    }
  }

  /**
   * Obter histórico de transações
   */
  async getTransactionHistory(
    userId: string,
    userType: 'student' | 'instructor',
    filters?: {
      startDate?: Date;
      endDate?: Date;
      status?: Transaction['status'];
    }
  ): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams({
        userId,
        userType,
        ...(filters?.startDate && { startDate: filters.startDate.toISOString() }),
        ...(filters?.endDate && { endDate: filters.endDate.toISOString() }),
        ...(filters?.status && { status: filters.status }),
      });

      const response = await fetch(`/api/transactions?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar histórico de transações:', error);
      throw error;
    }
  }

  /**
   * Simula pagamento via PIX para o fluxo de teste
   */
  async simulatePixPayment(enrollment: Enrollment): Promise<void> {
    try {
      // Simula um delay de processamento do PIX
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualiza o status da matrícula após "pagamento"
      await fetch('/api/confirm-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId: enrollment.id,
          paymentMethod: 'pix',
          amount: enrollment.paymentInfo.amount
        }),
      });
    } catch (error) {
      console.error('Erro ao processar pagamento PIX:', error);
      throw error;
    }
  }

  /**
   * Obter histórico de transações do instrutor
   */
  async getInstructorTransactions(
    instructorId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      status?: Transaction['status'];
    }
  ): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams({
        instructorId,
        ...(filters?.startDate && { startDate: filters.startDate.toISOString() }),
        ...(filters?.endDate && { endDate: filters.endDate.toISOString() }),
        ...(filters?.status && { status: filters.status })
      });

      const response = await fetch(`/api/instructor/transactions?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
