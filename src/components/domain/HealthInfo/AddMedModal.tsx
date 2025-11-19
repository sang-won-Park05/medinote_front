import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { 
  HiOutlineX, 
  HiOutlineClipboardCheck, 
  HiOutlineSparkles, 
  HiOutlineArrowLeft,
  HiOutlineCamera,
  HiOutlinePhotograph,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import useHealthDataStore, { type Medication } from '../../../store/useHealthDataStore';
import { toast } from 'react-toastify';

type Step = 'selectType' | 'fillForm';
type MedType = 'prescription' | 'supplement';

// OCR 플로우 세부 단계
type OcrStep = 'idle' | 'selectMethod' | 'preview' | 'scanning' | 'complete';

type MedForm = {
  name: string;
  dosageForm: '캡슐' | '정제' | '액상';
  dose: string;
  unit: 'mg' | 'mcg' | 'g' | 'mL' | '%';
  schedule: string[];
  customSchedule: string;
  startDate: string;
  endDate: string;
};

type ModalProps = {
  onClose: () => void;
  initialType?: MedType;
  startStep?: Step;
  onAdded?: (med: Medication) => void;
};

export default function AddMedModal({ onClose, initialType = 'prescription', startStep = 'selectType', onAdded }: ModalProps) {
  const addMedication = useHealthDataStore((s) => s.addMedication);
  const medications = useHealthDataStore((s) => s.medications);

  const [step, setStep] = useState<Step>(startStep);
  const [medType, setMedType] = useState<MedType>(initialType);
  
  // OCR 플로우 상태 관리
  const [ocrStep, setOcrStep] = useState<OcrStep>('idle');
  const [imagePreview, setImagePreview] = useState<string | null>(null); // (가상) 이미지 미리보기 URL

  const [formData, setFormData] = useState<MedForm>({
    name: '',
    dosageForm: '정제',
    dose: '',
    unit: 'mg',
    schedule: [''],
    customSchedule: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 스케줄 다중 선택
  const handleScheduleToggle = (option: string) => {
    setFormData((prev) => {
      const isActive = prev.schedule.includes(option);
      const newSchedule = isActive
        ? prev.schedule.filter((item) => item !== option)
        : [...prev.schedule, option];
      
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('약 이름을 입력해주세요.');
      return;
    }

    const isDuplicate = medications.some((m) => m.name.toLowerCase() === formData.name.toLowerCase());
    if (isDuplicate && !window.confirm('같은 이름의 약이 이미 있습니다. 계속 추가할까요?')) {
      return;
    }
  
    const selectedOptions = formData.schedule.filter(s => s !== '기타');
    if (formData.schedule.includes('기타') && formData.customSchedule.trim()) {
      selectedOptions.push(formData.customSchedule.trim());
    }

    const finalScheduleString = selectedOptions.join(', ');

    const newMedBase = {
      name: formData.name,
      type: medType,
      dosageForm: formData.dosageForm,
      dose: formData.dose,
      unit: formData.unit,
      schedule: finalScheduleString,
      startDate: formData.startDate,
      endDate: formData.endDate,
    } as Omit<Medication, 'id'>;
    addMedication(newMedBase);

    if (onAdded) {
      onAdded({ id: `m_${Date.now()}`, ...newMedBase });
    }

    toast.success('복약정보가 추가되었습니다.');
    onClose();
  };
  
  // OCR (가상) 이미지 선택 핸들러
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    toast.info('이미지를 선택했습니다.');
    setImagePreview(url);
    setOcrStep('preview');
    e.target.value = ''; // 같은 파일 재선택 가능하게 초기화
  };

  // (가상) 스캔 시작 핸들러
  const handleScanStart = () => {
    setOcrStep('scanning'); // 로딩 UI 표시(2초간)
    setTimeout(() => {
      setFormData({
        name: "아토목세틴",
        dosageForm: "캡슐",
        dose: "40",
        unit: "mg",
        schedule: ["아침", "저녁"],
        customSchedule: "",
        startDate: "2025-11-15",
        endDate: "2025-12-15",
      });
      setOcrStep('complete');
      toast.success("스캔 완료! 폼이 자동으로 채워졌습니다.");
    }, 2000);
  };

  // 다시 스캔 핸들러
  const handleScanAgain = () => {
    setOcrStep('selectMethod');
    setImagePreview(null);
  };

  // --- 1. 유형 선택 (Step 1) ---
  if (step === 'selectType') {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-dark-gray">약 추가</h2>
          <CloseButton onClick={onClose} />
        </div>
        <p className="text-sm text-gray-500 mb-6">추가하려는 약의 종류를 선택하세요.</p>
        <div className="flex gap-4">
          <TypeCard icon={<HiOutlineClipboardCheck />} title="처방약" description="병원에서 처방받은 약" onClick={() => { setMedType('prescription'); setStep('fillForm'); }} />
          <TypeCard icon={<HiOutlineSparkles />} title="영양제" description="건강보조식품" onClick={() => { setMedType('supplement'); setStep('fillForm'); }} />
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 border rounded-lg hover:bg-gray-100 text-gray-700">닫기</button>
      </ModalWrapper>
    );
  }

  // --- 2. 폼 입력 (Step 2) ---
  return (
    <ModalWrapper onClose={onClose} wide>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-dark-gray">
          {medType === 'prescription' ? '처방약 추가' : '영양제 추가'}
        </h2>
        <CloseButton onClick={onClose} />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {medType === 'prescription' ? 'OCR 스캔 또는 직접 정보를 입력하세요.' : '약 정보를 입력하세요.'}
      </p>

      {/* OCR 스캔 UI 영역 (처방약일 때만) */}
      {medType === 'prescription' && (
        <div className="mb-5 p-4 border-2 border-dashed border-mint/50 rounded-lg bg-mint/5 text-center">
          
          {/* 'OCR 스캔하기' 버튼 */}
          {ocrStep === 'idle' && (
            <>
              <HiOutlineCamera className="text-3xl text-mint mx-auto mb-2" />
              <h3 className="font-semibold text-dark-gray mb-1">처방전이 있으신가요?</h3>
              <p className="text-sm text-gray-600 mb-3">OCR 스캔으로 약 정보를 자동으로 입력하세요.</p>
              <button
                type="button"
                onClick={() => setOcrStep('selectMethod')}
                className="bg-mint text-white px-4 py-2 rounded-lg font-semibold hover:bg-mint-dark"
              >
                OCR 스캔하기
              </button>
            </>
          )}

          {/* 촬영/앨범 선택 */}
          {ocrStep === 'selectMethod' && (
            <div>
              <h3 className="font-semibold text-dark-gray mb-3">이미지 선택</h3>

              {/* 숨겨진 input 두 개: 카메라/앨범 */}
              <input
                type="file"
                id="camera-input"
                accept="image/*"
                capture    // 카메라 우선
                className="hidden"
                onChange={handleImageSelect}
              />
              <input
                type="file"
                id="album-input"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              <div className="flex gap-4 justify-center">
                <label
                  htmlFor="camera-input"
                  className="flex-1 flex flex-col items-center p-4 border rounded-lg hover:bg-white cursor-pointer"
                >
                  <HiOutlineCamera className="text-3xl text-mint" />
                  <span className="text-sm font-semibold mt-1">카메라 촬영</span>
                </label>

                <label
                  htmlFor="album-input"
                  className="flex-1 flex flex-col items-center p-4 border rounded-lg hover:bg-white cursor-pointer"
                >
                  <HiOutlinePhotograph className="text-3xl text-mint" />
                  <span className="text-sm font-semibold mt-1">앨범에서 선택</span>
                </label>
              </div>
            </div>
          )}


          {/* 이미지 미리보기 및 스캔 시작 */}
          {ocrStep === 'preview' && imagePreview && (
            <div>
              <h3 className="font-semibold text-dark-gray mb-3">이미지 미리보기</h3>
              <img src={imagePreview} alt="Prescription Preview" className="rounded-lg mb-3" />
              <div className="flex gap-3">
                <button type="button" onClick={handleScanAgain} className="flex-1 py-2 border rounded-lg hover:bg-gray-100 text-gray-700">
                  다시 선택
                </button>
                <button type="button" onClick={handleScanStart} className="flex-1 bg-mint text-white font-semibold rounded-lg hover:bg-mint-dark">
                  스캔 시작
                </button>
              </div>
            </div>
          )}

          {/* 스캔 중 로딩 UI */}
          {ocrStep === 'scanning' && (
            <div className="h-24 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-dark-gray font-semibold">스캔 중입니다... (가상)</p>
            </div>
          )}

          {/* 스캔 완료 UI */}
          {ocrStep === 'complete' && (
            <div className="h-24 flex flex-col items-center justify-center">
              <HiOutlineCheckCircle className="text-4xl text-green-500 mb-3" />
              <p className="text-sm text-dark-gray font-semibold">스캔 완료! 폼을 확인해주세요.</p>
              <button
                type="button"
                onClick={handleScanAgain}
                className="text-xs text-mint hover:underline mt-1"
              >
                (다시 스캔하기)
              </button>
            </div>
          )}

        </div>
      )}

      {/* 폼 제목 */}
      <h3 className="text-lg font-bold text-dark-gray mb-4">
        {ocrStep === 'complete' ? '스캔 결과 (수정 가능)' : '정보 입력'}
      </h3>

      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* 폼 필드 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">약 이름</label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="예: 아스피린" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">약 종류</label>
          <select name="dosageForm" value={formData.dosageForm} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white">
            <option value="캡슐">캡슐</option>
            <option value="정제">정제</option>
            <option value="액상">액상</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">용량</label>
          <input name="dose" value={formData.dose} onChange={handleChange} placeholder="예: 100" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">단위</label>
          <select name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white">
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
            {['아침', '점심', '저녁', '취침전', '통증시', '기타'].map((option) => {
              const isActive = formData.schedule.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleScheduleToggle(option)}
                  className={`px-3 py-3 rounded-lg text-sm font-medium border transition-all ${
                    isActive
                      ? 'bg-mint text-white border-mint shadow-sm' // 선택됐을 때 색상
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50' // 안 됐을 때 색상
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {formData.schedule.includes('기타') && (
            <input
              type="text"
              name="customSchedule"
              value={formData.customSchedule}
              onChange={handleChange}
              placeholder="원하는 복용 스케줄을 입력해주세요"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-gray-50 animate-fadeIn"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">시작일</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">종료일</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>

        <div className="col-span-2 flex gap-3 mt-6">
          {startStep !== 'fillForm' && (
            <button 
              type="button" 
              onClick={() => {
                setStep('selectType'); 
                setOcrStep('idle'); // OCR 상태 초기화
              }} 
              className="flex-1 py-3 border rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center gap-1"
            >
              <HiOutlineArrowLeft /> 이전
            </button>
          )}
          <button type="submit" className="flex-1 bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg">추가</button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// --- 공통 서브 컴포넌트 ---
const ModalWrapper: React.FC<{ onClose: () => void; children: React.ReactNode; wide?: boolean }> = ({ onClose, children, wide = false }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-lg shadow-popup p-6 z-50`} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-dark-gray text-2xl">
    <HiOutlineX />
  </button>
);

const TypeCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <button onClick={onClick} className="flex-1 p-6 border rounded-lg text-center hover:bg-mint/10 hover:border-mint transition-all">
    <div className="text-4xl text-mint mx-auto mb-3">{icon}</div>
    <h3 className="font-bold text-lg text-dark-gray">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </button>
);