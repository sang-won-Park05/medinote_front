// src/store/useScheduleStore.ts

import { create } from 'zustand';
import { kstYmd } from '../utils/date';

export type ScheduleType = '진료' | '검사';

export type ScheduleItem = {
  id: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  type: ScheduleType;
  title: string;
  location?: string;
  memo?: string;  // 🔥 메모 필드
};

type ScheduleState = {
  schedules: ScheduleItem[];
  addSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  updateSchedule: (id: string, patch: Partial<Omit<ScheduleItem, 'id'>>) => void;
  deleteSchedule: (id: string) => void;
};

const today = () => kstYmd();

const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [
    {
      id: 's1',
      date: today(),
      time: '10:00',
      type: '검사',
      title: '내과 정기검진',
      location: '서울대병원',
      memo: '공복 혈액검사, 물은 조금만 마시기',
    },
    {
      id: 's2',
      date: today(),
      time: '14:30',
      type: '진료',
      title: '무릎 물리치료',
      location: '세브란스',
      memo: '최근 통증 변화 이야기하기',
    },
  ],

  addSchedule: (item) =>
    set((state) => ({
      schedules: [...state.schedules, { id: `s_${Date.now()}`, ...item }],
    })),

  updateSchedule: (id, patch) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    })),

  deleteSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
}));

export default useScheduleStore;
