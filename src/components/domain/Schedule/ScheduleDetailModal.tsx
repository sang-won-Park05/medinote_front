// src/components/domain/Schedule/ScheduleDetailModal.tsx

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import type { ScheduleItem, ScheduleType } from '../../../store/useScheduleStore';

type Props = {
  item: ScheduleItem;
  onClose: () => void;
  onUpdate: (id: string, patch: Omit<ScheduleItem, 'id'>) => void;
  onDelete: (id: string) => void;
};

export default function ScheduleDetailModal({ item, onClose, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<ScheduleItem, 'id'>>({
    title: item.title,
    type: item.type,
    date: item.date,
    time: item.time,
    location: item.location,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(item.id, { ...form, type: form.type as ScheduleType });
    setEditing(false);
    onClose();
  };

  const remove = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      onDelete(item.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-popup p-6 z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-dark-gray">일정 상세</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark-gray text-2xl">
            <HiOutlineX />
          </button>
        </div>

        {!editing ? (
          <div className="space-y-3">
            <DetailRow label="제목" value={item.title} />
            <DetailRow label="유형" value={item.type} />
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="날짜" value={item.date} />
              <DetailRow label="시간" value={item.time} />
            </div>
            {item.location && <DetailRow label="장소" value={item.location} />}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => setEditing(true)} className="bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">수정</button>
              <button onClick={remove} className="border border-red-300 text-red-500 hover:bg-red-50 font-bold py-3 px-4 rounded-lg">삭제</button>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
              <input name="title" value={form.title} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">유형</label>
              <select name="type" value={form.type} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white">
                <option value="진료">진료</option>
                <option value="검사">검사</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">날짜</label>
                <input name="date" type="date" value={form.date} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">시간</label>
                <input name="time" type="time" value={form.time} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">장소</label>
              <input name="location" value={form.location || ''} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button type="button" onClick={() => setEditing(false)} className="py-3 border rounded-lg hover:bg-gray-100 text-gray-700">취소</button>
              <button type="submit" className="bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">저장</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-bold text-gray-700">{label}</span>
      <p className="text-md text-dark-gray mt-1">{value}</p>
    </div>
  );
}

