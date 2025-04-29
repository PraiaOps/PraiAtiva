'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/layout/Footer';

// Dados simulados para demonstração
const mockActivities = [
  {
    id: '1',
    name: 'Aula de Surf para Iniciantes',
    type: 'sports',
    beach: 'Praia de Copacabana',
    city: 'Rio de Janeiro',
    price: 80,
    rating: 4.7,
    reviews: 24,
    image: '/images/placeholder-surf.jpg',
    entrepreneur: 'Escola Carioca de Surf',
    description: 'Aulas de surf para iniciantes com equipamentos inclusos e instrutor experiente.',
    tags: ['Surf', 'Iniciante', 'Equipamentos inclusos'],
  },
  {
    id: '2',
    name: 'Vôlei de Praia - Turma Avançada',
    type: 'sports',
    beach: 'Praia de Ipanema',
    city: 'Rio de Janeiro',
    price: 60,
    rating: 4.5,
    reviews: 18,
    image: '/images/placeholder-volei.jpg',
    entrepreneur: 'Academia Carioca',
    description: 'Treino de vôlei de praia para jogadores de nível avançado. Quadras exclusivas.',
    tags: ['Vôlei', 'Avançado', 'Competitivo'],
  },
  {
    id: '3',
    name: 'Stand Up Paddle ao Pôr do Sol',
    type: 'leisure',
    beach: 'Praia do Forte',
    city: 'Cabo Frio',
    price: 120,
    rating: 4.9,
    reviews: 36,
    image: '/images/placeholder-sup.jpg',
    entrepreneur: 'Cabo SUP Experience',
    description: 'Passeio de Stand Up Paddle ao pôr do sol com instrutor e equipamentos. Inclui fotos.',
    tags: ['SUP', 'Pôr do sol', 'Fotos inclusas'],
  },
  {
    id: '4',
    name: 'Yoga na Praia - Despertar',
    type: 'wellness',
    beach: 'Praia de Juquehy',
    city: 'São Sebastião',
    price: 50,
    rating: 4.8,
    reviews: 42,
    image: '/images/placeholder-yoga.jpg',
    entrepreneur: 'Prana Yoga',
    description: 'Sessão de yoga matinal na praia. Ideal para começar o dia com energia e tranquilidade.',
    tags: ['Yoga', 'Amanhecer', 'Meditação'],
  },
  {
    id: '5',
    name: 'Curso de Kitesurf - Básico',
    type: 'sports',
    beach: 'Praia do Preá',
    city: 'Cruz',
    price: 200,
    rating: 4.6,
    reviews: 19,
    image: '/images/placeholder-kite.jpg',
    entrepreneur: 'Ventos do Preá',
    description: 'Curso básico de kitesurf com teoria e prática. Equipamentos de segurança inclusos.',
    tags: ['Kitesurf', 'Básico', 'Certificado'],
  },
  {
    id: '6',
    name: 'Passeio de Caiaque pelas Ilhas',
    type: 'tourism',
    beach: 'Praia da Armação',
    city: 'Florianópolis',
    price: 150,
    rating: 4.7,
    reviews: 28,
    image: '/images/placeholder-caiaque.jpg',
    entrepreneur: 'Floripa Aventuras',
    description: 'Passeio guiado de caiaque pelas ilhas próximas. Ideal para observação da vida marinha.',
    tags: ['Caiaque', 'Passeio guiado', 'Vida marinha'],
  },
];

const activityTypes = [
  { id: 'all', name: 'Todos' },
  { id: 'sports', name: 'Esportes' },
  { id: 'leisure', name: 'Lazer' },
  { id: 'tourism', name: 'Turismo' },
  { id: 'wellness', name: 'Bem-estar' },
  { id: 'education', name: 'Educação' },
];

export default function AtividadesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar atividades
  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.beach.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    
    const matchesPrice = 
      activity.price >= priceRange[0] && activity.price <= priceRange[1];
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header com classe page-header para não sobrepor o conteúdo */}
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                onClick={() => setShowFilters(!showFilters)}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filtros */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Tipo de Atividade</h3>
                  <div className="space-y-2">
                    {activityTypes.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="activityType"
                          checked={selectedType === type.id}
                          onChange={() => setSelectedType(type.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Faixa de Preço (R$)</h3>
                  <button 
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700 mb-3"
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                  >
                    {isPriceOpen ? 'Ocultar' : 'Mostrar'} controles
                  </button>
                  {isPriceOpen && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Min: R$ {priceRange[0]}</span>
                        <span>Max: R$ {priceRange[1]}</span>
                      </div>
                      <div className="flex space-x-4">
                        <input
                          type="range"
                          min={0}
                          max={500}
                          step={10}
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min={0}
                          max={500}
                          step={10}
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex mt-2">
                    <div className="flex-1 pr-2">
                      <input
                        type="number"
                        min={0}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full py-1 px-3 border border-gray-300 rounded-md text-sm"
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex-1 pl-2">
                      <input
                        type="number"
                        min={0}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full py-1 px-3 border border-gray-300 rounded-md text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Ações</h3>
                  <div className="space-y-2">
                    <button className="w-full btn-primary py-2">Aplicar Filtros</button>
                    <button 
                      className="w-full btn-outline py-2"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedType('all');
                        setPriceRange([0, 500]);
                      }}
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resultados */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {filteredActivities.length} atividades encontradas
            </h2>
            
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="card overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute h-full w-full bg-gray-800 bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button className="btn-primary">Ver Detalhes</button>
                      </div>
                      <div className="absolute top-0 right-0 bg-secondary-500 text-primary-900 font-medium px-3 py-1 rounded-bl-lg z-10">
                        R$ {activity.price.toFixed(2)}
                      </div>
                      <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">Imagem não disponível</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">
                        {activity.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {activity.beach}, {activity.city}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="font-medium">{activity.rating}</span>
                          <span className="text-gray-600 text-sm ml-1">
                            ({activity.reviews} avaliações)
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.entrepreneur}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activity.tags.map((tag, index) => (
                          <span key={index} className="badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
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