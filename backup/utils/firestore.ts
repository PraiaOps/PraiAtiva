import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';

// Função genérica para buscar um documento pelo ID
export async function getDocument(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar ${collectionName}:`, error);
    throw error;
  }
}

// Função para buscar documentos com filtros
export async function getDocuments(
  collectionName: string, 
  constraints: QueryConstraint[] = [],
  limitCount: number = 100
) {
  try {
    const q = query(
      collection(db, collectionName),
      ...constraints,
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Erro ao buscar documentos em ${collectionName}:`, error);
    throw error;
  }
}

// Função para adicionar um novo documento
export async function addDocument(collectionName: string, data: any) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Erro ao adicionar documento em ${collectionName}:`, error);
    throw error;
  }
}

// Função para atualizar um documento
export async function updateDocument(collectionName: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar documento em ${collectionName}:`, error);
    throw error;
  }
}

// Função para excluir um documento
export async function deleteDocument(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir documento em ${collectionName}:`, error);
    throw error;
  }
} 