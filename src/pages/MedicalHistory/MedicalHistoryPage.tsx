// src/pages/MedicalHistory/MedicalHistoryPage.tsx

import React, { useMemo, useState } from 'react';
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import AddHistoryMethodModal from '../../components/domain/MedicalHistory/AddHistoryMethodModal';
import HistoryForm, { type HistoryFormData } from '../../components/domain/MedicalHistory/HistoryForm';
import AddMedModal from '../../components/domain/HealthInfo/AddMedModal';
import HistoryDetailModal, { type HistoryRecord } from '../../components/domain/MedicalHistory/HistoryDetailModal';
import { toast } from 'react-toastify';
import VoiceRecordingFlow from '../../components/domain/MedicalHistory/VoiceRecordingFlow';
import OcrFlow from '../../components/domain/MedicalHistory/OcrFlow';


type PageState = 'list' | 'selectMethod' | 'voiceFlow' | 'ocrFlow' | { view: 'fillForm', initialData?: Partial<HistoryFormData> };

const SAMPLE: HistoryRecord[] = [
  {
    id: 'h1',
    title: '고혈압 정기검진',
    date: '2025-10-20',
    hospital: '서울대학교병원',
    doctor: '김메디',
    symptoms: '두통, 어지럼증',
    notes: '혈압 조절이 필요하여 꾸준히 복용하세요.',
    meds: ['아모디핀'],
  },
];

export default function MedicalHistoryPage() {
  const [pageState, setPageState] = useState<PageState>('list');
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<HistoryRecord[]>(SAMPLE);
  const [selected, setSelected] = useState<HistoryRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      r.hospital.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.symptoms.toLowerCase().includes(q) ||
      r.meds.join(' ').toLowerCase().includes(q)
    );
  }, [records, query]);

  const handleSave = (data: HistoryFormData) => {
    const newRecord: HistoryRecord = {
      id: `h_${Date.now()}`,
      ...data,
      meds: []
    };
    setRecords((prev) => [newRecord, ...prev]);
    toast.success("진료기록이 저장되었습니다.");
    setPageState('list');
  };
  const handleFlowComplete = (data: Partial<HistoryFormData>) => {
    setPageState({ view: 'fillForm', initialData: data });
  };
  
  // 취소 핸들러
  const handleCancel = () => {
    setPageState('list');
  };


  if (pageState === 'list') {
    return (
      <div className="flex flex-col p-4 pb-16 space-y-4">
        <header className="w-full bg-mint/10 p-4 shadow-sm rounded-lg">
          <h2 className="text-xl font-bold text-dark-gray">진료기록</h2>
        </header>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="병원명, 진단명, 증상, 처방약으로 검색" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>
        <button onClick={() => setPageState('selectMethod')} className="w-full flex items-center justify-center gap-2 p-3 bg-mint hover:bg-mint-dark text-white font-bold rounded-lg shadow-lg">
          <HiOutlinePlus className="text-xl" /> 새 진료기록 추가
        </button>
        <div className="space-y-3">
          {filtered.map((h) => (
            <HistoryCard key={h.id} {...h} onClick={() => setSelected(h)} />
          ))}
          {filtered.length === 0 && <p className="text-sm text-gray-400 text-center p-4">검색 결과가 없습니다.</p>}
        </div>

        {selected && (
          <HistoryDetailModal
            record={selected}
            onClose={() => setSelected(null)}
            onUpdate={(u) => setRecords((prev) => prev.map((r) => (r.id === u.id ? u : r)))}
            onDelete={(id) => setRecords((prev) => prev.filter((r) => r.id !== id))}
            onAddPrescription={() => setIsMedModalOpen(true)}
          />
        )}

        {isMedModalOpen && (
          <AddMedModal
            onClose={() => setIsMedModalOpen(false)}
            initialType="prescription"
            startStep="fillForm"
            onAdded={(med: any) => {
              setRecords((prev) =>
                prev.map((r) => (selected && r.id === selected.id ? { ...r, meds: [...r.meds, med.name] } : r))
              );
              setSelected((prevSelected) => {
                if (prevSelected && selected && prevSelected.id === selected.id) {
                  return { ...prevSelected, meds: [...prevSelected.meds, med.name] };
                }
                return prevSelected;
              });
            }}
          />
        )}
      </div>
    );
  }

  if (typeof pageState === 'object' && pageState.view === 'fillForm') {
    return (
      <div className="p-4">
        <HistoryForm 
          onSave={handleSave} 
          onCancel={handleCancel} 
          initialData={pageState.initialData}
        />
      </div>
    );
  }

  if (pageState === 'voiceFlow') {
    return (
      <div className="p-4">
        <VoiceRecordingFlow 
          onCancel={handleCancel}
          onComplete={handleFlowComplete}
        />
      </div>
    );
  }
  
  // --- ocrFlow ---
  if (pageState === 'ocrFlow') {
    return (
      <div className="p-4">
        <OcrFlow 
          onCancel={handleCancel}
          onComplete={handleFlowComplete}
        />
      </div>
    );
  }

  if (pageState === 'selectMethod') {
    return (
      <>
        <div className="flex flex-col p-4 pb-16 space-y-4">
          <header className="w-full bg-mint/10 p-4 shadow-sm rounded-lg"><h2 className="text-xl font-bold text-dark-gray">진료기록</h2></header>
          <div className="relative"><HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="병원명, 진단명, 증상, 처방약으로 검색" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" /></div>
          <button onClick={() => setPageState('selectMethod')} className="w-full flex items-center justify-center gap-2 p-3 bg-mint hover:bg-mint-dark text-white font-bold rounded-lg shadow-lg"><HiOutlinePlus className="text-xl" /> 새 진료기록 추가</button>
          <div className="space-y-3">
            {filtered.map((h) => (
              <HistoryCard key={h.id} {...h} onClick={() => setSelected(h)} />
            ))}
            {filtered.length === 0 && <p className="text-sm text-gray-400 text-center p-4">검색 결과가 없습니다.</p>}
          </div>
        </div>
        <AddHistoryMethodModal 
          onClose={() => setPageState('list')} 
          onSelectMethod={(method) => {
            if (method === 'direct') setPageState({ view: 'fillForm' });
            else if (method === 'voice') setPageState('voiceFlow');
            else if (method === 'ocr') setPageState('ocrFlow');
            else setPageState('list');
          }} 
        />
      </>
    );
  }
  return null;
}

type CardProps = Pick<HistoryRecord, 'title' | 'date' | 'hospital' | 'symptoms' | 'meds'> & { onClick: () => void };
function HistoryCard({ title, date, hospital, symptoms, meds, onClick }: CardProps) {
  return (
    <button onClick={onClick} className="w-full bg-white rounded-lg shadow-lg p-4 flex gap-4 items-start text-left hover:bg-gray-50 transition-all">
      <HiOutlineDocumentText className="text-mint text-3xl flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-dark-gray mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
        <p className="text-sm text-gray-500">{hospital}</p>
        <div className="mt-3"> 
          <span className="text-xs font-semibold text-gray-400">증상</span>
          <p className="text-sm text-dark-gray">{symptoms}</p>
        </div>
        {meds.length > 0 && (
          <div className="mt-3">
            <span className="text-xs font-semibold text-gray-400">처방약</span>
            <div className="flex gap-2 mt-1">
              {meds.map((med) => (
                <span key={med} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-prescription/10 text-prescription">{med}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

