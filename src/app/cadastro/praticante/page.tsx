'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

const activityPreferences = [
  { id: 'volleyball', name: 'Vôlei de praia' },
  { id: 'surfing', name: 'Surf' },
  { id: 'swimming', name: 'Natação' },
  { id: 'yoga', name: 'Yoga' },
  { id: 'paddleboarding', name: 'Stand Up Paddle' },
  { id: 'jogging', name: 'Corrida' },
  { id: 'kitesurf', name: 'Kitesurf' },
  { id: 'sailing', name: 'Vela' },
  { id: 'meditation', name: 'Meditação' },
  { id: 'tour', name: 'Passeios turísticos' },
  { id: 'fishing', name: 'Pesca' },
  { id: 'functional', name: 'Funcional' },
];

export default function PractitionerSignUp() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    preferences: [] as string[],
    terms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleActivityToggle = (activityId: string) => {
    setFormData(prev => {
      const newPreferences = prev.preferences.includes(activityId)
        ? prev.preferences.filter(id => id !== activityId)
        : [...prev.preferences, activityId];
      
      return {
        ...prev,
        preferences: newPreferences,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Preparar dados do usuário
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        role: 'practitioner',
        preferences: formData.preferences,
      };
      
      // Criar conta no Firebase
      await signup(formData.email, formData.password, userData);
      
      // Redirecionar para o dashboard ou página de confirmação
      router.push('/cadastro/sucesso');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está sendo usado por outra conta.');
      } else if (error.code === 'auth/invalid-email') {
        setError('E-mail inválido.');
      } else if (error.code === 'auth/weak-password') {
        setError('A senha é muito fraca.');
      } else {
        setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
      }
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const isStepOneValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.password === formData.passwordConfirm &&
      formData.password.length >= 6
    );
  };

  const isStepTwoValid = () => {
    return formData.preferences.length > 0 && formData.terms;
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary-600">Crie sua conta de Praticante</h1>
                <p className="text-gray-600 mt-2">
                  Junte-se a milhares de pessoas buscando atividades nas praias
                </p>
              </div>

              {/* Exibir mensagem de erro */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Progresso */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > 1 ? <CheckCircleIcon className="h-6 w-6" /> : '1'}
                    </div>
                    <span className="ml-2 font-medium">Informações básicas</span>
                  </div>
                  <div className="flex-grow mx-4 h-1 bg-gray-200">
                    <div 
                      className="h-full bg-primary-500" 
                      style={{ width: step > 1 ? '100%' : '0%', transition: 'width 0.3s' }}
                    ></div>
                  </div>
                  <div className="flex items-center">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > 2 ? <CheckCircleIcon className="h-6 w-6" /> : '2'}
                    </div>
                    <span className="ml-2 font-medium">Preferências</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="label">
                          Nome completo
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="label">
                          Telefone (opcional)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="label">
                          Senha
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Mínimo de 6 caracteres"
                          minLength={6}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="passwordConfirm" className="label">
                          Confirmar senha
                        </label>
                        <input
                          type="password"
                          id="passwordConfirm"
                          name="passwordConfirm"
                          value={formData.passwordConfirm}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Confirme sua senha"
                          minLength={6}
                          required
                        />
                        {formData.password !== formData.passwordConfirm && formData.passwordConfirm && (
                          <p className="text-red-500 text-sm mt-1">As senhas não conferem</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Link 
                        href="/cadastro" 
                        className="btn-outline"
                      >
                        Voltar
                      </Link>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepOneValid()}
                        className={`btn-primary ${!isStepOneValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Selecione suas atividades de interesse</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activityPreferences.map((activity) => (
                          <div 
                            key={activity.id}
                            onClick={() => handleActivityToggle(activity.id)}
                            className={`
                              border rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors
                              ${formData.preferences.includes(activity.id)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-primary-300'
                              }
                            `}
                          >
                            {formData.preferences.includes(activity.id) ? (
                              <CheckCircleIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
                            ) : (
                              <PlusCircleIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            )}
                            <span>{activity.name}</span>
                          </div>
                        ))}
                      </div>
                      {formData.preferences.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">Selecione pelo menos uma atividade</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={formData.terms}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            required
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="text-gray-700">
                            Concordo com os{' '}
                            <Link href="/termos" className="text-primary-600 hover:text-primary-700">
                              Termos de Uso
                            </Link>{' '}
                            e{' '}
                            <Link href="/privacidade" className="text-primary-600 hover:text-primary-700">
                              Política de Privacidade
                            </Link>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-outline"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={!isStepTwoValid() || isLoading}
                        className={`btn-primary flex items-center ${(!isStepTwoValid() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading && (
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {isLoading ? 'Criando conta...' : 'Criar minha conta'}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Faça login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 