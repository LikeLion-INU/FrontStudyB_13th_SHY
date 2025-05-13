import React from "react";
import styled from "styled-components";
import PostItem from "./PostItem";
import { useBlog } from "../../context/BlogContext";

/**
 * 포스트 목록 컴포넌트
 * 
 * 블로그의 포스트 목록을 표시하는 컴포넌트입니다.
 * 삭제 모드와 일반 모드를 지원합니다.
 */

/**
 * 포스트 목록을 감싸는 스타일드 컴포넌트
 * 
 * 포스트 아이템들을 세로로 배치하고 간격을 설정합니다.
 */
const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

/**
 * 빈 목록 메시지를 위한 스타일드 컴포넌트
 * 
 * 포스트가 없을 때 표시되는 메시지의 스타일을 정의합니다.
 */
const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 32px;
`;

/**
 * 삭제 모드 안내 메시지를 위한 스타일드 컴포넌트
 * 
 * 삭제 모드가 활성화되었을 때 표시되는 안내 메시지의 스타일을 정의합니다.
 */
const DeleteModeMessage = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 500;
`;

/**
 * PostList 컴포넌트 함수
 * 
 * @param {boolean} isDeleteMode - 삭제 모드 활성화 여부 (기본값: false)
 * @param {Function} onPostSelect - 포스트 선택 시 호출될 콜백 함수
 * @returns {JSX.Element} 포스트 목록 또는 빈 메시지를 렌더링합니다.
 */
function PostList({ isDeleteMode = false, onPostSelect }) {
  // BlogContext에서 포스트 목록을 가져옵니다.
  const { posts } = useBlog();

  // 포스트가 없는 경우 빈 메시지를 표시합니다.
  if (posts.length === 0) {
    return <EmptyMessage>작성된 글이 없습니다. 첫 글을 작성해보세요!</EmptyMessage>;
  }

  /**
   * 포스트 클릭 핸들러 함수
   * 
   * @param {Object} post - 클릭된 포스트 객체
   */
  const handlePostClick = (post) => {
    // onPostSelect prop이 존재하는 경우에만 호출합니다.
    if (onPostSelect) {
      onPostSelect(post);
    }
  };

  return (
    <>
      {isDeleteMode && (
        <DeleteModeMessage>
          삭제할 글을 클릭해주세요
        </DeleteModeMessage>
      )}
      <PostListWrapper>
        {posts.map((post) => (
          <PostItem 
            key={post.id} 
            post={post} 
            isDeleteMode={isDeleteMode}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </PostListWrapper>
    </>
  );
}

export default PostList;
