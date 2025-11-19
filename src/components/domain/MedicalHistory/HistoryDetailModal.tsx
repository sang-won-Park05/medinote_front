// src/components/domain/MedicalHistory/HistoryDetailModal.tsx

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { toast } from 'react-toastify';

export type HistoryRecord = {
  id: string;
  title: string;
  date: string;
  hospital: string;
  doctor: string;
  symptoms: string;
  notes: string;
  meds: string[];
};

type Props = {
  record: HistoryRecord;
  onClose: () => void;
  onUpdate: (updated: HistoryRecord) => void;
  onDelete: (id: string) => void;
  onAddPrescription: () => void;
};

export default function HistoryDetailModal({ record, onClose, onUpdate, onDelete, onAddPrescription }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<HistoryRecord>({ ...record });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(form);
    toast.success('수정되었습니다');
    setEditing(false);
    onClose();
  };

  const onRemove = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(record.id);
      toast.success('삭제되었습니다.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-popup p-6 z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-dark-gray">진료기록 상세</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark-gray text-2xl">
            <HiOutlineX />
          </button>
        </div>

        {!editing ? (
          <div className="space-y-3">
            <div>
              <div className="text-lg font-bold text-dark-gray">{record.title}</div>
              <div className="text-sm text-gray-500">{record.date}</div>
            </div>
            <Item label="병원" value={record.hospital} />
            <Item label="담당의" value= {record.doctor} />
            <Item label="증상" value={record.symptoms} />
            <Item label="담당의 소견" value={record.notes} />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">처방약</span>
                <p className="text-xs text-gray-400 mt-2">약정보 탭에서 수정할 수 있어요</p>
                <button
                  onClick={onAddPrescription}
                  className="text-xs px-2 py-1 rounded border border-mint text-mint bg-mint/10 hover:bg-mint/20"
                >
                  처방약 추가
                </button>
              </div>
              {record.meds.length > 0 ? (
                <div className="flex gap-2 mt-2">
                  {record.meds.map((m) => (
                    <span key={m} className="text-sm font-semibold px-3 py-1 rounded-full bg-prescription/10 text-prescription">{m}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">처방약이 없습니다.</p>
              )}
            </div>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={onSave}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">진단명</label>
              <input name="title" value={form.title} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div className="col-span-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">진료일</label>
                <input type="date" name="date" value={form.date} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">병원</label>
                <input name="hospital" value={form.hospital} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">담당의</label>
                <input name="doctor" value={form.doctor} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">증상</label>
              <textarea name="symptoms" value={form.symptoms} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">담당의 소견</label>
              <textarea name="notes" value={form.notes} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" rows={3} />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 py-3 border rounded-lg hover:bg-gray-100 text-gray-700">취소</button>
              <button type="submit" className="flex-1 bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">저장</button>
            </div>
          </form>
        )}

        {!editing && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={() => setEditing(true)} className="w-full bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">수정</button>
            <button onClick={onRemove} className="w-full border border-red-300 text-red-500 hover:bg-red-50 font-bold py-3 px-4 rounded-lg">삭제</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-bold text-gray-700">{label}</span>
      <p className="text-md text-dark-gray mt-1">{value || '(입력된 정보 없음)'}</p>
    </div>
  );
}
