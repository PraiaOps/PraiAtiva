// Tipos de Usuários
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role: 'practitioner' | 'entrepreneur' | 'admin';
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Tipo para Praticante (usuário que busca atividades)
export interface Practitioner extends User {
  role: 'practitioner';
  favorites: string[]; // IDs das atividades favoritas
  bookings: string[]; // IDs das reservas
  preferences: {
    activities: string[]; // Tipos de atividades preferidas
    beaches: string[]; // Praias preferidas
    availability: string[]; // Dias/horários disponíveis
  };
  reviews: Review[]; // Avaliações feitas pelo praticante
}

// Tipo para Empreendedor (oferece atividades)
export interface Entrepreneur extends User {
  role: 'entrepreneur';
  businessName: string;
  description: string;
  activities: string[]; // IDs das atividades que oferece
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  documents?: {
    cpfCnpj: string;
    license?: string; // Licença para atuar na praia
  };
  bankInfo?: {
    bank: string;
    accountType: string;
    accountNumber: string;
    agency: string;
  };
}

// Tipo para Praia
export interface Beach {
  id: string;
  name: string;
  city: string;
  state: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  photos: string[];
  amenities: string[]; // Facilidades disponíveis (banheiros, chuveiros, etc.)
  accessibility: string[]; // Recursos de acessibilidade
  activities: string[]; // IDs das atividades disponíveis nesta praia
  rating: number; // Avaliação média
  reviews: Review[]; // Avaliações da praia
}

// Tipo para Atividade
export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  description: string;
  beach: string; // ID da praia
  entrepreneur: string; // ID do empreendedor
  location: {
    meetingPoint: string;
    latitude?: number;
    longitude?: number;
  };
  schedule: Schedule[];
  price: {
    value: number;
    currency: string;
    paymentOptions: string[];
    discounts?: {
      description: string;
      value: number;
      type: 'percentage' | 'fixed';
    }[];
  };
  photos: string[];
  capacity: {
    min: number;
    max: number;
    available: number;
    socialQuota: number; // Vagas gratuitas (cota social)
  };
  requirements: string[]; // Requisitos para participação
  equipments: {
    provided: string[];
    required: string[];
  };
  tags: string[];
  rating: number;
  reviews: Review[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Tipo para Tipo de Atividade
export type ActivityType = 
  | 'sports' // Esportes
  | 'leisure' // Lazer
  | 'tourism' // Turismo
  | 'wellness' // Bem-estar
  | 'education' // Educação/Cursos
  | 'events' // Eventos
  | 'recreation' // Recreação
  | 'other'; // Outros

// Tipo para Agendamento
export interface Schedule {
  id: string;
  activityId: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  availableSpots: number;
  bookedSpots: number;
  socialQuotaSpots: number; // Vagas gratuitas disponíveis
}

// Tipo para Reserva
export interface Booking {
  id: string;
  activityId: string;
  scheduleId: string;
  practitionerId: string;
  entrepreneurId: string;
  date: Date | string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  participants: number;
  specialRequirements?: string;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  isSocialQuota: boolean; // Indica se é uma vaga da cota social
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Tipo para Avaliação
export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  targetType: 'activity' | 'beach' | 'entrepreneur';
  targetId: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  date: Date | string;
  helpful: number; // Quantidade de pessoas que acharam útil
}

// Tipo para Certificação ou Credencial
export interface Credential {
  id: string;
  entrepreneurId: string;
  name: string;
  issuedBy: string;
  issueDate: Date | string;
  expiryDate?: Date | string;
  documentUrl?: string;
  verified: boolean;
} 