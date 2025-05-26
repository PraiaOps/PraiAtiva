// Script para sincronizar usuários do Firebase Auth com a coleção 'users' do Firestore
// Cria documentos para usuários que só existem no Auth, e corrige roles inconsistentes
// Execute com: npx ts-node src/scripts/syncAuthToFirestore.ts

import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
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
function normalizeRole(role: string | undefined, email: string): string {
  if (!role) {
    if (email === 'admin@praiativa.com' || email.includes('admin')) return 'admin';
    if (email.includes('instrutor')) return 'instructor';
    if (email.includes('empreendedor')) return 'entrepreneur';
    return 'student';
  }
  if (role === 'instrutor') return 'instructor';
  if (role === 'aluno') return 'student';
  return role;
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
          name: displayName || '',
          phone: phoneNumber || '',
          photoURL: photoURL || '',
          role,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
        action = 'created';
        totalCreated++;
      } else {
        // Corrigir role se necessário
        const data = userDoc.data() || {};
        const normalizedRole = normalizeRole(data.role, email);
        if (data.role !== normalizedRole) {
          await userDocRef.update({ role: normalizedRole });
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
