// Tipos de Usuários
export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  created: Date;
  updated: Date;
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
export type ActivityStatus = 'active' | 'inactive' | 'cancelled';

export interface Activity {
  id: string;
  instructorId: string;
  instructorName: string;
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
  status: ActivityStatus;
  enrolledStudents: number;
  createdAt: number;
  updatedAt: number;
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

// Tipo para Status de Matrícula
export type EnrollmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Tipo para Status de Pagamento
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// Tipo para Matrícula
export interface Enrollment {
  id: string;
  studentId: string;
  instructorId: string;
  activityId: string;
  studentName: string;
  instructorName: string;
  activityName: string;
  status: EnrollmentStatus;
  paymentInfo: {
    amount: number;
    commission: number;
    instructorAmount: number;
    paymentMethod: 'pix' | 'credit_card';
    paymentStatus: PaymentStatus;
    paymentDate: Date;
  };
  created: Date;
  updated: Date;
}

// Tipo para Transação Financeira
export interface Transaction {
  id: string;
  enrollmentId: string;
  type: 'payment' | 'refund';
  amount: number;
  commission: number;
  instructorAmount: number;
  status: 'pending' | 'completed' | 'failed';
  stripeTransactionId?: string;
  createdAt: Date | string;
  completedAt?: Date | string;
  metadata?: {
    [key: string]: any;
  };
}

// Tipo para Resumo Financeiro do Instrutor
export interface InstructorFinancialSummary {
  totalEarnings: number;
  pendingAmount: number;
  periodEarnings: {
    period: string;
    amount: number;
    enrollments: number;
  }[];
  commissionRate: number;
  nextPayout?: {
    amount: number;
    estimatedDate: Date | string;
  };
}

export interface Payment {
  id: string;
  studentId: string;
  instructorId: string;
  activityId: string;
  enrollmentId: string;
  studentName: string;
  instructorName: string;
  activityName: string;
  amount: number;
  status: PaymentStatus;
  created: Date;
  updated: Date;
}

export interface Rating {
  id: string;
  studentId: string;
  instructorId: string;
  activityId: string;
  studentName: string;
  instructorName: string;
  activityName: string;
  rating: number;
  comment?: string;
  created: Date;
  updated: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    created: Date;
  };
  created: Date;
  updated: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  text: string;
  read: boolean;
  created: Date;
  updated: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'enrollment' | 'activity' | 'payment' | 'system' | 'status' | 'message' | 'rating';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created: Date;
  updated: Date;
}
