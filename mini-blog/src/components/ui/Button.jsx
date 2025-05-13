import React from "react";
import styled, { css } from "styled-components";

const ButtonWrapper = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) => {
    if (props.$variant === "primary") {
      return css`
        background-color: #4a6bff;
        color: white;
        
        &:hover {
          background-color: #3451db;
        }
      `;
    } else if (props.$variant === "secondary") {
      return css`
        background-color: #e0e0e0;
        color: #333;
        
        &:hover {
          background-color: #c8c8c8;
        }
      `;
    } else if (props.$variant === "danger") {
      return css`
        background-color: #ff4d4d;
        color: white;
        
        &:hover {
          background-color: #e03c3c;
        }
      `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  & + & {
    margin-left: 8px;
  }
`;

function Button({ children, variant = "primary", ...rest }) {
  return (
    <ButtonWrapper $variant={variant} {...rest}>
      {children}
    </ButtonWrapper>
  );
}

export default Button;
