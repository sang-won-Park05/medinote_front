// src/components/domain/HealthInfo/AllergyInfoTab.tsx

import React, { useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlinePlus } from 'react-icons/hi';
import AllergyModal from './AllergyModal';
import AllergyDetailModal from './AllergyDetailModal';
import useHealthDataStore, { type Allergy } from '../../../store/useHealthDataStore';

export default function AllergyInfoTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Allergy | null>(null);
  const allergies = useHealthDataStore((state) => state.allergies);

  return (
    <>
      {/* 알러지 정보 카드 */}
      <div className="w-full bg-white rounded-lg shadow-lg">
        {/* 카드 헤더 */}
        <div className="flex items-center gap-2 p-4">
          <HiOutlineExclamationCircle className="text-alert-icon text-2xl" />
          <div>
            <h3 className="text-lg font-bold text-dark-gray">알러지 정보</h3>
            <p className="text-sm text-gray-500">주의해야 할 알러지를 기록해요</p>
          </div>
        </div>

        {/* 알러지 목록 */}
        <div className="space-y-3 p-4 pt-0">
          {allergies.length > 0 ? (
            allergies.map((allergy) => (
              <AllergyItem key={allergy.id} name={allergy.name} onClick={() => setSelected(allergy)} />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center p-2">추가된 알러지 정보가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 알러지 추가 버튼 (하단) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 mt-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-mint hover:text-mint transition-all"
      >
        <HiOutlinePlus /> 알러지 추가하기
      </button>

      {/* 모달 렌더링 */}
      {isModalOpen && <AllergyModal onClose={() => setIsModalOpen(false)} />}
      {selected && <AllergyDetailModal allergy={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// --- 서브 컴포넌트: AllergyItem ---
type ItemProps = { name: string; onClick?: () => void };
function AllergyItem({ name, onClick }: ItemProps) {
  return (
    <div className="flex items-center gap-3 bg-alert-bg p-3 rounded-md cursor-pointer hover:bg-red-50" onClick={onClick}>
      <HiOutlineExclamationCircle className="text-alert-icon text-xl flex-shrink-0" />
      <span className="font-semibold text-dark-gray">{name}</span>
    </div>
  );
}

