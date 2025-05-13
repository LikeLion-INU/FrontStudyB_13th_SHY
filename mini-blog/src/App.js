import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/page/MainPage";
import PostWritePage from "./components/page/PostWritePage";
import PostViewPage from "./components/page/PostViewPage";
import { BlogProvider } from "./context/BlogContext";

function App() {
  return (
    <BlogProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/post-write" element={<PostWritePage />} />
          <Route path="/post/:postId" element={<PostViewPage />} />
        </Routes>
      </BrowserRouter>
    </BlogProvider>
  );
}

export default App;
