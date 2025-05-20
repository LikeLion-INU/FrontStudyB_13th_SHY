import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

/**
 * 포스트 수정 페이지 컴포넌트
 * 
 * 기존 블로그 글을 수정하기 위한 페이지입니다.
 * 제목과 내용을 수정하여 포스트를 업데이트합니다.
 */

/**
 * 페이지 전체를 감싸는 스타일드 컴포넌트
 */
const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

/**
 * 헤더 영역을 위한 스타일드 컴포넌트
 */
const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

/**
 * 페이지 제목을 위한 스타일드 컴포넌트
 */
const Title = styled.h2`
  font-size: 28px;
  color: #2d6cdf;
  margin-bottom: 16px;
`;

/**
 * 포스트 수정 폼을 위한 스타일드 컴포넌트
 */
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

/**
 * 버튼 그룹을 위한 스타일드 컴포넌트
 */
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 8px;
`;

/**
 * 에러 메시지를 위한 스타일드 컴포넌트
 */
const ErrorMessage = styled.div`
  color: #ff4d4d;
  margin-top: 16px;
  padding: 8px;
  background-color: #fff8f8;
  border-radius: 4px;
  border: 1px solid #ffdddd;
  text-align: center;
`;

/**
 * 포스트 수정 페이지 컴포넌트 함수
 * 
 * @returns {JSX.Element} 포스트 수정 페이지 UI를 렌더링합니다.
 */
function PostEditPage() {
  // URL 파라미터에서 포스트 ID를 가져옵니다.
  const { postId } = useParams();
  // 페이지 네비게이션을 위한 후크
  const navigate = useNavigate();
  // BlogContext에서 포스트 조회 함수를 가져옵니다.
  const { getPost } = useBlog();
  // AuthContext에서 사용자 정보를 가져옵니다.
  const { user } = useAuth();
  
  // 포스트 제목을 관리합니다.
  const [title, setTitle] = useState("");
  // 포스트 내용을 관리합니다.
  const [content, setContent] = useState("");
  // 에러 메시지를 관리합니다.
  const [error, setError] = useState("");
  // 로딩 상태를 관리합니다.
  const [isLoading, setIsLoading] = useState(false);
  // 포스트 데이터를 관리합니다.
  const [post, setPost] = useState(null);

  // 컴포넌트 마운트 시 포스트 데이터 로드
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 로컬 상태에서 포스트 데이터 가져오기
        const postData = getPost(parseInt(postId));
        
        if (!postData) {
          // 포스트가 없는 경우 에러 메시지 설정
          setError("포스트를 찾을 수 없습니다.");
          return;
        }
        
        // 현재 사용자가 포스트 작성자인지 확인
        if (user.id !== postData.userId) {
          // 작성자가 아닌 경우 메인 페이지로 리다이렉트
          alert("포스트 수정 권한이 없습니다.");
          navigate("/");
          return;
        }
        
        // 포스트 데이터 설정
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      } catch (err) {
        console.error("포스트 로드 중 오류가 발생했습니다:", err);
        setError("포스트를 불러오는 중 오류가 발생했습니다.");
      }
    };
    
    fetchPost();
  }, [postId, getPost, user, navigate]);

  /**
   * 폼 제출 핸들러
   * 
   * 입력된 제목과 내용을 검증하고 포스트를 업데이트합니다.
   * 
   * @param {Event} e - 폼 제출 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // 제목 유효성 검사
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    
    // 내용 유효성 검사
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 서버에 포스트 업데이트 요청
      await axiosInstance.put(`/660/posts/${postId}`, {
        ...post,
        title,
        content,
        updatedAt: new Date().toISOString()
      });
      
      // 성공 메시지 표시
      alert("글이 수정되었습니다.");
      
      // 포스트 상세 페이지로 이동
      navigate(`/post/${postId}`);
    } catch (err) {
      console.error("포스트 수정 중 오류가 발생했습니다:", err);
      setError("글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 취소 버튼 클릭 핸들러
   * 
   * 수정 중인 내용이 있는 경우 확인 후 포스트 상세 페이지로 이동합니다.
   */
  const handleCancel = () => {
    // 원래 데이터와 현재 입력 데이터가 다른 경우 확인
    if (title !== post?.title || content !== post?.content) {
      if (window.confirm("수정 중인 내용이 있습니다. 취소하시겠습니까?")) {
        navigate(`/post/${postId}`);
      }
    } else {
      navigate(`/post/${postId}`);
    }
  };

  // 포스트 로딩 중 또는 에러 발생 시 메시지 표시
  if (!post && !error) {
    return (
      <Wrapper>
        <Header>
          <Title>포스트 로딩 중...</Title>
        </Header>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>글 수정하기</Title>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <TextInput 
          label="제목" 
          placeholder="제목을 입력해주세요" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        
        <TextInput 
          label="내용" 
          placeholder="내용을 입력해주세요" 
          multiline 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        
        <ButtonContainer>
          <Button type="button" variant="secondary" onClick={handleCancel}>취소</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "수정 중..." : "수정하기"}
          </Button>
        </ButtonContainer>
      </Form>
    </Wrapper>
  );
}

export default PostEditPage;
