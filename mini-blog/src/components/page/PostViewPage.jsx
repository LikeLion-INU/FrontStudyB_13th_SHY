import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import { useBlog } from "../../context/BlogContext";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PostContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 32px;
`;

const PostHeader = styled.div`
  margin-bottom: 24px;
`;

const PostTitle = styled.h1`
  font-size: 28px;
  color: #2d6cdf;
  margin-bottom: 8px;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
`;

const PostContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const CommentsContainer = styled.div`
  margin-top: 40px;
`;

const CommentsTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`;

const CommentForm = styled.form`
  margin-bottom: 24px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  position: relative;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-right: 30px; 
`;

const CommentAuthor = styled.span`
  font-weight: 500;
  color: #444;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: #777;
`;

const CommentContent = styled.p`
  margin: 0;
  color: #555;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding-left: 20px;
  margin-left: 10px;
  border-left: 1px solid #eee;
  
  &:hover {
    opacity: 1;
  }
`;

const BackButton = styled.div`
  margin-bottom: 24px;
`;

const EmptyComments = styled.p`
  color: #666;
  font-style: italic;
  text-align: center;
  margin: 24px 0;
`;

function PostViewPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getPost, addComment, deleteComment } = useBlog();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  useEffect(() => {
    const foundPost = getPost(postId);
    if (foundPost) {
      setPost(foundPost);
    } else {
      alert("글을 찾을 수 없습니다.");
      navigate("/");
    }
  }, [postId, getPost, navigate]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    
    const author = commentAuthor.trim() || "방문자";
    addComment(parseInt(postId), commentContent, author);
    setCommentContent("");
    setCommentAuthor("");
    
    // Update the post state to reflect the new comment
    setPost(getPost(postId));
  };

  const handleCommentDelete = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(parseInt(postId), commentId);
      // Update the post state to reflect the deleted comment
      setPost(getPost(postId));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  if (!post) {
    return null;
  }

  return (
    <Wrapper>
      <BackButton>
        <Button variant="secondary" onClick={() => navigate("/")}>
          뒤로 가기
        </Button>
      </BackButton>
      
      <PostContainer>
        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <span>작성자: {post.author}</span>
            <span>작성일: {formatDate(post.createdAt)}</span>
          </PostMeta>
        </PostHeader>
        
        <PostContent>{post.content}</PostContent>
      </PostContainer>
      
      <CommentsContainer>
        <CommentsTitle>댓글</CommentsTitle>
        
        <CommentForm onSubmit={handleCommentSubmit}>
          <TextInput 
            label="이름" 
            placeholder="이름을 입력해주세요 (선택사항)" 
            value={commentAuthor} 
            onChange={(e) => setCommentAuthor(e.target.value)} 
          />
          
          <TextInput 
            label="댓글" 
            placeholder="댓글을 입력해주세요" 
            multiline 
            value={commentContent} 
            onChange={(e) => setCommentContent(e.target.value)} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button type="submit">댓글 작성</Button>
          </div>
        </CommentForm>
        
        <CommentList>
          {post.comments.length === 0 ? (
            <EmptyComments>아직 댓글이 없습니다. 처음으로 댓글을 남겨보세요!</EmptyComments>
          ) : (
            post.comments.map((comment) => (
              <CommentItem key={comment.id}>
                <CommentHeader>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                </CommentHeader>
                <CommentContent>{comment.content}</CommentContent>
                <DeleteButton onClick={() => handleCommentDelete(comment.id)}>
                  삭제
                </DeleteButton>
              </CommentItem>
            ))
          )}
        </CommentList>
      </CommentsContainer>
    </Wrapper>
  );
}

export default PostViewPage;
