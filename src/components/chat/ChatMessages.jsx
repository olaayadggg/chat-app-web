import styled from "styled-components";
import { useUser } from "../../context/UserContext";

export default function ChatMessages({
  messages,
  selected,
  messagesRef,
  handleScroll,
  messagesEndRef,
  loadingMessages,
}) {
  if (loadingMessages) return <LoadingText>Loading messages...</LoadingText>;
  if (!messages || messages.length === 0)
    return <EmptyText>No messages yet</EmptyText>;

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = msg.timestamp?.toDate
      ? msg.timestamp.toDate().toISOString().split("T")[0]
      : "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});
  const { user } = useUser();
  const formatDate = (dateStr) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return msgDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year:
        msgDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return "";
    return timestamp
      .toDate()
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Messages ref={messagesRef} onScroll={handleScroll}>
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <DateSeparator>{formatDate(date)}</DateSeparator>
          {msgs.map((m) => {
            const isFromHR = m.senderId === user.id;
            const time = formatTime(m.timestamp);
            return (
              <MessageBlock key={m.id} $fromHr={isFromHR}>
                {!isFromHR && <AvatarSmall src={selected?.image} alt="emp" />}
                <MessageColumn $fromHr={isFromHR}>
                  <MessageBubble $fromHr={isFromHR}>{m.text}</MessageBubble>
                  <MessageTime $fromHr={isFromHR}>{time}</MessageTime>
                </MessageColumn>
                {isFromHR && <AvatarSmall src={user.image} alt="hr" />}
              </MessageBlock>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </Messages>
  );
}

/* ============ Styles ============ */
const Messages = styled.div`
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #f9fafb;
  min-height: 0;
`;
const MessageBlock = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${(p) => (p.$fromHr ? "flex-end" : "flex-start")};
  gap: 10px;
`;
const MessageColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.$fromHr ? "flex-end" : "flex-start")};
  max-width: 65%;
`;
const MessageBubble = styled.div`
  background: ${(p) => (p.$fromHr ? "#2563eb" : "#fff")};
  color: ${(p) => (p.$fromHr ? "#fff" : "#111827")};
  padding: 0.7rem 1rem;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  word-break: break-word;
`;
const MessageTime = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
`;
const AvatarSmall = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
`;
const DateSeparator = styled.div`
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  margin: 1rem 0;
  position: relative;
  line-height: 1;
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 35%;
    height: 1px;
    background: #e5e7eb;
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
`;
const LoadingText = styled.div`
  color: #6b7280;
  text-align: center;
  height: 100%;
  margin-top: 20px;
`;
const EmptyText = styled.div`
  color: #9ca3af;
  text-align: center;
  margin-top: 20px;
`;
