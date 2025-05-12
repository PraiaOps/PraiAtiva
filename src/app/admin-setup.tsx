'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'next/navigation';

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const createAdminUser = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        'admin@praiativa.com',
        'admin123'
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: 'admin@praiativa.com',
        displayName: 'Administrador',
        role: 'admin',
        isAdmin: true,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      setMessage('Usuário administrador criado com sucesso!');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('O usuário admin já existe. Você pode fazer login normalmente ou testar o login abaixo.');
      } else {
        setError(`Erro ao criar admin: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await signInWithEmailAndPassword(auth, 'admin@praiativa.com', 'admin123');
      setMessage('Login de admin bem-sucedido! Redirecionando...');
      
      setTimeout(() => router.push('/atividades'), 1500);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Usuário admin não encontrado. Clique em "Criar Admin" primeiro.');
      } else if (['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(err.code)) {
        setError('Credenciais incorretas. A senha padrão é "admin123".');
      } else {
        setError(`Erro ao fazer login: ${err.code || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Configuração do Administrador</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700">
          {error}
        </div>
      )}
      
      <p className="mb-6">
        Esta página configura o usuário administrador padrão:
        <br />
        <strong>Email:</strong> admin@praiativa.com
        <br />
        <strong>Senha:</strong> admin123
      </p>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={createAdminUser}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Criar Admin'}
        </button>
        
        <button
          onClick={testAdminLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Testar Login Admin'}
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h2 className="font-semibold mb-2">Solução de problemas:</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>Se ocorrer um erro 400 ao tentar login, o usuário pode não existir.</li>
          <li>Clique em "Criar Admin" para registrar o usuário admin.</li>
          <li>Após criar o usuário, use o botão "Entrar como Admin" na tela de login.</li>
        </ul>
      </div>
    </div>
  );
} 