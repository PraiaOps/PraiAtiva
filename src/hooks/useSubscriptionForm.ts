'use client';

import { useState } from 'react';

interface UseSubscriptionFormProps {
  initialState?: {
    nome?: string;
    sobrenome?: string;
    email?: string;
    interesse?: string;
  };
  onSubmitSuccess?: () => void; // Callback opcional
  resetTimeout?: number; // Tempo em ms para resetar (padrão 3000)
}

export function useSubscriptionForm({
  initialState = {},
  onSubmitSuccess,
  resetTimeout = 3000,
}: UseSubscriptionFormProps = {}) {
  const [nome, setNome] = useState(initialState.nome || '');
  const [sobrenome, setSobrenome] = useState(initialState.sobrenome || '');
  const [email, setEmail] = useState(initialState.email || '');
  const [interesse, setInteresse] = useState(initialState.interesse || '');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false); // Estado de carregamento

  const resetForm = () => {
    setNome(initialState.nome || '');
    setSobrenome(initialState.sobrenome || '');
    setEmail(initialState.email || '');
    setInteresse(initialState.interesse || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    // Simular envio de formulário para uma API
    console.log('Enviando dados:', { nome, sobrenome, email, interesse });
    try {
      // Aqui você chamaria sua API (ex: Firebase function)
      // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ nome, sobrenome, email, interesse }) });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da rede
      
      setEnviado(true);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      // Resetar formulário e estado de "enviado" após o timeout
      const timer = setTimeout(() => {
        setEnviado(false);
        resetForm();
      }, resetTimeout);

      // Cleanup do timer se o componente for desmontado antes
      return () => clearTimeout(timer);

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      // Adicionar tratamento de erro (ex: mostrar mensagem para o usuário)
    } finally {
      setEnviando(false);
    }
  };

  return {
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    email,
    setEmail,
    interesse,
    setInteresse,
    enviado,
    enviando,
    handleSubmit,
    resetForm, // Expor reset se necessário externamente
  };
} 