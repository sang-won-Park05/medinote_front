// src/pages/Schedule/SchedulePage.tsx

import React, { useMemo, useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AddScheduleModal from '../../components/domain/Schedule/AddScheduleModal';
import ScheduleDetailModal from '../../components/domain/Schedule/ScheduleDetailModal';
import useScheduleStore, { type ScheduleItem } from '../../store/useScheduleStore';
import { kstYmd } from '../../utils/date';
import {HiOutlinePlus} from 'react-icons/hi';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function SchedulePage() {
  const [date, setDate] = useState<Value>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ScheduleItem | null>(null);
  const [detailItem, setDetailItem] = useState<ScheduleItem | null>(null);

  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useScheduleStore();

  const selectedDateStr = date instanceof Date ? kstYmd(date) : '';
  const daySchedules = useMemo(
    () => schedules.filter((s) => s.date === selectedDateStr).sort((a, b) => a.time.localeCompare(b.time)),
    [schedules, selectedDateStr]
  );

  const formattedDate = date instanceof Date
    ? date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '날짜를 선택하세요';

  return (
    <>
      <style>{`
        .react-calendar { 
          width: 100% !important; 
          border: none !important; 
          background: transparent !important;
          font-family: inherit; 
        }
        .react-calendar__tile { 
          height: 48px; 
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .react-calendar__month-view__days__day--weekend {
          color: #ff5a5f;
        }
        /* 선택된 날짜 색상 변경 (Mint) */
        .react-calendar__tile--active {
          background: #2bddb7 !important;
          color: white !important;
          border-radius: 8px;
        }
        /* 오늘 날짜 표시 */
        .react-calendar__tile--now {
          background: #e6fcf8;
          color: #111;
          border-radius: 8px;
        }
      `}</style>

      <div className="flex flex-col p-4 pb-16 space-y-4">
        <header className="w-full bg-mint/10 p-4 shadow-sm rounded-lg"><h2 className="text-xl font-bold text-dark-gray">일정관리</h2></header>
        <section className="flex flex-col gap-4">
          
          {/* 1. 캘린더 영역 */}
          <div className="w-full bg-white rounded-lg shadow-lg p-4 flex justify-center">
            <Calendar 
              onChange={setDate} 
              value={date} 
              locale="ko-KR" 
              formatDay={(locale, d) => d.toLocaleString('en', { day: 'numeric' })} 
              next2Label={null} // 년도 이동 버튼 숨김 (깔끔하게)
              prev2Label={null}
            />
          </div>

          {/* 2. 일정 리스트 영역 */}
          <div className="w-full bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-dark-gray">{formattedDate}</h3>
              <button 
                onClick={() => { setEditItem(null); setIsModalOpen(true); }} 
                className="flex items-center gap-1 text-sm bg-mint text-white px-4 py-2 rounded-lg font-semibold hover:bg-mint-dark transition-colors"
              >
                <HiOutlinePlus /> 추가
              </button>
            </div>
            
            {/* 리스트 영역 최소 높이 확보 */}
            <div className="space-y-3 min-h-[200px]">
              {daySchedules.length > 0 ? (
                daySchedules.map((s) => (
                  <ScheduleRow key={s.id} item={s} onClick={() => setDetailItem(s)} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-sm">선택한 날짜의 일정이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <AddScheduleModal
          onClose={() => setIsModalOpen(false)}
          initial={editItem || { date: selectedDateStr }}
          onSave={(payload) => {
            if (editItem) updateSchedule(editItem.id, payload);
            else addSchedule(payload);
          }}
        />
      )}

      {detailItem && (
        <ScheduleDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onUpdate={(id, patch) => updateSchedule(id, patch)}
          onDelete={(id) => deleteSchedule(id)}
        />
      )}
    </>
  );
}

function ScheduleRow({ item, onClick }: { item: ScheduleItem; onClick: () => void }) {
  const isClinic = item.type === '진료';
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center p-4 rounded-xl transition-all hover:shadow-md border ${
        isClinic ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'
      }`}
    >
      {/* 시간 영역 */}
      <div className={`w-16 text-lg font-bold text-left ${isClinic ? 'text-blue-600' : 'text-green-600'}`}>
        {item.time}
      </div>
      
      {/* 구분선 */}
      <div className="w-[1px] h-8 bg-gray-300 mx-4"></div>
      
      {/* 내용 영역 */}
      <div className="flex-1 text-left">
        <div className="font-bold text-dark-gray text-base">{item.title}</div>
        {item.location && (
          <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            @ {item.location}
          </div>
        )}
      </div>
    </button>
  );
}

