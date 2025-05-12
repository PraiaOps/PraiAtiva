// Script para criar usuários de teste no Firebase
// Execute com: node scripts/create-test-users.js

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signOut 
} = require('firebase/auth');
const { 
  getFirestore, 
  doc, 
  setDoc 
} = require('firebase/firestore');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente (manter para compatibilidade)
dotenv.config();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAu9bo8fy_L1PxGo6jYEY2IP9gFhdS710g",
  authDomain: "praiativa-a417f.firebaseapp.com",
  projectId: "praiativa-a417f",
  storageBucket: "praiativa-a417f.appspot.com",
  messagingSenderId: "1058362857760",
  appId: "1:1058362857760:web:702c94c60462f441445f45",
  measurementId: "G-Z8SLE3SKKJ"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuários de teste
const testUsers = [
  {
    email: 'aluno.teste@praiatativa.com',
    password: 'teste123',
    userData: {
      nomeCompleto: 'Aluno Teste',
      email: 'aluno.teste@praiatativa.com',
      role: 'aluno',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      dataCadastro: new Date()
    }
  },
  {
    email: 'instrutor.teste@praiatativa.com',
    password: 'teste123',
    userData: {
      nomeCompleto: 'Instrutor Teste',
      email: 'instrutor.teste@praiatativa.com',
      role: 'instrutor',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      praiaPrincipal: 'Copacabana',
      modalidadesEsportivas: ['Surfe', 'Stand Up Paddle', 'Funcional'],
      linkRede: 'https://instagram.com/instrutorteste',
      dataCadastro: new Date(),
      aprovado: true
    }
  },
  {
    email: 'admin@praiatativa.com',
    password: 'admin123',
    userData: {
      nomeCompleto: 'Administrador',
      email: 'admin@praiatativa.com',
      role: 'admin',
      dataCadastro: new Date()
    }
  }
];

// Função para criar um usuário
async function createTestUser(user) {
  try {
    // Criar usuário na autenticação
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    console.log(`Usuário ${user.email} criado com sucesso na autenticação.`);
    
    // Adicionar dados ao Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), user.userData);
    console.log(`Dados do usuário ${user.email} adicionados ao Firestore.`);
    
    return userCredential.user.uid;
  } catch (error) {
    console.error(`Erro ao criar o usuário ${user.email}:`, error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log(`O usuário ${user.email} já existe.`);
    }
    
    return null;
  }
}

// Função principal para criar todos os usuários de teste
async function createAllTestUsers() {
  console.log('Iniciando criação de usuários de teste...');
  
  for (const user of testUsers) {
    console.log(`Criando usuário: ${user.email}`);
    await createTestUser(user);
    
    // Logout entre cada criação de usuário
    await signOut(auth);
  }
  
  console.log('Processo concluído!');
  process.exit(0);
}

// Executar o script
createAllTestUsers().catch(error => {
  console.error('Erro no script:', error);
  process.exit(1);
}); 