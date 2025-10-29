import styled from "styled-components";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <SearchWrapper>
      <SearchInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </SearchWrapper>
  );
}

/* ========== STYLES ========== */
const SearchWrapper = styled.div`
  padding: 24px 12px;
  display: flex;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`;
