// src/components/domain/Schedule/AddScheduleModal.tsx

import React, { useState, useEffect } from "react";
import type { ScheduleItem, ScheduleType } from "../../../store/useScheduleStore";
import { toast } from "react-toastify";

type AddScheduleModalProps = {
  onClose: () => void;
  initial: Partial<ScheduleItem>;
  onSave: (payload: Omit<ScheduleItem, "id">) => Promise<void> | void;
};

const SCHEDULE_TYPES: ScheduleType[] = ["진료", "검진"];

export default function AddScheduleModal({
  onClose,
  initial,
  onSave,
}: AddScheduleModalProps) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [type, setType] = useState<ScheduleType>(initial.type ?? "진료");
  const [date, setDate] = useState(initial.date ?? "");
  const [time, setTime] = useState(initial.time ?? "09:00");
  const [location, setLocation] = useState(initial.location ?? "");
  const [memo, setMemo] = useState(initial.memo ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial.date) setDate(initial.date);
  }, [initial.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      toast.error("제목, 날짜, 시간을 입력해주세요.");
      return;
    }
    if (submitting) return;

    try {
      setSubmitting(true);
      await onSave({
        title: title.trim(),
        type,
        date,
        time,
        location: location.trim() || "",
        memo: memo.trim() || "",
      });
      onClose();
    } catch (err) {
      console.error("일정 저장 실패:", err);
      toast.error("일정 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-bold text-dark-gray mb-1">일정 추가</h2>
        <p className="text-xs text-gray-500 mb-4">진료 또는 검진 일정을 기록하세요</p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold mb-1">제목 *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="예: 내과 정기 검진"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">유형 *</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as ScheduleType)}
            >
              {SCHEDULE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">날짜 *</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1">시간 *</label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">장소</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="예: 서울대학교병원"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">메모</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-20"
              placeholder="예: 공복 채혈, 복용 금지 약"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2 text-sm text-gray-600"
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-mint text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
