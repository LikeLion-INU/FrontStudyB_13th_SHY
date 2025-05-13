import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PostList from "../list/PostList";
import Button from "../ui/Button";
import { useBlog } from "../../context/BlogContext";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

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

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
`;

const ModalText = styled.p`
  margin-bottom: 24px;
  color: #555;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

function MainPage() {
  const navigate = useNavigate();
  const { posts, deletePost } = useBlog();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleWriteClick = () => {
    navigate("/post-write");
  };

  const handleDeleteClick = () => {
    if (posts.length === 0) {
      alert("삭제할 글이 없습니다.");
      return;
    }
    
    setIsDeleteMode(true);
    alert("삭제할 글을 클릭해주세요.");
  };

  const handlePostSelect = (post) => {
    if (isDeleteMode) {
      setSelectedPost(post);
      setShowConfirmModal(true);
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPost) {
      deletePost(selectedPost.id);
      setShowConfirmModal(false);
      setIsDeleteMode(false);
      setSelectedPost(null);
      alert("글이 삭제되었습니다.");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setIsDeleteMode(false);
    setSelectedPost(null);
  };

  return (
    <Wrapper>
      <Header>
        <Title>성호영의 개인 블로그</Title>
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
