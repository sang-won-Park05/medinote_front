// src/components/domain/HealthInfo/MedInfoTab.tsx

import React, { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { TbPill } from 'react-icons/tb';
import AddMedModal from './AddMedModal';
import MedDetailModal from './MedDetailModal';
import useHealthDataStore, { type Medication } from '../../../store/useHealthDataStore';

type Filter = 'all' | 'prescription' | 'supplement';

export default function MedInfoTab() {
  const [filter, setFilter] = useState<Filter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Medication | null>(null);
  const medications = useHealthDataStore((state) => state.medications);

  return (
    <div className="space-y-4">
      {/* 상단 컨트롤 영역 */}
      <div className="flex justify-between items-center">
        {/* 필터 버튼 그룹 */}
        <div className="flex gap-2">
          <FilterButton text="전체" isActive={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterButton text="처방약" isActive={filter === 'prescription'} onClick={() => setFilter('prescription')} />
          <FilterButton text="영양제" isActive={filter === 'supplement'} onClick={() => setFilter('supplement')} />
        </div>

        {/* 약추가 버튼 */}
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 bg-mint hover:bg-mint-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors">
          <HiOutlinePlus /> 추가
        </button>
      </div>

      {/* 복약정보 리스트 */}
      <div className="space-y-3">
        {medications
          .filter((med) => filter === 'all' || filter === med.type)
          .map((med) => (
            <MedItem
              key={med.id}
              icon={ <TbPill className={ med.type === 'prescription' ? "text-prescription" : "text-supplement"} />}
              name={`${med.name} (${med.dosageForm})`}
              dose={`${med.dose}${med.unit}`}
              schedule={med.schedule}
              period={`${med.startDate} ~ ${med.endDate}`}
              tag={med.type === 'prescription' ? '처방약' : '영양제'}
              tagColor={med.type === 'prescription' ? 'blue' : 'green'}
              onClick={() => setSelected(med)}
            />
          ))}

        {/* 목록이 없을 때 */}
        {medications.filter((med) => filter === 'all' || filter === med.type).length === 0 && (
          <p className="text-sm text-gray-400 text-center p-4">추가된 복약정보가 없습니다.</p>
        )}
      </div>

      {/* 모달 렌더링 */}
      {isModalOpen && <AddMedModal onClose={() => setIsModalOpen(false)} />}
      {selected && <MedDetailModal med={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// --- 서브 컴포넌트: FilterButton ---
type FilterButtonProps = {
  text: string;
  isActive: boolean;
  onClick: () => void;
};

function FilterButton({ text, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm font-semibold rounded-full ${isActive ? 'bg-mint text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      {text}
    </button>
  );
}

// --- 서브 컴포넌트: MedItem ---
type MedItemProps = {
  icon: React.ReactNode;
  name: string;
  dose: string;
  schedule: string;
  period: string;
  tag: string;
  tagColor: 'blue' | 'green';
  onClick?: () => void;
};

function MedItem({ icon, name, dose, schedule, period, tag, tagColor, onClick }: MedItemProps) {
  const tagClass = tagColor === 'blue' ? 'bg-prescription/10 text-prescription' : 'bg-supplement/10 text-supplement';
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex gap-4 items-start cursor-pointer hover:bg-gray-50" onClick={onClick}>
      {/* 아이콘 */}
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">{icon}</div>

      {/* 정보 */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-dark-gray">{name}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagClass}`}>{tag}</span>
        </div>
        <p className="text-sm text-gray-600">{dose}</p>
        <p className="text-sm text-gray-600 mt-1">{schedule}</p>
        <p className="text-xs text-gray-400 mt-2">{period}</p>
      </div>
    </div>
  );
}
