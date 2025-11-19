// src/components/domain/HealthInfo/MedDetailModal.tsx

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import useHealthDataStore, { type Medication } from '../../../store/useHealthDataStore';
import { toast } from 'react-toastify';

type Props = {
  med: Medication;
  onClose: () => void;
};
const STANDARD_OPTIONS = ['아침', '점심', '저녁', '취침전', '통증시'];

export default function MedDetailModal({ med, onClose }: Props) {
  const updateMedication = useHealthDataStore((s) => s.updateMedication);
  const deleteMedication = useHealthDataStore((s) => s.deleteMedication);

  const [editing, setEditing] = useState(false);
  const initializeSchedule = () => {
    if (!med.schedule) return { list: [], custom: '' };
    
    const parts = med.schedule.split(', ').map((s) => s.trim());
    const list = parts.filter((p) => STANDARD_OPTIONS.includes(p));
    const customParts = parts.filter((p) => !STANDARD_OPTIONS.includes(p));
    if (customParts.length > 0) {
      list.push('기타');
    }
    return { 
      list, 
      custom: customParts.join(', ') 
    };
  };

  const initialSched = initializeSchedule();
  const [form, setForm] = useState({
    name: med.name,
    dosageForm: med.dosageForm,
    dose: med.dose,
    unit: med.unit,
    startDate: med.startDate,
    endDate: med.endDate,
  });

  const [scheduleList, setScheduleList] = useState<string[]>(initialSched.list);
  const [customSchedule, setCustomSchedule] = useState<string>(initialSched.custom);
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleScheduleToggle = (option: string) => {
    setScheduleList((prev) => {
      const isActive = prev.includes(option);
      return isActive
        ? prev.filter((item) => item !== option)
        : [...prev, option];
    });
  };
  const startEditing = () => {
    const sched = initializeSchedule();
    setForm({
      name: med.name,
      dosageForm: med.dosageForm,
      dose: med.dose,
      unit: med.unit,
      startDate: med.startDate,
      endDate: med.endDate,
    });
    setScheduleList(sched.list);
    setCustomSchedule(sched.custom);
    setEditing(true);
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const selectedOptions = scheduleList.filter((s) => s !== '기타');
    if (scheduleList.includes('기타') && customSchedule.trim()) {
      selectedOptions.push(customSchedule.trim());
    }
    const finalScheduleString = selectedOptions.join(', ');

    updateMedication(med.id, { 
      ...form, 
      schedule: finalScheduleString // 합쳐진 문자열 저장
    });
    toast.success('수정되었습니다');
    onClose();
  };

  const onDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteMedication(med.id);
      toast.success('삭제되었습니다.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-popup p-6 z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-dark-gray">복용 정보 상세</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark-gray text-2xl">
            <HiOutlineX />
          </button>
        </div>

        {!editing ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">약 이름</span><div className="text-dark-gray font-semibold">{med.name}</div></div>
            <div><span className="text-gray-500">용량</span><div className="text-dark-gray font-semibold">{med.dose}{med.unit}</div></div>
            <div><span className="text-gray-500">분류</span><div className="text-dark-gray font-semibold">{med.type === 'prescription' ? '처방약' : '영양제'}</div></div>
            <div><span className="text-gray-500">약 종류</span><div className="text-dark-gray font-semibold">{med.dosageForm}</div></div>
            <div><span className="text-gray-500">복용 스케줄</span><div className="text-dark-gray font-semibold">{med.schedule}</div></div>
            <div className="col-span-1">
              <span className="text-gray-500">복용 기간</span>
              <div className="text-dark-gray font-semibold">
                {med.startDate} ~ {med.endDate}
              </div>
            </div>
          </div>
        ) : (
          <form className="grid grid-cols-2 gap-4" onSubmit={onSave}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">약 종류</label>
              <select name="dosageForm" value={form.dosageForm} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white">
                <option value="캡슐">캡슐</option>
                <option value="정제">정제</option>
                <option value="액상">액상</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">용량</label>
              <input name="dose" value={form.dose} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">단위</label>
              <select name="unit" value={form.unit} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white">
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="g">g</option>
                <option value="mL">mL</option>
                <option value="%">%</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">복용 스케줄</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[...STANDARD_OPTIONS, '기타'].map((option) => {
                  const isActive = scheduleList.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleScheduleToggle(option)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        isActive
                          ? 'bg-mint text-white border-mint shadow-sm' 
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {scheduleList.includes('기타') && (
                <input
                  type="text"
                  value={customSchedule}
                  onChange={(e) => setCustomSchedule(e.target.value)}
                  placeholder="원하는 복용 스케줄을 입력해주세요"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint animate-fadeIn"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">시작일</label>
              <input type="date" name="startDate" value={form.startDate} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">종료일</label>
              <input type="date" name="endDate" value={form.endDate} onChange={onChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
            </div>
            <div className="col-span-2 flex gap-3 mt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 py-3 border rounded-lg hover:bg-gray-100 text-gray-700">취소</button>
              <button type="submit" className="flex-1 bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">저장</button>
            </div>
          </form>
        )}

        {!editing && (
          <div className="flex gap-3 mt-6">
            <button onClick={startEditing} className="flex-1 bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">수정</button>
            <button onClick={onDelete} className="flex-1 border border-red-300 text-red-500 hover:bg-red-50 font-bold py-3 px-4 rounded-lg">삭제</button>
          </div>
        )}
      </div>
    </div>
  );
}
