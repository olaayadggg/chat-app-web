import styled from "styled-components";

export default function ChatInput({ text, setText, sendMessage }) {
  return (
    <Container>
      <InputArea>
        <Input
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputArea>
    </Container>
  );
}

/* ========== STYLES ========== */
const Container = styled.div`
  position: relative;
  width: 100%;
`;
const InputArea = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #2563eb;
  }
`;

const SendButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #1e40af;
  }
`;
