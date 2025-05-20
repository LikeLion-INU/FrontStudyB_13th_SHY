import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./components/page/MainPage";
import PostWritePage from "./components/page/PostWritePage";
import PostViewPage from "./components/page/PostViewPage";
import PostEditPage from "./components/page/PostEditPage";
import LoginPage from "./components/page/auth/LoginPage";
import SignupPage from "./components/page/auth/SignupPage";
import { BlogProvider } from "./context/BlogContext";
import { AuthProvider } from "./context/AuthContext";

/**
 * 블로그 애플리케이션
 * 
 * 성호영의 개인 블로그 애플리케이션입니다.
 * 메인 페이지, 글 작성 페이지, 글 상세 보기 페이지로 구성되어 있습니다.
 */

/**
 * 인증이 필요한 라우트를 위한 래퍼 컴포넌트
 * 
 * 사용자가 인증되지 않은 경우 로그인 페이지로 리다이렉트합니다.
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} 인증 여부에 따라 자식 컴포넌트 또는 리다이렉트를 렌더링
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * 애플리케이션 루트 컴포넌트
 * 
 * 전체 애플리케이션의 구조를 정의하고 라우팅을 설정합니다.
 * AuthProvider와 BlogProvider를 통해 애플리케이션 전체에 인증 및 블로그 컨텍스트를 제공합니다.
 * @returns {JSX.Element} 애플리케이션 컴포넌트
 */
function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <BrowserRouter>
          <Routes>
            {/* 인증 관련 페이지 라우트 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 인증이 필요한 페이지 라우트 */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } />
            <Route path="/post-write" element={
              <ProtectedRoute>
                <PostWritePage />
              </ProtectedRoute>
            } />
            <Route path="/post/:postId" element={
              <ProtectedRoute>
                <PostViewPage />
              </ProtectedRoute>
            } />
            <Route path="/post-edit/:postId" element={
              <ProtectedRoute>
                <PostEditPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
