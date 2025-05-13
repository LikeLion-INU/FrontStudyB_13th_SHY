import React, { createContext, useState, useContext } from "react";
import initialPosts from "../data/posts";

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
  const [posts, setPosts] = useState(initialPosts);
  // 다음 포스트 ID 관리
  const [nextId, setNextId] = useState(initialPosts.length + 1);
  // 다음 댓글 ID 관리
  const [nextCommentId, setNextCommentId] = useState(1);

  /**
   * 새 포스트 추가 함수
   * 
   * 제목과 내용을 받아 새 포스트를 생성하고 목록에 추가합니다.
   * 
   * @param {string} title - 포스트 제목
   * @param {string} content - 포스트 내용
   * @returns {Object} 생성된 새 포스트 객체
   */
  const addPost = (title, content) => {
    // 새 포스트 객체 생성
    const newPost = {
      id: nextId,
      title,
      content,
      author: "성호영",
      createdAt: new Date().toISOString(),
      comments: [],
    };
    // 포스트 목록에 추가
    setPosts([...posts, newPost]);
    // 다음 포스트 ID 증가
    setNextId(nextId + 1);
    return newPost;
  };

  /**
   * 포스트 삭제 함수
   * 
   * 지정된 ID의 포스트를 목록에서 삭제합니다.
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
   * @param {string} author - 댓글 작성자 (기본값: "방문자")
   */
  const addComment = (postId, content, author = "방문자") => {
    // 모든 포스트를 순회하며 해당 포스트에만 댓글 추가
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        // 새 댓글 객체 생성
        const newComment = {
          id: nextCommentId,
          content,
          author,
          createdAt: new Date().toISOString(),
        };
        // 해당 포스트의 댓글 목록에 새 댓글 추가
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    // 업데이트된 포스트 목록 적용
    setPosts(updatedPosts);
    // 다음 댓글 ID 증가
    setNextCommentId(nextCommentId + 1);
  };

  /**
   * 댓글 삭제 함수
   * 
   * 지정된 포스트에서 특정 댓글을 삭제합니다.
   * 
   * @param {number} postId - 댓글이 있는 포스트의 ID
   * @param {number} commentId - 삭제할 댓글의 ID
   */
  const deleteComment = (postId, commentId) => {
    // 모든 포스트를 순회하며 해당 포스트의 댓글만 삭제
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        // 해당 포스트의 댓글 중 지정된 ID의 댓글을 제외
        return {
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        };
      }
      return post;
    });
    // 업데이트된 포스트 목록 적용
    setPosts(updatedPosts);
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
    addPost,      // 포스트 추가 함수
    deletePost,   // 포스트 삭제 함수
    addComment,   // 댓글 추가 함수
    deleteComment, // 댓글 삭제 함수
    getPost,      // 포스트 조회 함수
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
