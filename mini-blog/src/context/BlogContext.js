import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

/**
 * 블로그 컨텍스트 모듈
 * 
 * 블로그 애플리케이션의 상태를 관리하고 공유하는 컨텍스트 제공자와 관련 함수들을 정의합니다.
 * 포스트 추가, 삭제, 조회 및 댓글 관리 기능을 제공합니다.
 */

/**
 * 블로그 컨텍스트 생성
 * 
 * 애플리케이션 전체에서 블로그 데이터를 공유하기 위한 컨텍스트를 생성합니다.
 */
const BlogContext = createContext();

/**
 * 블로그 컨텍스트를 사용하기 위한 커스텀 후크
 * 
 * 컴포넌트에서 블로그 컨텍스트에 쉽게 접근할 수 있도록 해주는 커스텀 후크입니다.
 * @returns {Object} 블로그 컨텍스트 값과 함수들
 */
export const useBlog = () => useContext(BlogContext);

/**
 * 블로그 컨텍스트 제공자 컴포넌트
 * 
 * 블로그 데이터와 관련 함수들을 애플리케이션 전체에 제공합니다.
 * @param {ReactNode} children - 컨텍스트 제공자 내부에 렌더링될 컴포넌트들
 * @returns {JSX.Element} 컨텍스트 제공자 컴포넌트
 */
export const BlogProvider = ({ children }) => {
  // 포스트 목록 상태
  const [posts, setPosts] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState(null);
  
  // 컴포넌트 마운트 시 포스트 목록 로드
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/660/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('포스트 로드 중 오류가 발생했습니다:', err);
        setError('포스트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  /**
   * 새 포스트 추가 함수
   * 
   * 제목과 내용을 받아 새 포스트를 생성하고 목록에 추가합니다.
   * 실제 API 호출은 PostWritePage에서 처리하고, 이 함수는 로컬 상태만 업데이트합니다.
   * 
   * @param {string} title - 포스트 제목
   * @param {string} content - 포스트 내용
   * @returns {Object} 생성된 새 포스트 객체
   */
  const addPost = (title, content) => {
    // 서버에서 반환된 새 포스트 데이터를 로컬 상태에 추가
    const refreshPosts = async () => {
      try {
        const response = await axiosInstance.get('/660/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('포스트 목록 새로고침 중 오류가 발생했습니다:', err);
      }
    };
    
    // 포스트 목록 새로고침
    refreshPosts();
    
    // 마지막으로 추가된 포스트 반환 (UI 업데이트용)
    return posts[posts.length - 1];
  };

  /**
   * 포스트 삭제 함수
   * 
   * 지정된 ID의 포스트를 목록에서 삭제합니다.
   * 실제 API 호출은 PostViewPage에서 처리하고, 이 함수는 로컬 상태만 업데이트합니다.
   * 
   * @param {number} postId - 삭제할 포스트의 ID
   */
  const deletePost = (postId) => {
    // 해당 ID의 포스트를 제외한 목록으로 업데이트
    setPosts(posts.filter((post) => post.id !== postId));
  };

  /**
   * 포스트에 댓글 추가 함수
   * 
   * 지정된 ID의 포스트에 새 댓글을 추가합니다.
   * 
   * @param {number} postId - 댓글을 추가할 포스트의 ID
   * @param {string} content - 댓글 내용
   * @param {string} author - 댓글 작성자
   * @param {number|null} userId - 댓글 작성자의 ID (로그인한 경우)
   */
  const addComment = async (postId, content, author, userId = null) => {
    try {
      // 현재 포스트 데이터 가져오기
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      // 새 댓글 객체 생성
      const newComment = {
        id: Date.now(), // 임시 ID 생성
        content,
        author,
        userId, // 사용자 ID 추가 (로그인한 경우에만 존재)
        createdAt: new Date().toISOString(),
      };
      
      // 포스트의 댓글 목록에 새 댓글 추가
      const updatedComments = [...(post.comments || []), newComment];
      
      // 서버에 업데이트된 포스트 전송
      await axiosInstance.put(`/660/posts/${postId}`, {
        ...post,
        comments: updatedComments
      });
      
      // 로컬 상태 업데이트
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      });
      
      setPosts(updatedPosts);
    } catch (err) {
      console.error('댓글 추가 중 오류가 발생했습니다:', err);
    }
  };

  /**
   * 댓글 삭제 함수
   * 
   * 지정된 포스트에서 특정 댓글을 삭제합니다.
   * 
   * @param {number} postId - 댓글이 있는 포스트의 ID
   * @param {number} commentId - 삭제할 댓글의 ID
   */
  const deleteComment = async (postId, commentId) => {
    try {
      // 현재 포스트 데이터 가져오기
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      // 해당 댓글을 제외한 댓글 목록 생성
      const updatedComments = post.comments.filter(comment => comment.id !== commentId);
      
      // 서버에 업데이트된 포스트 전송
      await axiosInstance.put(`/660/posts/${postId}`, {
        ...post,
        comments: updatedComments
      });
      
      // 로컬 상태 업데이트
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      });
      
      setPosts(updatedPosts);
    } catch (err) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', err);
    }
  };

  /**
   * ID로 포스트 가져오기 함수
   * 
   * 지정된 ID의 포스트를 찾아 반환합니다.
   * 
   * @param {string|number} postId - 찾을 포스트의 ID
   * @returns {Object|undefined} 찾은 포스트 객체 또는 찾지 못한 경우 undefined
   */
  const getPost = (postId) => {
    // 숫자로 변환한 ID와 일치하는 포스트 찾기
    return posts.find((post) => post.id === parseInt(postId));
  };

  // 컨텍스트를 통해 제공할 값과 함수들
  const value = {
    posts,        // 포스트 목록
    loading,      // 로딩 상태
    error,        // 에러 상태
    addPost,      // 포스트 추가 함수
    deletePost,   // 포스트 삭제 함수
    addComment,   // 댓글 추가 함수
    deleteComment, // 댓글 삭제 함수
    getPost,      // 포스트 조회 함수
    refreshPosts: async () => { // 포스트 목록 새로고침 함수
      try {
        setLoading(true);
        const response = await axiosInstance.get('/660/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('포스트 목록 새로고침 중 오류가 발생했습니다:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
