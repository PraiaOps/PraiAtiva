import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, query, where, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase'; // Sua config do Firebase client-side
import { User } from '@/types'; // Seus tipos de usuário

// Estilo básico para o alerta (você pode mover para um arquivo CSS)
const alertStyles: React.CSSProperties = {
  padding: '15px',
  marginBottom: '20px',
  border: '1px solid transparent',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif', // Substitua pela fonte da sua identidade visual
  color: '#a94442', // Cor de texto para erro (exemplo)
  backgroundColor: '#f2dede', // Cor de fundo para erro (exemplo)
  borderColor: '#ebccd1', // Cor da borda para erro (exemplo)
};

const iconStyles: React.CSSProperties = {
  marginRight: '10px',
  width: '24px',
  height: '24px',
};

interface SignUpFormProps {
  roleToRegister: User['role']; // 'student', 'instructor', etc.
  onSuccess?: (userId: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ roleToRegister, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Verificar se o email já existe na coleção 'users' do Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Email encontrado no Firestore.
        // Você pode adicionar lógica aqui para verificar se a role é a mesma ou diferente,
        // mas a política mais simples é impedir novo cadastro se o email já existe.
        setError('Este email já está em uso!');
        setIsLoading(false);
        return;
      }

      // 2. Se o email não está em uso no Firestore, criar o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const firebaseUser = userCredential.user;

      // 3. Salvar os dados do usuário no Firestore
      const newUserProfile: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { uid: string } = {
        uid: firebaseUser.uid,
        name: name.trim(),
        email: firebaseUser.email!, // email é garantido aqui
        role: roleToRegister,
        // Adicione outros campos conforme necessário (phone, photoURL, etc.)
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUserProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('Usuário cadastrado com sucesso:', firebaseUser.uid);
      setIsLoading(false);
      if (onSuccess) onSuccess(firebaseUser.uid);
      // Redirecionar ou limpar formulário

    } catch (authError: any) {
      setIsLoading(false);
      if (authError.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado no sistema de autenticação!');
      } else if (authError.code === 'auth/weak-password') {
        setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else {
        console.error('Erro ao cadastrar:', authError);
        setError('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      {error && (
        <div style={alertStyles}>
          {/* <img src="/path/to/your/icon-error.svg" alt="Erro" style={iconStyles} />  Você pode adicionar um ícone */}
          <p>{error}</p>
        </div>
      )}
      <div><label>Nome: <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label></div>
      <div><label>Email: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label></div>
      <div><label>Senha: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label></div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default SignUpForm;