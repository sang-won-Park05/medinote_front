// src/components/domain/HealthInfo/DiseaseInfoTab.tsx

import React, { useState } from 'react';
import { HiOutlinePlus, HiOutlineFire, HiOutlineLightningBolt } from 'react-icons/hi';
import DiseaseModal from './DiseaseModal';
import DiseaseDetailModal from './DiseaseDetailModal';
import useHealthDataStore, { type Disease } from '../../../store/useHealthDataStore';

type Filter = 'all' | 'chronic' | 'simple';
type ModalState = {
  isOpen: boolean;
  defaultType: 'chronic' | 'simple';
};

export default function DiseaseInfoTab() {
  const [filter, setFilter] = useState<Filter>('all');
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, defaultType: 'chronic' });
  const [selected, setSelected] = useState<Disease | null>(null);
  const diseases = useHealthDataStore((state) => state.diseases);

  const openModal = () => setModalState({ isOpen: true, defaultType: 'chronic' });
  const closeModal = () => setModalState({ isOpen: false, defaultType: 'chronic' });
  const filteredDiseases = diseases.filter(
    (d) => filter === 'all' || filter === d.type
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* 필터 버튼 그룹 */}
        <div className="flex gap-2">
          <FilterButton 
            text="전체" 
            isActive={filter === 'all'} 
            onClick={() => setFilter('all')} 
          />
          <FilterButton 
            text="만성질환" 
            isActive={filter === 'chronic'} 
            onClick={() => setFilter('chronic')} 
          />
          <FilterButton 
            text="급성질병" 
            isActive={filter === 'simple'} 
            onClick={() => setFilter('simple')} 
          />
        </div>
        <button 
          onClick={openModal}
          className="flex items-center gap-1 bg-mint hover:bg-mint-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <HiOutlinePlus /> 추가
        </button>
      </div>

      {/* 질환정보 단일 리스트 */}
      <div className="space-y-3">
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map((d) => (
            <DiseaseItem 
              key={d.id} 
              name={d.name} 
              meds={d.meds} 
              tag={d.type === 'chronic' ? '만성질환' : '급성질병'} 
              tagColor={d.type === 'chronic' ? 'orange' : 'blue'} 
              onClick={() => setSelected(d)} 
            />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center p-4">
            {filter === 'all' ? '추가된 질환정보가 없습니다.' : '해당 유형의 질환정보가 없습니다.'}
          </p>
        )}
      </div>
      {modalState.isOpen && <DiseaseModal onClose={closeModal} defaultType={modalState.defaultType} />}
      {selected && <DiseaseDetailModal disease={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// '약정보' 탭에서 가져온 FilterButton 서브 컴포넌트
type FilterButtonProps = {
  text: string;
  isActive: boolean;
  onClick: () => void;
};

function FilterButton({ text, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm font-semibold rounded-full ${
        isActive ? 'bg-mint text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {text}
    </button>
  );
}

// --- 서브 컴포넌트: DiseaseItem ---
type ItemProps = {
  name: string;
  meds: string;
  tag: string;
  tagColor: 'orange' | 'blue';
  onClick?: () => void;
};

function DiseaseItem({ name, meds, tag, tagColor, onClick }: ItemProps) {
  const tagClass = tagColor === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600';
  const medList = meds ? meds.split(',').map(m => m.trim()).filter(m => m.length > 0) : [];
  const iconData = tagColor === 'orange' 
    ? { icon: <HiOutlineFire />, color: 'text-orange-500' } // 만성질환
    : { icon: <HiOutlineLightningBolt />, color: 'text-blue-500' }; // 급성질병

  return (
    <div className="flex gap-4 items-start bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-50" onClick={onClick}>
      <div className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${iconData.color}`}>
        {iconData.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-dark-gray">{name}</h4>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagClass} ml-2 flex-shrink-0`}>
            {tag}
          </span>
        </div>
        
        {medList.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {medList.map((med, index) => (
              <span key={index} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {med}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

