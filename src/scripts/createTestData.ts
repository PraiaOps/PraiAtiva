import { db } from '@/config/firebase'; // Alterado para usar a instância principal do app
import { 
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { User, Activity, Enrollment } from '../types';

// Create test instructor
const createTestInstructor = async (): Promise<User> => {
  const now = new Date();
  const instructor: User = {
    uid: 'test-instructor-1',
    id: 'test-instructor-1',
    name: 'João Silva',
    email: 'joao.instrutor@test.com',
    phone: '+5521999999999',
    role: 'instructor',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'users', instructor.uid), {
    ...instructor,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return instructor;
};

// Create test students
const createTestStudents = async (count: number): Promise<User[]> => {
  const students: User[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const student: User = {
      uid: `test-student-${i}`,
      id: `test-student-${i}`,
      name: `Aluno Teste ${i}`,
      email: `aluno.teste${i}@test.com`,
      phone: `+552199999${i.toString().padStart(4, '0')}`,
      role: 'student',
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'users', student.uid), {
      ...student,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    students.push(student);
  }

  return students;
};

// Create test activities
const createTestActivities = async (instructorId: string): Promise<Activity[]> => {
  const now = new Date();
  const activities: Activity[] = [
    {
      id: 'test-activity-1',
      name: 'Beach Tennis - Iniciantes',
      type: 'sports',
      description: 'Aula de beach tennis para iniciantes',
      beach: 'copacabana',
      entrepreneur: instructorId,
      location: {
        meetingPoint: 'Praia de Copacabana, Posto 4',
        latitude: -22.9867,
        longitude: -43.1875,
      },
      schedule: [
        {
          id: 'schedule-1',
          activityId: 'test-activity-1',
          date: new Date('2025-05-22'),
          startTime: '09:00',
          endTime: '10:00',
          recurrence: 'none',
          availableSpots: 10,
          bookedSpots: 0,
          socialQuotaSpots: 1,
        },
      ],
      price: {
        value: 50.00,
        currency: 'BRL',
        paymentOptions: ['pix'],
      },
      photos: ['/images/placeholder-beach-tennis.jpg'],
      capacity: {
        min: 1,
        max: 10,
        available: 10,
        socialQuota: 1,
      },
      requirements: ['Trazer protetor solar', 'Trazer água'],
      equipments: {
        provided: ['Raquetes', 'Bolas'],
        required: ['Roupa esportiva'],
      },
      tags: ['beach tennis', 'esporte', 'iniciantes'],
      rating: 5,
      reviews: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const activity of activities) {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      'schedule.0.date': new Date('2025-05-22')
    });
    activity.id = docRef.id;
  }

  return activities;
};

// Create test enrollments
const createTestEnrollments = async (
  students: User[],
  instructor: User,
  activities: Activity[],
): Promise<void> => {
  const now = new Date();
  
  // Create different enrollment scenarios for testing
  const enrollmentScenarios: Partial<Enrollment>[] = [
    {
      status: 'confirmed',
      paymentInfo: {
        amount: 50.00,
        commission: 7.50, // 15%
        instructorAmount: 42.50, // 85%
        paymentMethod: 'pix',
        paymentStatus: 'paid',
        paymentDate: now,
      },
    },
    {
      status: 'pending',
      paymentInfo: {
        amount: 50.00,
        commission: 7.50,
        instructorAmount: 42.50,
        paymentMethod: 'pix',
        paymentStatus: 'pending',
        paymentDate: now,
      },
    },
    {
      status: 'completed',
      paymentInfo: {
        amount: 50.00,
        commission: 7.50,
        instructorAmount: 42.50,
        paymentMethod: 'pix',
        paymentStatus: 'paid',
        paymentDate: now,
      },
      attendance: [{
        present: true,
        date: now,
        notes: 'Ótima participação'
      }],
    },
  ];

  // Create an enrollment for each scenario with different students
  for (let i = 0; i < Math.min(students.length, enrollmentScenarios.length); i++) {
    const student = students[i];
    const activity = activities[0]; // Use the first activity for all enrollments
    const scenario = enrollmentScenarios[i];    const enrollment: Enrollment = {
      id: `test-enrollment-${i + 1}`,
      studentId: student.id,
      instructorId: instructor.id,
      activityId: activity.id,
      created: now,
      updated: now,
      status: scenario.status as any,
      paymentInfo: scenario.paymentInfo!,
      attendance: scenario.attendance || [],
      studentDetails: {
        name: student.name,
        email: student.email,
        phone: student.phone || undefined,
        ...(student.photoURL && { photo: student.photoURL }),
      },
      activityDetails: {
        name: activity.name,
        type: activity.type,
        location: activity.location.meetingPoint,
        schedule: {
          date: activity.schedule[0].date,
          startTime: activity.schedule[0].startTime,
          endTime: activity.schedule[0].endTime,
        },
      },
    };

    await addDoc(collection(db, 'enrollments'), {
      ...enrollment,
      created: serverTimestamp(),
      updated: serverTimestamp(),
    });
  }
};

// Script principal para criar os dados de teste
export const createTestData = async () => {
  try {
    console.log('🏗️ Criando dados de teste...');

    // Criar instrutor teste
    console.log('👨‍🏫 Criando instrutor teste...');
    const instructor = await createTestInstructor();
    console.log('✅ Instrutor teste criado:', instructor.name);

    // Criar alunos teste
    console.log('👥 Criando 10 alunos teste...');
    const students = await createTestStudents(10);
    console.log('✅ Alunos teste criados:', students.length);

    // Criar atividades teste
    console.log('🎾 Criando atividades teste...');
    const activities = await createTestActivities(instructor.uid);
    console.log('✅ Atividades teste criadas:', activities.length);

    // Criar matrículas teste
    console.log('📝 Criando matrículas teste...');
    await createTestEnrollments(students, instructor, activities);
    console.log('✅ Matrículas teste criadas');

    console.log('✨ Dados de teste criados com sucesso!');
    return {
      instructor,
      students,
      activities,
    };
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
    throw error;
  }
};
