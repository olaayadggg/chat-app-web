import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { LayoutDashboard, MessageSquare } from "lucide-react";

export default function Sidebar() {
  return (
    <Container>
      <Logo>HR Panel</Logo>
      <NavSection>
        <StyledLink to="/dashboard">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </StyledLink>
        <StyledLink to="/chat">
          <MessageSquare size={18} />
          <span>Chat</span>
        </StyledLink>
      </NavSection>
    </Container>
  );
}

/* ========== STYLES ========== */
const Container = styled.aside`
  width: 250px;
  background-color: #111827;
  color: #f9fafb;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.5px;
`;

const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #d1d5db;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1f2937;
    color: #fff;
  }

  &.active {
    background-color: #2563eb;
    color: #fff;
  }

  span {
    margin-top: 2px;
  }
`;
