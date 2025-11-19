// src/store/useHealthDataStore.ts

import { create } from 'zustand';

// 기본정보 타입
interface BasicInfoForm {
  birth: string;
  gender: '남성' | '여성';
  height: string;
  weight: string;
  bloodType: string;
  smoke: string;
  drink: string;
}

// 질환정보 타입
export interface Disease {
  id: string;
  name: string;
  type: 'chronic' | 'simple';
  meds: string;
}

// 약 정보 타입
export interface Medication {
  id: string;
  name: string;
  type: 'prescription' | 'supplement';
  dosageForm: '캡슐' | '정제' | '액상';
  dose: string;
  unit: string;
  schedule: string; // 다중 선택 가능
  startDate: string;
  endDate: string;
}

// 알러지 타입
export interface Allergy {
  id: string;
  name: string;
}

// 전체 건강 데이터 스토어 타입
interface HealthDataState {
  basicInfo: BasicInfoForm;
  diseases: Disease[];
  medications: Medication[];
  allergies: Allergy[];
  currentDate: string; // 날짜 연동용

  // Actions
  updateBasicInfo: (newInfo: BasicInfoForm) => void;
  addDisease: (disease: Omit<Disease, 'id'>) => void;
  updateDisease: (id: string, patch: Partial<Omit<Disease, 'id'>>) => void;
  deleteDisease: (id: string) => void;

  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, patch: Partial<Omit<Medication, 'id'>>) => void;
  deleteMedication: (id: string) => void;

  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  updateAllergy: (id: string, patch: Partial<Omit<Allergy, 'id'>>) => void;
  deleteAllergy: (id: string) => void;

  updateCurrentDate: (date: string) => void;
}

const today = () => new Date().toISOString().split('T')[0];

const useHealthDataStore = create<HealthDataState>((set) => ({
  basicInfo: {
    birth: '1990-03-15', gender: '여성', height: '170', weight: '60',
    bloodType: 'A+', smoke: '비흡연자', drink: '거의 안마심',
  },

  diseases: [
    { id: 'd1', name: '고혈압', type: 'chronic', meds: '아모디핀' },
    { id: 'd2', name: '당뇨병 2형', type: 'chronic', meds: '메트포르민' },
    { id: 'd3', name: '감기', type: 'simple', meds: '' },
  ],

  medications: [
    {
      id: 'm1', name: '아모디핀', type: 'prescription', dosageForm: '정제',
      dose: '5', unit: 'mg', schedule: '아침, 저녁', startDate: today(), endDate: today(),
    },
  ],

  allergies: [
    { id: 'a1', name: '피넛' },
  ],

  currentDate: today(),

  // Actions
  updateBasicInfo: (newInfo) => set({ basicInfo: newInfo }),

  addDisease: (disease) => set((state) => ({ diseases: [...state.diseases, { id: `d_${Date.now()}`, ...disease }] })),
  updateDisease: (id, patch) => set((state) => ({ diseases: state.diseases.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
  deleteDisease: (id) => set((state) => ({ diseases: state.diseases.filter((d) => d.id !== id) })),

  addMedication: (med) => set((state) => ({ medications: [...state.medications, { id: `m_${Date.now()}`, ...med }] })),
  updateMedication: (id, patch) => set((state) => ({ medications: state.medications.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  deleteMedication: (id) => set((state) => ({ medications: state.medications.filter((m) => m.id !== id) })),

  addAllergy: (allergy) => set((state) => ({ allergies: [...state.allergies, { id: `a_${Date.now()}`, ...allergy }] })),
  updateAllergy: (id, patch) => set((state) => ({ allergies: state.allergies.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
  deleteAllergy: (id) => set((state) => ({ allergies: state.allergies.filter((a) => a.id !== id) })),

  updateCurrentDate: (date) => set({ currentDate: date }),
}));

export default useHealthDataStore;

