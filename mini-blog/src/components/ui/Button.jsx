import React from "react";
import styled, { css } from "styled-components";

/**
 * 버튼 컴포넌트
 * 
 * 일관된 디자인의 버튼을 제공합니다.
 * primary, secondary, danger 세 가지 변형을 지원합니다.
 */

/**
 * 버튼 컴포넌트의 스타일을 정의하는 스타일드 컴포넌트
 * 
 * 버튼의 기본 스타일과 변형에 따른 스타일을 정의합니다.
 */
const ButtonWrapper = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* 변형에 따른 스타일 적용 */
  ${(props) => {
    if (props.$variant === "primary") {
      return css`
        /* 기본 버튼 스타일 - 파란색 */
        background-color: #4a6bff;
        color: white;
        
        &:hover {
          background-color: #3451db;
        }
      `;
    } else if (props.$variant === "secondary") {
      return css`
        /* 보조 버튼 스타일 - 회색 */
        background-color: #e0e0e0;
        color: #333;
        
        &:hover {
          background-color: #c8c8c8;
        }
      `;
    } else if (props.$variant === "danger") {
      return css`
        /* 위험 버튼 스타일 - 빨간색 */
        background-color: #ff4d4d;
        color: white;
        
        &:hover {
          background-color: #e03c3c;
        }
      `;
    }
  }}
  
  /* 비활성화 상태 스타일 */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* 연속된 버튼에 적용되는 스타일 */
  & + & {
    margin-left: 8px;
  }
`;

/**
 * 버튼 컴포넌트 함수
 * 
 * @param {ReactNode} children - 버튼 내부에 표시될 컨텐츠
 * @param {string} variant - 버튼 변형 (primary, secondary, danger) (기본값: "primary")
 * @param {Object} rest - 버튼에 전달될 추가 속성들 (onClick, type, disabled 등)
 * @returns {JSX.Element} 스타일링된 버튼 컴포넌트
 */
function Button({ children, variant = "primary", ...rest }) {
  return (
    <ButtonWrapper $variant={variant} {...rest}>
      {children}
    </ButtonWrapper>
  );
}

export default Button;
