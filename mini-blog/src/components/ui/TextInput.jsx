import React from "react";
import styled from "styled-components";

/**
 * 텍스트 입력 컴포넌트
 * 
 * 단일 줄 입력과 여러 줄 입력을 지원하는 텍스트 입력 컴포넌트입니다.
 * 레이블과 함께 일관된 디자인을 제공합니다.
 */

/**
 * 입력 컴포넌트를 감싸는 스타일드 컴포넌트
 * 
 * 레이블과 입력 필드를 세로로 배치합니다.
 */
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

/**
 * 입력 필드의 레이블을 위한 스타일드 컴포넌트
 */
const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
`;

/**
 * 단일 줄 텍스트 입력을 위한 스타일드 컴포넌트
 * 
 * 기본 입력 필드 스타일과 포커스 상태의 스타일을 정의합니다.
 */
const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  /* 포커스 상태일 때 테두리 색상 변경 */
  &:focus {
    border-color: #4a6bff;
  }
`;

/**
 * 여러 줄 텍스트 입력을 위한 스타일드 컴포넌트
 * 
 * 다중 줄 입력을 위한 텍스트영역 스타일을 정의합니다.
 * 세로 크기만 조절 가능하도록 설정되어 있습니다.
 */
const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;

  /* 포커스 상태일 때 테두리 색상 변경 */
  &:focus {
    border-color: #4a6bff;
  }
`;

/**
 * 텍스트 입력 컴포넌트 함수
 * 
 * @param {string} label - 입력 필드의 레이블 텍스트
 * @param {boolean} multiline - 여러 줄 입력 필드 여부 (기본값: false)
 * @param {Object} rest - 입력 필드에 전달될 추가 속성들 (value, onChange, placeholder 등)
 * @returns {JSX.Element} 스타일링된 텍스트 입력 컴포넌트
 */
function TextInput({ label, multiline = false, ...rest }) {
  return (
    <InputWrapper>
      {/* 레이블이 있는 경우에만 표시 */}
      {label && <Label>{label}</Label>}
      {/* multiline 옵션에 따라 TextArea 또는 Input 컴포넌트 사용 */}
      {multiline ? <TextArea {...rest} /> : <Input {...rest} />}
    </InputWrapper>
  );
}

export default TextInput;
