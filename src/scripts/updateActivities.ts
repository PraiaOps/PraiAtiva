import { activityService } from '../services/activityService';

async function updateActivities() {
  try {
    console.log('Iniciando atualização das atividades...');
    await activityService.updateExistingActivities();
    console.log('Atualização concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar atividades:', error);
  }
}

updateActivities();
