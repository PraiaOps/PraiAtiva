'use client';

import { useState, Fragment } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { Activity } from '@/types';
import { activityService } from '@/services/activityService';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import React, { useEffect } from 'react';
import CapacityBar from '@/components/CapacityBar';


const activityTypes = [
  { id: 'all', name: 'Todos' },
  { id: 'sports', name: 'Esportes' },
  { id: 'leisure', name: 'Lazer' },
  { id: 'tourism', name: 'Turismo' },
  { id: 'wellness', name: 'Bem-estar' },
  { id: 'education', name: 'Educação' },
];

const cityOptions = [
  { id: 'all', name: 'Mostrar todas' },
  { id: 'Niterói', name: 'Niterói' },
  { id: 'Rio de Janeiro', name: 'Rio de Janeiro' },
  { id: 'Cabo Frio', name: 'Cabo Frio' },
  { id: 'São Sebastião', name: 'São Sebastião' },
  { id: 'Cruz', name: 'Cruz' },
  { id: 'Florianópolis', name: 'Florianópolis' },
];

const localOptions = [
  { id: 'all', name: 'Todos os Locais' },
  { id: 'mar', name: 'No mar' },
  { id: 'areia', name: 'Na areia/calçadão' },
];

const weekDays = [
  { id: 'all', name: 'Todos os Dias' },
  { id: 'domingo', name: 'Domingo' },
  { id: 'segunda', name: 'Segunda' },
  { id: 'terca', name: 'Terça' },
  { id: 'quarta', name: 'Quarta' },
  { id: 'quinta', name: 'Quinta' },
  { id: 'sexta', name: 'Sexta' },
  { id: 'sabado', name: 'Sábado' },
];

// Relação de praias por cidade
const praiasPorCidade: Record<string, string[]> = {
  'Niterói': [
    'Praia de Icaraí',
    'Praia das Flechas',
    'Praia de Piratininga',
    'Praia de Itaipu',
    'Praia de Itacoatiara',
    'Praia de Camboinhas',
    'Praia de Jurujuba',
  ],
  'Rio de Janeiro': [
    'Praia de Copacabana',
    'Praia de Ipanema',
    'Praia do Leblon',
    'Praia do Recreio',
    'Praia da Barra',
    'Praia do Leme',
  ],
  'Cabo Frio': [
    'Praia do Forte',
    'Praia das Conchas',
    'Praia do Peró',
    'Praia das Dunas',
  ],
  'São Sebastião': [
    'Praia de Juquehy',
    'Praia de Maresias',
    'Praia de Camburi',
  ],
  'Cruz': [
    'Praia do Preá',
    'Praia de Jericoacoara',
  ],
  'Florianópolis': [
    'Praia da Armação',
    'Praia Mole',
    'Praia dos Ingleses',
    'Praia do Campeche',
  ],
};

export default function AtividadesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedLocal, setSelectedLocal] = useState('all');
  const [selectedWeekDay, setSelectedWeekDay] = useState('all');
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  // Novo: animação de painel de filtros
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState('all');

  // Novo estado para atividades reais e loading
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Efeito para carregar atividades do serviço
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const data = await activityService.listActivities();
        setActivities(data);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        setFetchError('Erro ao carregar atividades. Tente novamente mais tarde.');
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, []); // Executa apenas uma vez ao montar

  // Filtrar atividades
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.beach.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesPrice =
      activity.price >= priceRange[0] && activity.price <= priceRange[1];
    const matchesCity = selectedCity === 'all' || activity.city === selectedCity;
    const matchesBeach = selectedBeach === 'all' || activity.beach === selectedBeach;
    // Corrigido: filtro de local verifica os horários
    const matchesLocal =
      selectedLocal === 'all' ||
      activity.horarios.some((h) => {
        if (selectedLocal === 'areia') {
          return h.local === 'areia' || h.local === 'calcadão';
        }
        return h.local === selectedLocal;
      });
    // Filtro de dia da semana: se não for 'all', pelo menos um horário deve bater com o dia (corrigido para usar o estado 'activities')
    const matchesWeekDay =
      selectedWeekDay === 'all' ||
      activity.horarios.some((h: any) => h.diaSemana === selectedWeekDay);
    return (
      matchesSearch && matchesType && matchesPrice && matchesCity && matchesBeach && matchesLocal && matchesWeekDay
    );
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  // Calendário semanal visual
  function WeeklyCalendar({ activities, selectedLocal, selectedWeekDay, selectedType, selectedCity, selectedBeach, priceRange }: any) {
    // Filtra horários conforme filtros ativos
    const dias = [
      { id: 'segunda', name: 'Segunda' },
      { id: 'terca', name: 'Terça' },
      { id: 'quarta', name: 'Quarta' },
      { id: 'quinta', name: 'Quinta' },
      { id: 'sexta', name: 'Sexta' },
      { id: 'sabado', name: 'Sábado' },
      { id: 'domingo', name: 'Domingo' },
    ];
    // Organiza horários por dia
    const horariosPorDia: Record<string, any[]> = {};
 dias.forEach((d) => (horariosPorDia[d.id] = []));
    activities.forEach((activity: any) => {
      activity.horarios.forEach((h: any) => {
        // Filtros de local, dia, tipo, cidade, praia, preço
        if (
          (selectedLocal === 'all' || (selectedLocal === 'areia' ? (h.local === 'areia' || h.local === 'calcadão') : h.local === selectedLocal)) &&
          (selectedWeekDay === 'all' || h.diaSemana === selectedWeekDay) &&
          (selectedType === 'all' || activity.type === selectedType) &&
          (selectedCity === 'all' || activity.city === selectedCity) &&
          (selectedBeach === 'all' || activity.beach === selectedBeach) &&
          (activity.price >= priceRange[0] && activity.price <= priceRange[1])
        ) {
          horariosPorDia[h.diaSemana]?.push({ ...h, activity });
        }
      });
    });
    return (
      <div className="overflow-x-auto">
        <div className="flex flex-col gap-2 min-w-[600px]">
          {dias.map((dia) => (
            <div key={dia.id} className="flex items-center bg-sky-50 rounded-lg shadow-sm px-2 py-2 min-h-[56px] w-full max-w-full border border-sky-100">
              <div className="w-20 md:w-28 flex-shrink-0 text-center font-semibold text-sky-700 text-xs md:text-sm">
                {dia.name}
              </div>
              <div className="flex flex-1 flex-wrap gap-2 items-center overflow-x-auto pl-2">
                {horariosPorDia[dia.id].length === 0 ? (
                  <span className="text-gray-400 text-xs text-center">Sem aulas</span>
                ) : (
                  horariosPorDia[dia.id].map((h, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white rounded px-3 py-2 border border-gray-100 shadow min-w-[240px] max-w-full animate-fade-in">
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-primary-700 text-xs truncate" title={h.activity.name}>{h.activity.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-primary-700 text-xs whitespace-nowrap">{h.periodo}</span>
                          <span className="text-[11px] text-gray-500 whitespace-nowrap">{h.horario}</span>
                        </div>
                      </div>
                      <div className="pl-2 flex items-center">
                        <CapacityBar filled={h.alunosMatriculados} total={h.limiteAlunos} className="flex-shrink-0" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header com barra de busca */}
        <div className="page-header">
          <div className="page-header-content container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Descubra Atividades nas Praias
            </h1>
            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Busque por atividades, praias ou cidades..."
                className="w-full py-3 px-12 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 focus:outline-none"
                onClick={() => setFiltersOpen(true)}
                aria-label="Abrir filtros"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Painel de Filtros (Bottom Sheet para mobile, lateral para desktop) */}
        {filtersOpen && (
          <>
            {/* Backdrop escuro com fade */}
            <div
              className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
              onClick={() => setFiltersOpen(false)}
              aria-label="Fechar filtros"
            />
            {/* Painel de filtros animado */}
            <div
              className="fixed z-50 bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:right-0 md:w-96 md:left-auto bg-white rounded-t-2xl md:rounded-l-2xl shadow-2xl p-4 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in transition-transform duration-300"
              style={{
                transform: filtersOpen
                  ? 'translateY(0)'
                  : 'translateY(100%)',
              }}
            >
              {/* Conteúdo do painel de filtros */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                <button onClick={() => setFiltersOpen(false)} className="text-gray-500 hover:text-primary-600 text-xl font-bold px-2 py-1 rounded-full focus:outline-none">×</button>
              </div>
              <div className="grid grid-cols-1 gap-4 flex-1">
                {/* Cidade + Praia */}
                <div>
                  <h3 className="text-xs md:text-sm font-semibold mb-2 text-gray-800">Cidade</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {cityOptions.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city.id);
                          setSelectedBeach('all'); // Resetar praia ao trocar cidade
                        }}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 focus:outline-none ${selectedCity === city.id ? 'bg-sky-600 text-white border-sky-600 shadow' : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-sky-50'}`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                  {/* Dropdown de praias se cidade selecionada não for 'all' */}
                  {selectedCity !== 'all' && praiasPorCidade[selectedCity] && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Praia</label>
                      <select
                        value={selectedBeach}
                        onChange={e => setSelectedBeach(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                      >
                        <option value="all">Todas as praias de {selectedCity}</option>
                        {praiasPorCidade[selectedCity].map((praia) => (
                          <option key={praia} value={praia}>{praia}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {/* Tipo de Atividade */}
                <div>
                  <h3 className="text-xs md:text-sm font-semibold mb-2 text-gray-800">Tipo de Atividade</h3>
                  <div className="flex flex-wrap gap-2">
                    {activityTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 focus:outline-none ${selectedType === type.id ? 'bg-sky-600 text-white border-sky-600 shadow' : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-sky-50'}`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Local (No mar / Na areia/calçadão) */}
                <div>
                  <h3 className="text-xs md:text-sm font-semibold mb-2 text-gray-800">Categorias</h3>
                  <div className="flex flex-wrap gap-2">
                    {localOptions.map((local) => (
                      <button
                        key={local.id}
                        onClick={() => setSelectedLocal(local.id)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 focus:outline-none ${selectedLocal === local.id ? 'bg-sky-600 text-white border-sky-600 shadow' : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-sky-50'}`}
                      >
                        {local.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Dia da Semana */}
                <div>
                  <h3 className="text-xs md:text-sm font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    Dia da Semana
                    <button
                      className="ml-2 px-2 py-1 rounded bg-sky-100 text-sky-700 text-xs font-medium hover:bg-sky-200 transition"
                      onClick={() => setShowCalendar((v) => !v)}
                      type="button"
                    >
                      {showCalendar ? 'Fechar calendário' : 'Abrir calendário'}
                    </button>
                  </h3>
                  {/* Lista de dias da semana (mobile first) */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedWeekDay(day.id)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 focus:outline-none ${selectedWeekDay === day.id ? 'bg-sky-600 text-white border-sky-600 shadow' : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-sky-50'}`}
                      >
                        {day.name}
                      </button>
                    ))}
                  </div>
                  {/* Calendário dinâmico (simples, mostra horários filtrados por dia) */}
                {showCalendar && !loadingActivities && !fetchError && (
                    <div className="bg-gray-50 border rounded-lg p-3 mt-2 animate-fade-in">
                      <h4 className="font-semibold text-sm mb-2 text-sky-700">Calendário semanal de horários (filtrado pelas opções acima)</h4>
 <WeeklyCalendar
                        activities={activities}
                        selectedLocal={selectedLocal}
                        selectedWeekDay={selectedWeekDay}
                        selectedType={selectedType}
                        selectedCity={selectedCity}
                        selectedBeach={selectedBeach}
                        priceRange={priceRange}
                      />
                    </div>
                  )}
                </div>
                {/* Faixa de Preço */}
                <div>
                  <h3 className="text-xs md:text-sm font-semibold mb-2 text-gray-800">Faixa de Preço (R$)</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      min={0}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-20 py-1 px-2 border border-gray-300 rounded-md text-xs text-gray-900 bg-white"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      min={0}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-20 py-1 px-2 border border-gray-300 rounded-md text-xs text-gray-900 bg-white"
                      placeholder="Max"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full accent-sky-600"
                    />
                    <span className="text-xs text-gray-900 font-semibold min-w-[32px] text-center">{priceRange[0]}</span>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full accent-sky-600"
                    />
                    <span className="text-xs text-gray-900 font-semibold min-w-[32px] text-center">{priceRange[1]}</span>
                  </div>
                </div>
              </div>
              {/* Ações */}
              <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100 bg-white sticky bottom-0 left-0 right-0 z-20 pb-6 justify-center px-4">
                <button className="w-1/2 max-w-xs btn-primary py-3 rounded-lg" onClick={() => setFiltersOpen(false)}>Aplicar Filtros</button>
                <button
                  className="w-1/2 max-w-xs btn-outline py-3 rounded-lg"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedCity('all');
                    setSelectedLocal('all');
                    setSelectedWeekDay('all');
                    setPriceRange([0, 500]);
                    setSelectedBeach('all');
                  }}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Resultados */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {filteredActivities.length} atividades encontradas
            </h2>

            {/* Loading state */}
            {loadingActivities && (
               <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando atividades...</p>
               </div>
            )}

            {/* Error state */}
            {!loadingActivities && fetchError && (
               <div className="text-center py-12 text-red-600">
                  <p>{fetchError}</p>
                  <button
                     onClick={() => { /* Implement retry logic */ }}
                     className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                  >
                     Tentar novamente
                  </button>
               </div>
            )}
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => ( // Removido o div que envolvia o Link
                  <Link
                    key={activity.id}
                    href={`/atividades/${activity.id}`}
                    className="activity-card group bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-sky-100 overflow-hidden flex flex-col animate-fade-in"
                  >
                    {/* Conteúdo do Card (mantido igual, mas agora dentro do Link) */}
                    <>
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                        {activity.image ? (
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={e => (e.currentTarget.src = '/images/surf.jpg')}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Imagem não disponível</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 text-sky-700 font-bold px-3 py-1 rounded-full text-xs shadow">
                          R$ {activity.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-base md:text-lg font-semibold mb-1 hover:text-primary-600 transition-colors truncate" title={activity.name}>
                          {activity.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2 gap-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs md:text-sm truncate">{activity.beach}, {activity.city}</span>
                        </div>
                        {activity.horarios && (
                          <div className="mb-2">
                            <span className="font-medium text-xs text-primary-700">Horários:</span>
                            <ul className="text-xs text-gray-700 ml-2 space-y-1">
                              {activity.horarios.map((h, idx) => (
                                <li key={idx} className="flex items-center justify-between gap-2 bg-sky-50 rounded px-2 py-1 border border-sky-100 shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-primary-700 text-xs leading-tight">{h.periodo}</span>
                                    <span className="text-[11px] text-gray-500 leading-tight">{h.horario}</span>
                                  </div>
                                  <CapacityBar filled={h.alunosMatriculados} total={h.limiteAlunos} className="ml-2 flex-shrink-0" />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">{activity.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-1" />
                            <span className="font-medium text-xs md:text-base">{activity.rating}</span>
                            <span className="text-gray-600 text-xs md:text-sm ml-1">({activity.reviews} avaliações)</span>
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">{activity.entrepreneur}</div>
                        </div>
                        <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
                          {activity.tags && activity.tags.map((tag: string, index: number) => (
                            <span key={index} className="badge text-xs md:text-sm bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  </Link> // Fim do Link
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade encontrada</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Tente ajustar seus filtros ou buscar por outros termos para encontrar atividades nas praias.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
