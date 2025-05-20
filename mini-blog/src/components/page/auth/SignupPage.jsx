import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../ui/Button";
import TextInput from "../../ui/TextInput";
import { useAuth } from "../../../context/AuthContext";

/**
 * 회원가입 페이지 컴포넌트
 * 
 * 새 사용자 등록 기능을 제공하는 페이지입니다.
 * 이메일과 비밀번호를 입력받아 회원가입을 처리합니다.
 */

/**
 * 페이지 전체를 감싸는 스타일드 컴포넌트
 */
const Wrapper = styled.div`
  max-width: 500px;
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
 * 회원가입 폼을 위한 스타일드 컴포넌트
 */
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

/**
 * 버튼 그룹을 위한 스타일드 컴포넌트
 */
const ButtonContainer = styled.div`
  margin-top: 24px;
`;

/**
 * 로그인 링크 컨테이너
 */
const LoginLinkContainer = styled.div`
  margin-top: 16px;
  text-align: center;
`;

/**
 * 로그인 링크 스타일
 */
const LoginLink = styled(Link)`
  color: #2d6cdf;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
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
 * 회원가입 페이지 컴포넌트 함수
 * 
 * @returns {JSX.Element} 회원가입 페이지 UI를 렌더링합니다.
 */
function SignupPage() {
  // 페이지 네비게이션을 위한 후크
  const navigate = useNavigate();
  // 인증 컨텍스트에서 회원가입 함수와 인증 상태를 가져옵니다.
  const { register, isAuthenticated } = useAuth();
  
  // 이메일과 비밀번호 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  /**
   * 폼 제출 핸들러
   * 
   * 입력된 이메일과 비밀번호를 검증하고 회원가입을 시도합니다.
   * 
   * @param {Event} e - 폼 제출 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // 이메일 유효성 검사
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    
    // 비밀번호 유효성 검사
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    
    // 비밀번호 길이 검사
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    
    // 비밀번호 확인 일치 검사
    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    
    try {
      setIsLoading(true);
      // 회원가입 시도
      const result = await register(email, password);
      
      if (result.success) {
        // 회원가입 성공 시 메인 페이지로 이동
        navigate("/");
      } else {
        // 회원가입 실패 시 에러 메시지 표시
        setError(result.error);
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>회원가입</Title>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        <TextInput 
          label="이메일" 
          placeholder="이메일을 입력해주세요" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <TextInput 
          label="비밀번호" 
          placeholder="비밀번호를 입력해주세요" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <TextInput 
          label="비밀번호 확인" 
          placeholder="비밀번호를 다시 입력해주세요" 
          type="password"
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonContainer>
          <Button 
            type="submit" 
            fullWidth={true}
            disabled={isLoading}
          >
            {isLoading ? "회원가입 중..." : "회원가입"}
          </Button>
        </ButtonContainer>
        
        <LoginLinkContainer>
          이미 계정이 있으신가요? <LoginLink to="/login">로그인</LoginLink>
        </LoginLinkContainer>
      </Form>
    </Wrapper>
  );
}

export default SignupPage;
