import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/page/MainPage";
import PostWritePage from "./components/page/PostWritePage";
import PostViewPage from "./components/page/PostViewPage";
import { BlogProvider } from "./context/BlogContext";

/**
 * 블로그 애플리케이션
 * 
 * 성호영의 개인 블로그 애플리케이션입니다.
 * 메인 페이지, 글 작성 페이지, 글 상세 보기 페이지로 구성되어 있습니다.
 */

/**
 * 애플리케이션 루트 컴포넌트
 * 
 * 전체 애플리케이션의 구조를 정의하고 라우팅을 설정합니다.
 * BlogProvider를 통해 애플리케이션 전체에 블로그 컨텍스트를 제공합니다.
 * @returns {JSX.Element} 애플리케이션 컴포넌트
 */
function App() {
  return (
    <BlogProvider>
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지 라우트 */}
          <Route path="/" element={<MainPage />} />
          {/* 글 작성 페이지 라우트 */}
          <Route path="/post-write" element={<PostWritePage />} />
          {/* 글 상세 보기 페이지 라우트 (:postId는 동적 파라미터) */}
          <Route path="/post/:postId" element={<PostViewPage />} />
        </Routes>
      </BrowserRouter>
    </BlogProvider>
  );
}

export default App;
