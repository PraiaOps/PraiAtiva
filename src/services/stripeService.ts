import { loadStripe } from '@stripe/stripe-js';
import { db } from '@/config/firebase';
import { collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Payment, Transaction } from '@/types';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key is not defined');
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

class StripeService {
  private paymentsCollection = 'payments';
  private transactionsCollection = 'transactions';

  /**
   * Cria uma sessão de pagamento no Stripe
   */
  async createPaymentSession(payment: Payment): Promise<string> {
    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe não inicializado');

      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: payment.id,
          amount: payment.amount,
          studentName: payment.studentName,
          activityName: payment.activityName,
        }),
      });

      const session = await response.json();

      // Atualizar pagamento com ID da sessão
      await updateDoc(doc(db, this.paymentsCollection, payment.id), {
        stripeSessionId: session.id,
        updated: serverTimestamp(),
      });

      return session.id;
    } catch (error) {
      console.error('Erro ao criar sessão de pagamento:', error);
      throw error;
    }
  }

  /**
   * Processa um pagamento bem-sucedido
   */
  async handleSuccessfulPayment(paymentId: string, stripeTransactionId: string): Promise<void> {
    try {
      const paymentRef = doc(db, this.paymentsCollection, paymentId);
      const payment = (await paymentRef.get()).data() as Payment;

      // Criar transação
      await this.createTransaction({
        enrollmentId: payment.enrollmentId,
        type: 'payment',
        amount: payment.amount,
        commission: payment.amount * 0.15, // 15% de comissão
        instructorAmount: payment.amount * 0.85, // 85% para o instrutor
        status: 'completed',
        stripeTransactionId,
        createdAt: new Date(),
        completedAt: new Date(),
      });

      // Atualizar status do pagamento
      await updateDoc(paymentRef, {
        status: 'paid',
        updated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  /**
   * Processa um reembolso
   */
  async handleRefund(paymentId: string, stripeTransactionId: string): Promise<void> {
    try {
      const paymentRef = doc(db, this.paymentsCollection, paymentId);
      const payment = (await paymentRef.get()).data() as Payment;

      // Criar transação de reembolso
      await this.createTransaction({
        enrollmentId: payment.enrollmentId,
        type: 'refund',
        amount: payment.amount,
        commission: payment.amount * 0.15,
        instructorAmount: payment.amount * 0.85,
        status: 'completed',
        stripeTransactionId,
        createdAt: new Date(),
        completedAt: new Date(),
      });

      // Atualizar status do pagamento
      await updateDoc(paymentRef, {
        status: 'refunded',
        updated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao processar reembolso:', error);
      throw error;
    }
  }

  /**
   * Cria uma transação no banco de dados
   */
  private async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
    try {
      const transactionRef = await collection(db, this.transactionsCollection).add({
        ...transaction,
        createdAt: serverTimestamp(),
      });

      return transactionRef.id;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
