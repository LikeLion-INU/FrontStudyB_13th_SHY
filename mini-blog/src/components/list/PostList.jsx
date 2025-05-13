import React from "react";
import styled from "styled-components";
import PostItem from "./PostItem";
import { useBlog } from "../../context/BlogContext";

const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 32px;
`;

const DeleteModeMessage = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 500;
`;

function PostList({ isDeleteMode = false, onPostSelect }) {
  const { posts } = useBlog();

  if (posts.length === 0) {
    return <EmptyMessage>작성된 글이 없습니다. 첫 글을 작성해보세요!</EmptyMessage>;
  }

  const handlePostClick = (post) => {
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
