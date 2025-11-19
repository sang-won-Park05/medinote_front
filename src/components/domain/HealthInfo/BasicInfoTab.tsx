// src/components/domain/HealthInfo/BasicInfoTab.tsx

import React, { useState, useEffect,  type ChangeEvent, type FormEvent } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useHealthDataStore from '../../../store/useHealthDataStore';

// 폼 데이터 타입 정의
interface BasicInfoForm {
  birth: string;
  gender: '남성' | '여성';
  bloodType: string;
  height: string;
  weight: string;
  drink: string;
  smoke: string;
}

export default function BasicInfoTab() {
  const storeBasicInfo = useHealthDataStore((state) => state.basicInfo);
  const updateBasicInfo = useHealthDataStore((state) => state.updateBasicInfo);

  const [formData, setFormData] = useState<BasicInfoForm>(storeBasicInfo);

  useEffect(() => {
    setFormData(storeBasicInfo);
  }, [storeBasicInfo]);


  // 입력창 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 저장(제출) 핸들러
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // (가상 API 호출)
    console.log("스토어에 저장될 데이터:", formData);
    updateBasicInfo(formData);
    toast.success("기본정보가 저장되었습니다.");
  };

  return (
    <>
      {/* 정보 카드 영역 */}
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        
        {/* 카드 제목 동일 */}
        <div className="flex items-center gap-2 mb-2">
          <HiOutlineUserCircle className="text-mint text-2xl" />
          <h3 className="text-lg font-bold text-dark-gray">기본 건강정보</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          건강 관리의 기본이 되는 정보입니다.
        </p>

        {/* 폼 태그 */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-5">
          {/* 생년월일 */}
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">생년월일</label>
            <input
              type="date"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </div>
          
          {/* 성별 */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">성별</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white"
            >
              <option>남성</option>
              <option>여성</option>
            </select>
          </div>

          {/* 혈액형 */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">혈액형</label>
            <select 
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white"
            >
              <option>A+</option> <option>A-</option> <option>B+</option> <option>B-</option>
              <option>AB+</option> <option>AB-</option> <option>O+</option> <option>O-</option>
            </select>
          </div>

          {/* 키 (cm) */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">키 (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="170"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </div>

          {/* 몸무게 (kg) */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">몸무게 (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="80"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </div>

          {/* 음주 여부 */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">음주 여부</label>
            <select 
              name="drink"
              value={formData.drink}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white"
            >
              <option>전혀 안 마심</option> <option>월 1회 이하</option> <option>월 2-4회</option>
              <option>주 2-3회</option> <option>주 4회 이상</option>
            </select>
          </div>

          {/* 흡연 여부 */}
          <div className="col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">흡연 여부</label>
            <select 
              name="smoke"
              value={formData.smoke}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint bg-white"
            >
              <option>비흡연자</option> <option>과거 흡연자</option> <option>현재 흡연자</option>
            </select>
          </div>
        </form>
        <button 
          type="button"
          onClick={handleSubmit}
          className="w-full h-14 bg-mint hover:bg-mint-dark text-white font-bold rounded-lg mt-6 transition-colors"
        >
          정보 저장하기
        </button>
      </div>
    </>
  );
}