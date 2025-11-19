import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { FaHeart } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import FindPasswordModal from '../../components/domain/Auth/FindPasswordModal';
import useUserStore from '../../store/useUserStore';
import { toast } from 'react-toastify';

// 가계정 데이터베이스 (Mock DB)
const MOCK_USERS = {
  'admin@test.com': {
    password: 'admin1234!',
    name: '관리자',
    role: 'admin' as const,
  },
  'user@test.com': {
    password: 'user1234!',
    name: '홍길동',
    role: 'user' as const,
  },
};

type LoginFormErrors = {
  email?: string;
  password?: string;
};
const validateEmail = (email: string): string | undefined => {
  if (!email) return "이메일을 입력해주세요.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) return "유효한 이메일 형식이 아닙니다.";
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "비밀번호를 입력해주세요.";
};

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({}); // 에러 메시지
  const [touched, setTouched] = useState({ email: false, password: false }); // 사용자가 건드린 필드
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중(로딩) 상태
  const { login, isLoggedIn, role } = useUserStore();
  
  useEffect(() => {
    if (isLoggedIn) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isLoggedIn, role, navigate]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 입력창을 건드렸을 때(onBlur) 'touched' 상태 업데이트
  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: 'email' | 'password' };
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(emailInput) }));
    }
    if (name === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(passwordInput) }));
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: 'email' | 'password', value: string };

    if (name === 'email') {
      setEmailInput(value);
      // 이미 건드린 필드라면, 입력할 때마다 실시간으로 에러를 다시 검사
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      }
    }
    if (name === 'password') {
      setPasswordInput(value);
      if (touched.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  // 'handleSubmit'을 강력한 유효성 검사 로직으로 교체
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // 모든 필드를 '건드린' 것으로 처리 (에러 메시지 즉시 표시)
    setTouched({ email: true, password: true });
    
    // 유효성 검사 실행
    const emailError = validateEmail(emailInput);
    const passwordError = validatePassword(passwordInput);

    const newErrors: LoginFormErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    // 만약 프론트 Validation 에러가 있다면 (빈 칸 등), 여기서 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // (가상) API
    setIsSubmitting(true);
    setErrors({}); // 이전 에러 초기화

    // --- (가상) 백엔드 검증 ---
    // 1초 딜레이 (네트워크 호출 흉내)
    setTimeout(() => {
      // 1. 이메일 존재 여부 확인
      // @ts-ignore
      const user = MOCK_USERS[emailInput];
      
      if (!user) {
        // 존재하지 않는 이메일
        setErrors({ email: '존재하지 않는 이메일입니다.' });
        setIsSubmitting(false);
        return;
      }

      // 비밀번호 일치 여부
      if (user.password !== passwordInput) {
        setErrors({ password: '잘못된 비밀번호입니다.' });
        setIsSubmitting(false);
        return;
      }

      // 로그인 성공
      login(user.name, emailInput, passwordInput, user.role);
      toast.success(`${user.name}님 환영합니다!`);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FBFB] p-4">
      
      {/* 상단 로고 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3">
          <FaHeart className="text-mint text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-dark-gray">메디노트</h1>
        <p className="text-gray-500">나의 건강을 한 곳에서</p>
      </div>

      {/* 로그인 카드 */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-dark-gray mb-2" htmlFor="email">
              이메일
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="이메일을 입력하세요"
                value={emailInput}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint"
              />
            </div>
            {/* 에러 메시지 */}
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-dark-gray mb-2" htmlFor="password">
              비밀번호
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={passwordInput}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mint"
              />
            </div>
            {/* 에러 메시지 */}
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting} 
            className="w-full bg-mint hover:bg-mint-dark text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-gray-400"
          >
            로그인
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="text-center mt-6">
          <Link to="/signup" className="text-sm text-gray-500 hover:text-mint">
            회원가입
          </Link>
          <span className="mx-2 text-gray-300">|</span>
          <button onClick={openModal} className="text-sm text-gray-500 hover:text-mint">
            비밀번호 찾기
          </button>
        </div>
      </div>
      <p className="text-center text-gray-400 text-xs mt-8">
        © 2025 메디노트. 보는 건강 데이터는 안전하게 보호됩니다.
      </p>
      {/* 모달 조건부 렌더링 */}
      {isModalOpen && <FindPasswordModal onClose={closeModal} />}
    </div>
  );
}
