import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PostList from "../list/PostList";
import Button from "../ui/Button";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

/**
 * 메인 페이지 컴포넌트
 * 
 * 블로그의 메인 페이지를 구성하는 컴포넌트입니다.
 * 포스트 목록 조회, 글 작성, 글 삭제 기능을 제공합니다.
 */

/**
 * 메인 페이지 전체를 감싸는 스타일드 컴포넌트
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
  margin-bottom: 40px;
`;

/**
 * 네비게이션 바를 위한 스타일드 컴포넌트
 */
const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
`;

/**
 * 로고 영역을 위한 스타일드 컴포넌트
 */
const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2d6cdf;
`;

/**
 * 사용자 정보 영역을 위한 스타일드 컴포넌트
 */
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/**
 * 사용자 이메일 표시를 위한 스타일드 컴포넌트
 */
const UserEmail = styled.span`
  color: #555;
  font-size: 14px;
`;

/**
 * 메인 페이지 제목을 위한 스타일드 컴포넌트
 */
const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
`;

/**
 * 버튼 그룹을 위한 스타일드 컴포넌트
 * 
 * 글 작성하기와 글 삭제하기 버튼을 오른쪽에 배치합니다.
 */
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

/**
 * 모달 배경을 위한 스타일드 컴포넌트
 * 
 * 모달이 표시될 때 화면 전체를 어둡게 마스킹하는 배경을 제공합니다.
 */
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

/**
 * 모달 컨텐츠를 위한 스타일드 컴포넌트
 * 
 * 모달 내용을 포함하는 화이트 박스를 정의합니다.
 */
const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

/**
 * 모달 제목을 위한 스타일드 컴포넌트
 */
const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
`;

/**
 * 모달 내용 텍스트를 위한 스타일드 컴포넌트
 */
const ModalText = styled.p`
  margin-bottom: 24px;
  color: #555;
`;

/**
 * 모달 버튼 그룹을 위한 스타일드 컴포넌트
 * 
 * 모달 내의 버튼들을 오른쪽에 배치하고 간격을 설정합니다.
 */
const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

/**
 * 메인 페이지 컴포넌트 함수
 * 
 * 블로그의 메인 페이지를 구성하며, 포스트 목록 조회, 생성, 삭제 기능을 관리합니다.
 * @returns {JSX.Element} 메인 페이지 UI를 렌더링합니다.
 */
function MainPage() {
  // 페이지 네비게이션을 위한 후크
  const navigate = useNavigate();
  // BlogContext에서 포스트 목록과 삭제 함수를 가져옵니다.
  const { posts, deletePost } = useBlog();
  // AuthContext에서 사용자 정보와 로그아웃 함수를 가져옵니다.
  const { user, logout } = useAuth();
  // 삭제 모드 상태를 관리합니다.
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  // 확인 모달 표시 여부를 관리합니다.
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // 선택된 포스트 정보를 관리합니다.
  const [selectedPost, setSelectedPost] = useState(null);

  /**
   * 글 작성하기 버튼 클릭 핸들러
   * 
   * 글 작성 페이지로 이동합니다.
   */
  const handleWriteClick = () => {
    navigate("/post-write");
  };

  /**
   * 글 삭제하기 버튼 클릭 핸들러
   * 
   * 삭제 모드를 활성화하고 사용자에게 안내 메시지를 표시합니다.
   * 포스트가 없는 경우 알림을 표시합니다.
   */
  const handleDeleteClick = () => {
    // 포스트가 없는 경우 알림 표시 후 함수 종료
    if (posts.length === 0) {
      alert("삭제할 글이 없습니다.");
      return;
    }
    
    // 삭제 모드 활성화
    setIsDeleteMode(true);
    alert("삭제할 글을 클릭해주세요.");
  };

  /**
   * 포스트 선택 핸들러
   * 
   * 삭제 모드일 경우 확인 모달을 표시하고, 일반 모드일 경우 해당 포스트 상세 페이지로 이동합니다.
   * 
   * @param {Object} post - 선택된 포스트 객체
   */
  const handlePostSelect = (post) => {
    if (isDeleteMode) {
      // 삭제 모드에서는 선택된 포스트를 저장하고 확인 모달 표시
      setSelectedPost(post);
      setShowConfirmModal(true);
    } else {
      // 일반 모드에서는 해당 포스트 상세 페이지로 이동
      navigate(`/post/${post.id}`);
    }
  };

  /**
   * 삭제 확인 버튼 클릭 핸들러
   * 
   * 선택된 포스트를 삭제하고 관련 상태를 초기화합니다.
   */
  const handleConfirmDelete = async () => {
    if (selectedPost) {
      // 사용자 인증 확인
      if (!user) {
        alert('로그인이 필요합니다.');
        setShowConfirmModal(false);
        setIsDeleteMode(false);
        setSelectedPost(null);
        return;
      }
      
      // 게시글 소유자 검증
      if (user.id !== selectedPost.userId) {
        alert('자신이 작성한 글만 삭제할 수 있습니다.');
        setShowConfirmModal(false);
        setIsDeleteMode(false);
        setSelectedPost(null);
        return;
      }
      
      try {
        // 서버에 삭제 요청
        await axiosInstance.delete(`/660/posts/${selectedPost.id}`);
        
        // 로컬 상태 업데이트
        deletePost(selectedPost.id);
        
        // 모달 및 삭제 모드 초기화
        setShowConfirmModal(false);
        setIsDeleteMode(false);
        setSelectedPost(null);
        
        // 삭제 완료 알림 표시
        alert("글이 삭제되었습니다.");
      } catch (error) {
        console.error('포스트 삭제 중 오류가 발생했습니다:', error);
        alert('글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  /**
   * 삭제 취소 버튼 클릭 핸들러
   * 
   * 삭제 모달을 닫고 관련 상태를 초기화합니다.
   */
  const handleCancelDelete = () => {
    // 모달 및 삭제 모드 초기화
    setShowConfirmModal(false);
    setIsDeleteMode(false);
    setSelectedPost(null);
  };

  /**
   * 로그아웃 핸들러
   * 
   * 사용자를 로그아웃 처리하고 로그인 페이지로 리다이렉트합니다.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Wrapper>
      <NavBar>
        <Logo>미니 블로그</Logo>
        <UserInfo>
          <UserEmail>{user?.email}</UserEmail>
          <Button variant="secondary" onClick={handleLogout}>로그아웃</Button>
        </UserInfo>
      </NavBar>
      
      <Header>
        <Title>{user?.email}의 미니 블로그</Title>
      </Header>
      
      <ButtonContainer>
        <Button onClick={handleWriteClick} disabled={isDeleteMode}>글 작성하기</Button>
        {isDeleteMode ? (
          <Button variant="secondary" onClick={() => setIsDeleteMode(false)}>삭제 취소</Button>
        ) : (
          <Button variant="danger" onClick={handleDeleteClick}>글 삭제하기</Button>
        )}
      </ButtonContainer>
      
      <PostList isDeleteMode={isDeleteMode} onPostSelect={handlePostSelect} />

      {showConfirmModal && (
        <ModalBackdrop>
          <ModalContent>
            <ModalTitle>글 삭제 확인</ModalTitle>
            <ModalText>
              '{selectedPost?.title}' 글을 삭제하시겠습니까?
            </ModalText>
            <ModalButtonContainer>
              <Button variant="secondary" onClick={handleCancelDelete}>취소</Button>
              <Button variant="danger" onClick={handleConfirmDelete}>삭제</Button>
            </ModalButtonContainer>
          </ModalContent>
        </ModalBackdrop>
      )}
    </Wrapper>
  );
}

export default MainPage;
