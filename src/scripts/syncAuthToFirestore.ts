// Script para sincronizar usuários do Firebase Auth com a coleção 'users' do Firestore
// Cria documentos para usuários que só existem no Auth, e corrige roles inconsistentes
// Execute com: npx ts-node src/scripts/syncAuthToFirestore.ts

import { initializeApp, getApps, applicationDefault, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Inicialização do Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const auth = getAuth();
const db = getFirestore();

// Função utilitária para mapear roles para o padrão do sistema
function normalizeRole(roleFromFirestore: string | undefined, email: string): string {
  // 1. Se uma role já existe no Firestore e não é vazia, priorize-a.
  if (roleFromFirestore) {
    const lowerRole = roleFromFirestore.toLowerCase();
    if (lowerRole === 'aluno') {
      return 'student'; // Normaliza 'aluno' para 'student'
    }
    // Para qualquer outra role existente e válida (ex: 'instructor', 'admin', 'student', 'entrepreneur'),
    // mantenha-a. Isso é crucial para não reclassificar incorretamente um 'instructor'.
    // Certifique-se que os valores retornados aqui são compatíveis com User['role']
    if (['practitioner', 'entrepreneur', 'admin', 'student', 'instructor'].includes(lowerRole)) {
      return lowerRole;
    }
    // Se for uma role desconhecida, pode ser necessário decidir uma política (ex: logar e manter ou default)
    // Por agora, vamos manter se não for 'aluno', mas idealmente deveria ser um dos tipos válidos.
    return roleFromFirestore; // Ou uma lógica mais estrita para retornar um default se não for um tipo conhecido
  }

  // 2. Se não há role no Firestore (roleFromFirestore é undefined ou string vazia), tente inferir do email.
  const lowerEmail = email.toLowerCase();
  if (lowerEmail === 'admin@praiativa.com' || lowerEmail.includes('admin')) return 'admin';
  if (lowerEmail.includes('instrutor')) return 'instructor';
  if (lowerEmail.includes('empreendedor')) return 'entrepreneur';
  
    return 'student';
}

async function syncAuthToFirestore() {
  let nextPageToken: string | undefined = undefined;
  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of listUsersResult.users) {
      const { uid, email, displayName, phoneNumber, photoURL } = userRecord;
      if (!email) continue;
      const userDocRef = db.collection('users').doc(uid);
      const userDoc = await userDocRef.get();
      let action = '';
      if (!userDoc.exists) {
        // Criar novo documento
        const role = normalizeRole(undefined, email);
        await userDocRef.set({
          email,
          name: displayName || email.split('@')[0] || 'Usuário', // Melhor fallback para nome
          phone: phoneNumber || '',
          photoURL: photoURL || '',
          role: role,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(), // Adicionar updatedAt também na criação
        });
        action = 'created';
        totalCreated++;
      } else {
        // Corrigir role se necessário
        const data = userDoc.data() || {};
        const normalizedRole = normalizeRole(data.role, email);
        if (data.role !== normalizedRole) {
          await userDocRef.update({ role: normalizedRole, updatedAt: FieldValue.serverTimestamp() });
          action = 'updated';
          totalUpdated++;
        }
      }
      totalProcessed++;
      if (action) {
        console.log(`User ${email} (${uid}) ${action}.`);
      }
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  console.log(`\nSync finished. Processed: ${totalProcessed}, Created: ${totalCreated}, Updated: ${totalUpdated}`);
}

syncAuthToFirestore().catch((err) => {
  console.error('Erro ao sincronizar usuários:', err);
  process.exit(1);
});
