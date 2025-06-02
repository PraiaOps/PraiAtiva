'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { activityService } from '@/services/activityService';

interface ActivityFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: 'sports' | 'leisure' | 'tourism' | 'wellness' | 'education' | 'cultura' | 'lazer';
    beach: string;
    city: string;
    price: number;
    image?: string;
    entrepreneur: string;
    description: string;
    tags: string[];
    horarios: {
      periodo: string;
      horario: string;
      local: string;
      limiteAlunos: number;
      alunosMatriculados: number;
      diaSemana?: string;
    }[];
  };
  mode: 'create' | 'edit';
}

export default function ActivityForm({ initialData, mode }: ActivityFormProps) {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'sports',
    beach: initialData?.beach || '',
    city: initialData?.city || '',
    price: initialData?.price || 0,
    image: initialData?.image || '',
    entrepreneur: initialData?.entrepreneur || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    horarios: initialData?.horarios || [{
      periodo: 'Manhã',
      horario: '09:00 às 10:00',
      local: 'areia',
      limiteAlunos: 10,
      alunosMatriculados: 0,
      diaSemana: 'segunda'
    }]
  });

  useEffect(() => {
    if (userData?.name) {
      setFormData(prev => ({
        ...prev,
        entrepreneur: userData.name
      }));
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Estado atual do userData:', userData);
      console.log('Estado atual do user:', user);

      if (authLoading) {
        throw new Error('Aguardando carregamento dos dados do usuário...');
      }

      if (!user || !userData) {
        throw new Error('Usuário não autenticado');
      }

      if (!userData.name) {
        console.error('userData sem nome:', userData);
        throw new Error('Nome do usuário não encontrado. Por favor, atualize seu perfil.');
      }

      const activityData = {
        ...formData,
        instructorId: user.uid,
        instructorName: userData.name,
        status: 'active',
        enrolledStudents: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      console.log('Dados da atividade a ser criada:', activityData);

      if (mode === 'create') {
        await activityService.createActivity(activityData);
        router.push('/dashboard/instrutor');
      } else if (mode === 'edit' && initialData?.id) {
        await activityService.updateActivity(initialData.id, activityData);
        router.push('/dashboard/instrutor');
      }
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao salvar a atividade. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome da Atividade
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        >
          <option value="sports">Esportes</option>
          <option value="leisure">Lazer</option>
          <option value="tourism">Turismo</option>
          <option value="wellness">Bem-estar</option>
          <option value="education">Educação</option>
          <option value="cultura">Cultura</option>
          <option value="lazer">Lazer</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="beach" className="block text-sm font-medium text-gray-700">
            Praia
          </label>
          <input
            type="text"
            id="beach"
            name="beach"
            value={formData.beach}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Preço
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          URL da Imagem (opcional)
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (separadas por vírgula)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            tags: e.target.value.split(',').map(tag => tag.trim())
          }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Horários
        </label>
        {Array.isArray(formData.horarios) && formData.horarios.map((horario, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Período
              </label>
              <select
                name={`horarios.${index}.periodo`}
                value={horario.periodo}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Horário
              </label>
              <input
                type="text"
                name={`horarios.${index}.horario`}
                value={horario.horario}
                onChange={handleChange}
                required
                placeholder="ex: 09:00 às 10:00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Local
              </label>
              <select
                name={`horarios.${index}.local`}
                value={horario.local}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              >
                <option value="areia">Areia</option>
                <option value="mar">Mar</option>
                <option value="calcadão">Calçadão</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Limite de Alunos
              </label>
              <input
                type="number"
                name={`horarios.${index}.limiteAlunos`}
                value={horario.limiteAlunos}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dia da Semana
              </label>
              <select
                name={`horarios.${index}.diaSemana`}
                value={horario.diaSemana}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              >
                <option value="segunda">Segunda</option>
                <option value="terça">Terça</option>
                <option value="quarta">Quarta</option>
                <option value="quinta">Quinta</option>
                <option value="sexta">Sexta</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            horarios: [...(Array.isArray(prev.horarios) ? prev.horarios : []), {
              periodo: 'Manhã',
              horario: '09:00 às 10:00',
              local: 'areia',
              limiteAlunos: 10,
              alunosMatriculados: 0,
              diaSemana: 'segunda'
            }]
          }))}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Horário
        </button>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar Atividade' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
} 