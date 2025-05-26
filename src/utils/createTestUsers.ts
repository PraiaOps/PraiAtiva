import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

// Lista de usuários de teste a serem criados
const testUsers = [
  {
    email: 'aluno.teste@praiatativa.com',
    password: 'teste123',
    userData: {
      nomeCompleto: 'Aluno Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      role: 'student', // Corrigido para inglês
    }
  },
  {
    email: 'instrutor.teste@praiatativa.com',
    password: 'teste123',
    userData: {
      nomeCompleto: 'Instrutor Teste',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      praiaPrincipal: 'Copacabana',
      modalidadesEsportivas: ['Surfe', 'Stand Up Paddle'],
      role: 'instructor', // Corrigido para inglês
      aprovado: true,
    }
  },
  {
    email: 'admin@praiatativa.com',
    password: 'admin123',
    userData: {
      nomeCompleto: 'Administrador',
      role: 'admin',
    }
  }
];

/**
 * Verifica e cria usuários de teste se eles não existirem
 */
export async function ensureTestUsers() {
  console.log('Verificando usuários de teste...');
  
  try {
    for (const user of testUsers) {
      try {
        // Tentar criar o usuário (vai falhar se já existir)
        console.log(`Tentando criar usuário de teste: ${user.email}`);
        
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            user.email, 
            user.password
          );
          
          // Salvar dados no Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...user.userData,
            email: user.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
          
          console.log(`Usuário de teste criado: ${user.email}`);
        } catch (error: any) {
          // Se o usuário já existir, apenas log
          if (error.code === 'auth/email-already-in-use') {
            console.log(`Usuário já existe: ${user.email}`);
          } else {
            console.error(`Erro ao criar usuário de teste ${user.email}:`, error);
          }
        }
      } catch (error) {
        console.error(`Erro ao verificar usuário ${user.email}:`, error);
      }
    }
    console.log('Verificação de usuários de teste concluída.');
  } catch (error) {
    console.error('Erro ao verificar/criar usuários de teste:', error);
  }
}