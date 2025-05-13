import React from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #4a6bff;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #4a6bff;
  }
`;

function TextInput({ label, multiline = false, ...rest }) {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      {multiline ? <TextArea {...rest} /> : <Input {...rest} />}
    </InputWrapper>
  );
}

export default TextInput;
