import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import { useBlog } from "../../context/BlogContext";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #27a745;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

function PostWritePage() {
  const navigate = useNavigate();
  const { addPost } = useBlog();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    
    const newPost = addPost(title, content);
    alert("글이 작성되었습니다.");
    navigate(`/post/${newPost.id}`);
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm("작성 중인 내용이 있습니다. 나가시겠습니까?")) {
        navigate("/");
      }
    } else {
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
