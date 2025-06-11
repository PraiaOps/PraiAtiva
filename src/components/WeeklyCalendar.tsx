'use client';

import { Activity } from '@/types';
import { useMemo } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import CapacityBar from './CapacityBar';

interface WeeklyCalendarProps {
  activities: Activity[];
  selectedLocal: string;
  selectedWeekDay: string;
  selectedType: string;
  selectedCity: string;
  selectedBeach: string;
  priceRange: [number, number];
}

export default function WeeklyCalendar({
  activities,
  selectedLocal,
  selectedWeekDay,
  selectedType,
  selectedCity,
  selectedBeach,
  priceRange,
}: WeeklyCalendarProps) {
  // Define days of the week
  const weekDays = [
    { id: 'domingo', name: 'Domingo' },
    { id: 'segunda', name: 'Segunda' },
    { id: 'terca', name: 'Terça' },
    { id: 'quarta', name: 'Quarta' },
    { id: 'quinta', name: 'Quinta' },
    { id: 'sexta', name: 'Sexta' },
    { id: 'sabado', name: 'Sábado' },
  ];

  // Group activities by day and time
  const calendarData = useMemo(() => {
    const filteredActivities = activities.filter(activity => {
      const matchesCity =
        selectedCity === 'all' || activity.city === selectedCity;
      const matchesBeach =
        selectedBeach === 'all' || activity.beach === selectedBeach;
      const matchesType =
        selectedType === 'all' || activity.type === selectedType;
      const matchesPrice =
        activity.price >= priceRange[0] && activity.price <= priceRange[1];

      return matchesCity && matchesBeach && matchesType && matchesPrice;
    });

    const schedule: Record<
      string,
      Array<{
        activity: Activity;
        horario: Required<{
          periodo: string;
          horario: string;
          local: string;
          alunosMatriculados: number;
          limiteAlunos: number;
          diaSemana: string;
        }>;
      }>
    > = {};

    // Initialize schedule with empty arrays for each day
    weekDays.forEach(day => {
      schedule[day.id] = [];
    });

    filteredActivities.forEach(activity => {
      if (Array.isArray(activity.horarios)) {
        activity.horarios.forEach(horario => {
          if (!horario.diaSemana) return;

          if (
            weekDays.some(day => day.id === horario.diaSemana) &&
            (selectedLocal === 'all' ||
              horario.local === selectedLocal ||
              (selectedLocal === 'areia' &&
                ['areia', 'calcadão'].includes(horario.local)))
          ) {
            const validHorario = {
              ...horario,
              diaSemana: horario.diaSemana,
              periodo: horario.periodo || '',
              horario: horario.horario || '',
              local: horario.local || '',
              alunosMatriculados: horario.alunosMatriculados || 0,
              limiteAlunos: horario.limiteAlunos || 0,
            };

            schedule[validHorario.diaSemana].push({
              activity,
              horario: validHorario,
            });
          }
        });
      }
    });

    return schedule;
  }, [
    activities,
    selectedLocal,
    selectedCity,
    selectedBeach,
    selectedType,
    priceRange,
    weekDays,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      {weekDays.map(day => (
        <div
          key={day.id}
          className={`p-3 rounded-lg border ${
            selectedWeekDay === day.id
              ? 'border-sky-300 bg-sky-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            {day.name}
          </h4>
          <div className="space-y-2">
            {calendarData[day.id]?.map((slot, idx) => (
              <Link
                key={`${slot.activity.id}-${idx}`}
                href={`/atividades/${slot.activity.id}`}
                className="block bg-white p-2 rounded border border-gray-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-900 font-medium mb-1 flex items-center gap-1">
                      {slot.activity.name}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-600">
                        {slot.horario.horario}
                      </span>
                      <span className="text-[11px] text-gray-600 capitalize">
                        {slot.horario.local}
                      </span>
                    </div>
                  </div>
                  <CapacityBar
                    filled={slot.horario.alunosMatriculados}
                    total={slot.horario.limiteAlunos}
                    className="flex-shrink-0"
                  />
                </div>
              </Link>
            ))}
            {(!calendarData[day.id] || calendarData[day.id].length === 0) && (
              <div className="text-center py-2 text-xs text-gray-500">
                Nenhuma atividade
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
