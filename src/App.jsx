import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { initializeFirebase } from "./utils/firebase";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";

initializeFirebase();

export default function App() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const handleOpenConversation = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    window.history.pushState({}, "", "/chat");
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };
  return (
    <AppWrapper>
      <NavbarWrapper>
        <Navbar onOpenConversation={handleOpenConversation} />
      </NavbarWrapper>
      <MainWrapper>
        <Sidebar />
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/chat"
              element={<Chat selectedEmployeeId={selectedEmployeeId} />}
            />
          </Routes>
        </ContentWrapper>
      </MainWrapper>
    </AppWrapper>
  );
}

/* ================= STYLES ================= */
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fafb;
`;

const NavbarWrapper = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 10;
  position: sticky;
  top: 0;
`;

const MainWrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 60px); /* Adjust if your navbar height differs */
`;

const ContentWrapper = styled.main`
  flex: 1;
  background: #fff;
  // overflow-y: auto;
`;
