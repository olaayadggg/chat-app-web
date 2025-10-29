import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getDb, initializeMessagingForHR } from "../utils/firebase";
import { Bell } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Navbar({ onOpenConversation }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useUser();
  const db = getDb();

  // 🔔 Fetch unread notifications for HR
  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "notifications"),
      where("to", "==", user.id),
      where("read", "==", false)
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(docs);
    });

    // Initialize FCM for web notifications
    initializeMessagingForHR();

    return () => unsub();
  }, [db]);

  // Mark notifications as read
  async function markAllRead() {
    if (!db || notifications.length === 0) return;
    const batch = writeBatch(db);
    notifications.forEach((n) =>
      batch.update(doc(db, "notifications", n.id), { read: true })
    );
    await batch.commit();
    setShowDropdown(false);
  }

  // Handle notification click — open that employee conversation
  async function handleNotificationClick(notification) {
    if (onOpenConversation) {
      onOpenConversation(notification.from);
    }

    await updateDoc(doc(db, "notifications", notification.id), { read: true });
    setShowDropdown(false);
  }

  return (
    <NavBar>
      <Left>
        <Logo>Acme Co</Logo>
      </Left>
      <Center>
        <NavItem>HR Feedback Admin Panel</NavItem>
      </Center>
      <Right>
        {/* 🔔 Notification Bell */}
        <NotifContainer onClick={() => setShowDropdown(!showDropdown)}>
          <Bell size={22} color="#111827" />
          {notifications.length > 0 && (
            <NotifDot>{notifications.length}</NotifDot>
          )}
        </NotifContainer>

        {showDropdown && (
          <Dropdown>
            <DropdownHeader>
              <span>Notifications</span>
              {notifications.length > 0 && (
                <MarkReadBtn onClick={markAllRead}>Mark all read</MarkReadBtn>
              )}
            </DropdownHeader>

            {notifications.length === 0 ? (
              <EmptyMsg>No new notifications</EmptyMsg>
            ) : (
              notifications.map((n) => (
                <DropdownItem
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                >
                  <strong>
                    {n.from?.replace("emp_", "").replace("hr_", "")}
                  </strong>
                  <p>{n.text}</p>
                </DropdownItem>
              ))
            )}
          </Dropdown>
        )}

        <Profile>
          <img src={user.image} alt="Admin" />
        </Profile>
      </Right>
    </NavBar>
  );
}

/* ================== STYLES ================== */
const NavBar = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 18px;
  color: #111827;
`;

const NavItem = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
`;
const Center = styled.div`
  display: flex;
  align-items: center;
`;

const NotifContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotifDot = styled.div`
  position: absolute;
  top: -4px;
  right: -6px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Profile = styled.div`
  position: relative;
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 56px;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 200;
  padding: 8px;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 6px;
  span {
    font-weight: 600;
    font-size: 14px;
  }
`;

const MarkReadBtn = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DropdownItem = styled.div`
  padding: 8px;
  border-radius: 6px;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }

  strong {
    font-size: 13px;
    display: block;
    color: #111827;
  }

  p {
    font-size: 12px;
    color: #4b5563;
    margin: 2px 0 0;
  }
`;

const EmptyMsg = styled.div`
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  padding: 12px 0;
`;
