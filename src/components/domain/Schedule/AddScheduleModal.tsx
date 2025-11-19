// src/components/domain/Schedule/AddScheduleModal.tsx

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import type { ScheduleItem, ScheduleType } from '../../../store/useScheduleStore';
import { kstYmd } from '../../../utils/date';

type ModalProps = {
  onClose: () => void;
  initial?: Partial<ScheduleItem> & { date?: string };
  onSave: (item: Omit<ScheduleItem, 'id'>) => void;
};

export default function AddScheduleModal({ onClose, initial, onSave }: ModalProps) {
  const localToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };
  const [form, setForm] = useState({
    title: initial?.title || '',
    type: (initial?.type as ScheduleType) || '진료',
    date: initial?.date || kstYmd(),
    time: initial?.time || '09:00',
    location: initial?.location || '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ type: form.type as ScheduleType, title: form.title.trim(), date: form.date, time: form.time, location: form.location });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-popup p-6 z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-dark-gray">일정 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark-gray text-2xl">
            <HiOutlineX />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">진료 또는 검진 일정을 등록하세요.</p>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
            <input name="title" type="text" placeholder="예: 내과 정기 검진" value={form.title} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">유형 <span className="text-red-500">*</span></label>
            <select name="type" value={form.type} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white">
              <option value="진료">진료</option>
              <option value="검사">검사</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">날짜 <span className="text-red-500">*</span></label>
              <input name="date" type="date" value={form.date} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">시간 <span className="text-red-500">*</span></label>
              <input name="time" type="time" value={form.time} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">장소</label>
            <input name="location" type="text" placeholder="예: 서울대학교병원" value={form.location} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
          </div>
          <button type="submit" className="w-full bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 mt-6">저장</button>
        </form>
      </div>
    </div>
  );
}
