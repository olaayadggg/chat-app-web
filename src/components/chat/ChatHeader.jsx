import styled from "styled-components";

export default function ChatHeader({ selected }) {
  if (!selected) return null;

  return (
    <Header>
      <HeaderLeft>
        <Avatar src={selected.image} alt={selected.name} />
        <HeaderName>{selected.name}</HeaderName>
      </HeaderLeft>
    </Header>
  );
}

/* ============ Styles ============ */
const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  background: #fff;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
`;

const HeaderName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;
