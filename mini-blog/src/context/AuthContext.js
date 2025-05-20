import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * 인증 컨텍스트 모듈
 * 
 * 사용자 인증 상태를 관리하고 공유하는 컨텍스트 제공자와 관련 함수들을 정의합니다.
 * 로그인, 회원가입, 로그아웃 및 사용자 정보 관리 기능을 제공합니다.
 */

// 인증 컨텍스트 생성
const AuthContext = createContext();

/**
 * 인증 컨텍스트를 사용하기 위한 커스텀 후크
 * 
 * 컴포넌트에서 인증 컨텍스트에 쉽게 접근할 수 있도록 해주는 커스텀 후크입니다.
 * @returns {Object} 인증 컨텍스트 값과 함수들
 */
export const useAuth = () => useContext(AuthContext);

/**
 * 인증 컨텍스트 제공자 컴포넌트
 * 
 * 사용자 인증 상태와 관련 함수들을 애플리케이션 전체에 제공합니다.
 * @param {ReactNode} children - 컨텍스트 제공자 내부에 렌더링될 컴포넌트들
 * @returns {JSX.Element} 컨텍스트 제공자 컴포넌트
 */
export const AuthProvider = ({ children }) => {
  // 사용자 정보 상태
  const [user, setUser] = useState(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // 파싱 실패 시 로컬 스토리지 데이터 정리
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  /**
   * 로그인 함수
   * 
   * 이메일과 비밀번호를 사용하여 사용자 로그인을 처리합니다.
   * 
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<Object>} 로그인 결과 객체
   */
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      
      // 응답에서 토큰과 사용자 정보 추출
      const { accessToken, user } = response.data;
      
      console.log('Login successful, token received:', accessToken);
      
      // 로컬 스토리지에 토큰과 사용자 정보 저장
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 사용자 상태 업데이트
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  /**
   * 회원가입 함수
   * 
   * 이메일과 비밀번호를 사용하여 새 사용자를 등록합니다.
   * 
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<Object>} 회원가입 결과 객체
   */
  const register = async (email, password) => {
    try {
      // json-server-auth는 email과 password만 허용하며, password는 6자 이상이어야 함
      const response = await axiosInstance.post('/register', { 
        email, 
        password // 비밀번호는 6자 이상이어야 함
      });
      
      // 응답에서 토큰과 사용자 정보 추출
      const { accessToken, user } = response.data;
      
      console.log('Registration successful, token received:', accessToken);
      
      // 로컬 스토리지에 토큰과 사용자 정보 저장
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 사용자 상태 업데이트
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || '회원가입에 실패했습니다.' 
      };
    }
  };

  /**
   * 로그아웃 함수
   * 
   * 현재 사용자를 로그아웃 처리합니다.
   */
  const logout = () => {
    // 로컬 스토리지에서 토큰과 사용자 정보 제거
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 사용자 상태 초기화
    setUser(null);
  };

  /**
   * 현재 사용자가 특정 리소스의 소유자인지 확인하는 함수
   * 
   * @param {number|string} resourceUserId - 리소스 소유자의 ID
   * @returns {boolean} 소유자 여부
   */
  const isOwner = (resourceUserId) => {
    if (!user) return false;
    return user.id === resourceUserId;
  };

  // 컨텍스트를 통해 제공할 값과 함수들
  const value = {
    user,        // 현재 로그인한 사용자 정보
    loading,     // 인증 상태 로딩 여부
    login,       // 로그인 함수
    register,    // 회원가입 함수
    logout,      // 로그아웃 함수
    isOwner,     // 리소스 소유자 확인 함수
    isAuthenticated: !!user, // 인증 여부
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
