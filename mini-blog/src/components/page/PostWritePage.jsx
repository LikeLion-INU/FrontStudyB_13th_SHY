import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

/**
 * 포스트 작성 페이지 컴포넌트
 * 
 * 새로운 블로그 글을 작성하기 위한 페이지입니다.
 * 제목과 내용을 입력받아 새 포스트를 생성합니다.
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
  color: #27a745;
  margin-bottom: 16px;
`;

/**
 * 포스트 작성 폼을 위한 스타일드 컴포넌트
 * 
 * 입력 필드들을 세로로 배치합니다.
 */
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

/**
 * 버튼 그룹을 위한 스타일드 컴포넌트
 * 
 * 취소와 저장하기 버튼을 오른쪽에 배치합니다.
 */
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

/**
 * 포스트 작성 페이지 컴포넌트 함수
 * 
 * 새로운 블로그 글을 작성하기 위한 페이지를 구성합니다.
 * @returns {JSX.Element} 포스트 작성 페이지 UI를 렌더링합니다.
 */
function PostWritePage() {
  // 페이지 네비게이션을 위한 후크
  const navigate = useNavigate();
  // BlogContext에서 포스트 추가 함수를 가져옵니다.
  const { addPost } = useBlog();
  // AuthContext에서 사용자 정보를 가져옵니다.
  const { user } = useAuth();
  // 포스트 제목을 관리합니다.
  const [title, setTitle] = useState("");
  // 포스트 내용을 관리합니다.
  const [content, setContent] = useState("");

  /**
   * 폼 제출 핸들러
   * 
   * 입력된 제목과 내용을 검증하고 새 포스트를 추가합니다.
   * 생성된 포스트의 상세 페이지로 이동합니다.
   * 
   * @param {Event} e - 폼 제출 이벤트 객체
   */
  const handleSubmit = async (e) => {
    // 폼 기본 제출 동작 방지
    e.preventDefault();
    
    // 제목 유효성 검사
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    // 내용 유효성 검사
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    
    try {
      // 사용자 정보 확인
      if (!user) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      
      // 서버에 포스트 생성 요청 (userId 포함)
      await axiosInstance.post('/660/posts', {
        title,
        content,
        userId: user.id,
        author: user.email,
        createdAt: new Date().toISOString(),
        comments: []
      });
      
      // 새 포스트 추가 (로컬 상태 업데이트)
      const newPost = addPost(title, content);
      
      // 성공 메시지 표시
      alert("글이 작성되었습니다.");
      
      // 생성된 포스트의 상세 페이지로 이동
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("포스트 작성 중 오류가 발생했습니다:", error);
      alert("글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  /**
   * 취소 버튼 클릭 핸들러
   * 
   * 작성 중인 내용이 있는 경우 확인 후 메인 페이지로 이동합니다.
   * 작성 중인 내용이 없는 경우 바로 메인 페이지로 이동합니다.
   */
  const handleCancel = () => {
    // 작성 중인 내용이 있는지 확인
    if (title.trim() || content.trim()) {
      // 작성 중인 내용이 있는 경우 확인 대화상자 표시
      if (window.confirm("작성 중인 내용이 있습니다. 나가시겠습니까?")) {
        navigate("/");
      }
    } else {
      // 작성 중인 내용이 없는 경우 바로 메인 페이지로 이동
      navigate("/");
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>글 작성하기</Title>
      </Header>
      
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
          <Button type="submit">저장하기</Button>
        </ButtonContainer>
      </Form>
    </Wrapper>
  );
}

export default PostWritePage;
