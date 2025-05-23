import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

/**
 * 포스트 상세 보기 페이지 컴포넌트
 * 
 * 개별 포스트의 상세 내용과 댓글 기능을 제공하는 페이지입니다.
 * 포스트 정보 조회, 댓글 작성 및 삭제 기능을 제공합니다.
 */

/**
 * 페이지 전체를 감싸는 스타일드 컴포넌트
 * 
 * 페이지 내용을 중앙에 배치하고 최대 너비를 제한합니다.
 */
const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

/**
 * 포스트 내용을 감싸는 스타일드 컴포넌트
 * 
 * 포스트 제목, 메타 정보, 내용을 포함하는 컨테이너입니다.
 */
const PostContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 32px;
`;

/**
 * 포스트 헤더 영역을 위한 스타일드 컴포넌트
 * 
 * 포스트 제목과 메타 정보를 포함합니다.
 */
const PostHeader = styled.div`
  margin-bottom: 24px;
`;

/**
 * 포스트 제목을 위한 스타일드 컴포넌트
 */
const PostTitle = styled.h1`
  font-size: 28px;
  color: #2d6cdf;
  margin-bottom: 8px;
`;

/**
 * 포스트 메타 정보를 위한 스타일드 컴포넌트
 * 
 * 작성자와 작성일 정보를 표시합니다.
 */
const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
`;

/**
 * 포스트 내용을 위한 스타일드 컴포넌트
 * 
 * 줄바꿈과 공백을 유지하면서 포스트 내용을 표시합니다.
 */
const PostContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

/**
 * 댓글 영역을 감싸는 스타일드 컴포넌트
 */
const CommentsContainer = styled.div`
  margin-top: 40px;
`;

/**
 * 댓글 섹션 제목을 위한 스타일드 컴포넌트
 */
const CommentsTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`;

/**
 * 댓글 작성 폼을 위한 스타일드 컴포넌트
 */
const CommentForm = styled.form`
  margin-bottom: 24px;
`;

/**
 * 댓글 목록을 위한 스타일드 컴포넌트
 * 
 * 댓글들을 세로로 배치하고 간격을 설정합니다.
 */
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/**
 * 개별 댓글 아이템을 위한 스타일드 컴포넌트
 */
const CommentItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  position: relative;
`;

/**
 * 댓글 헤더를 위한 스타일드 컴포넌트
 * 
 * 작성자와 작성일 정보를 표시합니다.
 */
const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-right: 30px; 
`;

/**
 * 댓글 작성자 정보를 위한 스타일드 컴포넌트
 */
const CommentAuthor = styled.span`
  font-weight: 500;
  color: #444;
`;

/**
 * 댓글 작성일 정보를 위한 스타일드 컴포넌트
 */
const CommentDate = styled.span`
  font-size: 12px;
  color: #777;
`;

/**
 * 댓글 내용을 위한 스타일드 컴포넌트
 */
const CommentContent = styled.p`
  margin: 0;
  color: #555;
`;

/**
 * 댓글 삭제 버튼을 위한 스타일드 컴포넌트
 * 
 * 댓글 상자 오른쪽 상단에 위치하며, 호버 시 불투명도가 증가합니다.
 */
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

/**
 * 뒤로가기 버튼 영역을 위한 스타일드 컴포넌트
 */
const BackButton = styled.div`
  margin-bottom: 24px;
`;

/**
 * 빈 댓글 메시지를 위한 스타일드 컴포넌트
 * 
 * 댓글이 없을 때 표시되는 메시지의 스타일을 정의합니다.
 */
const EmptyComments = styled.p`
  color: #666;
  font-style: italic;
  text-align: center;
  margin: 24px 0;
`;

/**
 * 포스트 액션 버튼 영역을 위한 스타일드 컴포넌트
 */
const PostActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

/**
 * 포스트 상세 보기 페이지 컴포넌트 함수
 * 
 * 개별 포스트의 상세 내용과 댓글 기능을 관리합니다.
 * @returns {JSX.Element} 포스트 상세 페이지 UI를 렌더링합니다.
 */
function PostViewPage() {
  // URL 파라미터에서 포스트 ID를 가져옵니다.
  const { postId } = useParams();
  // 페이지 네비게이션을 위한 후크
  const navigate = useNavigate();
  // BlogContext에서 포스트 조회, 댓글 추가 및 삭제 함수를 가져옵니다.
  const { getPost, addComment, deleteComment, deletePost } = useBlog();
  // AuthContext에서 사용자 정보를 가져옵니다.
  const { user } = useAuth();
  // 현재 포스트 정보를 관리합니다.
  const [post, setPost] = useState(null);
  // 댓글 내용을 관리합니다.
  const [commentContent, setCommentContent] = useState("");
  // 댓글 작성자를 관리합니다.
  const [commentAuthor, setCommentAuthor] = useState("");

  /**
   * 페이지 로드 시 포스트 정보를 가져오는 효과
   * 
   * URL에서 가져온 postId를 사용하여 해당 포스트를 찾아서 상태로 저장합니다.
   * 포스트가 없는 경우 알림을 표시하고 메인 페이지로 이동합니다.
   */
  useEffect(() => {
    // 서버에서 직접 포스트 정보를 가져옵니다.
    const fetchPost = async () => {
      try {
        // 서버에서 해당 ID의 포스트를 가져옵니다.
        const response = await axiosInstance.get(`/660/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('포스트 조회 중 오류가 발생했습니다:', error);
        // API 오류가 발생한 경우, 로컬 상태에서 포스트를 찾아봅니다.
        const foundPost = getPost(postId);
        if (foundPost) {
          setPost(foundPost);
        } else {
          alert('글을 찾을 수 없습니다.');
          navigate('/');
        }
      }
    };
    
    fetchPost();
  }, [postId, getPost, navigate]);

  /**
   * 댓글 작성 폼 제출 핸들러
   * 
   * 새 댓글을 추가하고 폼을 초기화합니다.
   * 
   * @param {Event} e - 폼 제출 이벤트 객체
   */
  const handleCommentSubmit = async (e) => {
    // 폼 기본 제출 동작 방지
    e.preventDefault();
    
    // 댓글 내용이 비어있는지 확인
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    
    // 작성자가 비어있으면 기본값 '방문자'로 설정
    const author = commentAuthor.trim() || "방문자";
    // 새 댓글 추가 (로그인한 경우 사용자 ID 포함)
    const userId = user ? user.id : null;
    
    try {
      // 댓글 추가 후 서버에서 최신 데이터 가져오기
      await addComment(parseInt(postId), commentContent, author, userId);
      
      // 입력 필드 초기화
      setCommentContent("");
      setCommentAuthor("");
      
      // 서버에서 최신 포스트 정보 가져오기
      const response = await axiosInstance.get(`/660/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error('댓글 추가 중 오류가 발생했습니다:', error);
      alert('댓글 추가 중 오류가 발생했습니다.');
    }
  };

  /**
   * 댓글 삭제 버튼 클릭 핸들러
   * 
   * 삭제 확인 후 댓글을 삭제하고 포스트 정보를 업데이트합니다.
   * 
   * @param {number} commentId - 삭제할 댓글의 ID
   */
  const handleCommentDelete = async (commentId) => {
    // 삭제 확인 대화상자 표시
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        // 댓글 삭제 실행
        await deleteComment(parseInt(postId), commentId);
        
        // 서버에서 최신 포스트 정보 가져오기
        const response = await axiosInstance.get(`/660/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('댓글 삭제 중 오류가 발생했습니다:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  /**
   * 날짜 포맷팅 함수
   * 
   * 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환합니다.
   * 
   * @param {string} dateString - 포맷팅할 날짜 문자열
   * @returns {string} 'YYYY-MM-DD' 형식의 날짜 문자열
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  /**
   * 포스트 수정 버튼 클릭 핸들러
   * 
   * 포스트 수정 페이지로 이동합니다.
   */
  const handleEditPost = () => {
    navigate(`/post-edit/${postId}`);
  };

  /**
   * 포스트 삭제 버튼 클릭 핸들러
   * 
   * 삭제 확인 후 포스트를 삭제하고 메인 페이지로 이동합니다.
   */
  const handleDeletePost = async () => {
    // 사용자 인증 및 게시글 소유자 검증
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    // 게시글 소유자 검증
    if (user.id !== post.userId) {
      alert('자신이 작성한 글만 삭제할 수 있습니다.');
      return;
    }
    
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        // 서버에 삭제 요청
        await axiosInstance.delete(`/660/posts/${postId}`);
        
        // 로컬 상태 업데이트
        deletePost(parseInt(postId));
        
        alert('글이 삭제되었습니다.');
        navigate('/');
      } catch (error) {
        console.error('포스트 삭제 중 오류가 발생했습니다:', error);
        alert('글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 포스트 데이터가 아직 로드되지 않았으면 아무것도 렌더링하지 않습니다.
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
        
        {/* 포스트 소유자인 경우에만 수정/삭제 버튼 표시 */}
        {user && post.userId && user.id === post.userId && (
          <PostActions>
            <Button variant="secondary" onClick={handleEditPost}>수정</Button>
            <Button variant="danger" onClick={handleDeletePost}>삭제</Button>
          </PostActions>
        )}
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
                {/* 댓글 작성자인 경우에만 삭제 버튼 표시 */}
                {(user && comment.userId && parseInt(user.id) === parseInt(comment.userId)) && (
                  <DeleteButton onClick={() => handleCommentDelete(comment.id)}>
                    삭제
                  </DeleteButton>
                )}
              </CommentItem>
            ))
          )}
        </CommentList>
      </CommentsContainer>
    </Wrapper>
  );
}

export default PostViewPage;
