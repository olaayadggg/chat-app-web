import { useState, useMemo } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import { useUser } from "../context/UserContext";

export default function ConversationSidebar({
  conversations = [],
  selected,
  setSelected,
  markNotificationsRead,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return conversations.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.role?.toLowerCase().includes(term)
    );
  }, [searchTerm, conversations]);

  const getLastMessageLabel = (conv) => {
    if (!conv.lastMessage) return "No messages yet";
    // Identify who sent the last message
    const isMe = conv.lastMessageSender === user.id;
    const senderName = isMe ? "You" : conv.name?.split(" ")[0] || "Employee";
    return `${senderName}: ${conv.lastMessage}`;
  };

  return (
    <Sidebar>
      <div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name..."
        />
      </div>

      {filteredConversations.length === 0 ? (
        <EmptyMsg>No results found</EmptyMsg>
      ) : (
        filteredConversations.map((c) => (
          <ConversationItem
            key={c.id}
            onClick={() => {
              setSelected(c);
              markNotificationsRead?.(c.id);
            }}
            className={selected?.id === c.id ? "active" : ""}
          >
            <Avatar src={c.image} alt={c.name} />
            <div>
              <Name>{c.name}</Name>
              <LastMessage>{getLastMessageLabel(c)}</LastMessage>
            </div>
          </ConversationItem>
        ))
      )}
    </Sidebar>
  );
}

/* ========== STYLES ========== */
const Sidebar = styled.div`
  width: 300px;
  height: 100vh;
  border-right: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: 0.2s;

  &.active {
    background: #eef2ff;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyMsg = styled.div`
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 20px 0;
`;
