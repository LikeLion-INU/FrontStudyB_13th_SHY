import React from "react";
import styled, { css } from "styled-components";

const PostItemWrapper = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  ${props => props.$isDeleteMode && css`
    border: 2px solid #ff4d4d;
    background-color: #fff8f8;
    
    &:hover {
      background-color: #ffe8e8;
    }
  `}

  ${props => !props.$isDeleteMode && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `}
`;

const PostTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
`;

const PostAuthor = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
`;

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

function PostItem({ post, isDeleteMode = false, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  return (
    <PostItemWrapper $isDeleteMode={isDeleteMode} onClick={handleClick}>
      <PostTitle>{post.title}</PostTitle>
      <PostAuthor>작성자: {post.author}</PostAuthor>
      <PostContent>{post.content}</PostContent>
    </PostItemWrapper>
  );
}

export default PostItem;
