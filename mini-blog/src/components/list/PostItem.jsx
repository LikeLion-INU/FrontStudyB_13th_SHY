import React from "react";
import styled, { css } from "styled-components";

/**
 * 포스트 아이템 컴포넌트
 * 
 * 개별 포스트를 표시하는 컴포넌트입니다.
 * 일반 모드와 삭제 모드에 따라 다른 스타일을 적용합니다.
 */

/**
 * 포스트 아이템을 감싸는 스타일드 컴포넌트
 * 
 * 포스트 아이템의 기본 스타일과 호버 효과를 정의합니다.
 * 삭제 모드에 따라 다른 스타일을 적용합니다.
 */
const PostItemWrapper = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  /* 삭제 모드일 때 적용되는 스타일 */
  ${props => props.$isDeleteMode && css`
    border: 2px solid #ff4d4d;
    background-color: #fff8f8;
    
    &:hover {
      background-color: #ffe8e8;
    }
  `}

  /* 일반 모드일 때 적용되는 호버 효과 */
  ${props => !props.$isDeleteMode && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `}
`;

/**
 * 포스트 제목을 위한 스타일드 컴포넌트
 */
const PostTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
`;

/**
 * 포스트 메타 정보(작성자, 날짜)를 위한 스타일드 컴포넌트
 */
const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
`;

/**
 * 포스트 작성자 정보를 위한 스타일드 컴포넌트
 */
const PostAuthor = styled.span`
  font-weight: 500;
`;

/**
 * 포스트 작성일 정보를 위한 스타일드 컴포넌트
 */
const PostDate = styled.span`
  color: #888;
`;

/**
 * 포스트 내용을 위한 스타일드 컴포넌트
 * 
 * 포스트 내용을 2줄로 제한하고 너무 긴 경우 줄임표(...)를 표시합니다.
 */
const PostContent = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

/**
 * 포스트 아이템 컴포넌트 함수
 * 
 * @param {Object} post - 포스트 데이터 객체 (제목, 작성자, 내용 등을 포함)
 * @param {boolean} isDeleteMode - 삭제 모드 활성화 여부 (기본값: false)
 * @param {Function} onClick - 포스트 클릭 시 호출될 콜백 함수
 * @returns {JSX.Element} 포스트 아이템 UI를 렌더링합니다.
 */
function PostItem({ post, isDeleteMode = false, onClick }) {
  // useAuth는 필요하지 않으므로 제거
  // const { user, isOwner } = useAuth();
  /**
   * 포스트 클릭 핸들러 함수
   * 
   * 클릭 이벤트가 발생했을 때 onClick 콜백을 호출합니다.
   */
  const handleClick = () => {
    // onClick prop이 존재하는 경우에만 호출합니다.
    if (onClick) {
      onClick(post);
    }
  };
  
  /**
   * 날짜 포맷팅 함수
   * 
   * ISO 문자열 날짜를 YYYY-MM-DD 형식으로 변환합니다.
   * 
   * @param {string} dateString - ISO 형식의 날짜 문자열
   * @returns {string} 포맷팅된 날짜 문자열
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <PostItemWrapper $isDeleteMode={isDeleteMode} onClick={handleClick}>
      <PostTitle>{post.title}</PostTitle>
      <PostMeta>
        <PostAuthor>{post.author || '익명'}</PostAuthor>
        <PostDate>{formatDate(post.createdAt)}</PostDate>
      </PostMeta>
      <PostContent>{post.content}</PostContent>
    </PostItemWrapper>
  );
}

export default PostItem;
