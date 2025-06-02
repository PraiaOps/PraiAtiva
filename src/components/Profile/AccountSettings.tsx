import React from 'react';
import { auth, db } from '@/config/firebase'; // Sua config do Firebase client-side
import { deleteUser, signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/router'; // Ou sua solução de roteamento

const AccountSettings: React.FC = () => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      alert("Nenhum usuário logado para excluir.");
      return;
    }

    const confirmation = confirm(
      "Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita e todos os seus dados serão perdidos."
    );
    if (!confirmation) {
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const userEmail = auth.currentUser.email; // Para log

      // Etapa 1: Excluir o documento do usuário no Firestore
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      console.log(`Documento do Firestore para ${userEmail} (UID: ${userId}) excluído.`);

      // Etapa 2: Excluir o usuário do Firebase Authentication
      // Esta operação é sensível e pode exigir login recente.
      await deleteUser(auth.currentUser);
      console.log(`Usuário ${userEmail} do Firebase Auth excluído.`);
      
      alert("Sua conta foi excluída com sucesso. Você será desconectado.");
      // Forçar logout e redirecionar
      await signOut(auth);
      router.push('/'); // Redirecionar para a página inicial ou de login

    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert(
          "Esta operação é muito sensível e requer que você tenha feito login recentemente. Por favor, faça login novamente e tente excluir sua conta em seguida."
        );
        // Opcional: Deslogar e redirecionar para login para forçar reautenticação
        await signOut(auth);
        router.push('/login?action=reauthenticate&next=/perfil/configuracoes'); // Exemplo de redirecionamento
      } else {
        alert(
          "Ocorreu um erro ao tentar excluir sua conta. Por favor, tente novamente ou contate o suporte."
        );
      }
    }
  };

  return (
    <div>
      <h2>Configurações da Conta</h2>
      {/* Outras configurações de conta aqui */}
      <button 
        onClick={handleDeleteAccount} 
        style={{ backgroundColor: 'red', color: 'white', marginTop: '20px', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Excluir Minha Conta Permanentemente
      </button>
    </div>
  );
};

export default AccountSettings;