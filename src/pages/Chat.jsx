import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import styled from "styled-components";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  writeBatch,
  where,
  limit,
} from "firebase/firestore";
import { getDb } from "../utils/firebase";
import ConversationSidebar from "../components/ConversationSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";
import { ArrowDown } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Chat({ selectedEmployeeId }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { user } = useUser();

  const messagesRef = useRef(null);
  const messagesEndRef = useRef(null);
  const db = useMemo(() => getDb(), []);

  /* === Conversations === */
  useEffect(() => {
    if (!db) return;
    setLoadingConversations(true);
    const q = query(
      collection(db, "conversations"),
      orderBy("lastMessageTimestamp", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setConversations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingConversations(false);
      },
      () => setLoadingConversations(false)
    );
    return () => unsub();
  }, [db]);

  /* === Open conversation event (from notification click) === */
  useEffect(() => {
    if (!selectedEmployeeId || !conversations.length) return;
    const conv = conversations.find((c) => c.id === selectedEmployeeId);
    if (conv) {
      setSelected(conv);
      setTimeout(() => scrollToBottom(), 300);
    }
  }, [selectedEmployeeId, conversations]);

  /* === Load messages === */
  useEffect(() => {
    if (!selected || !db) return;
    setMessages([]);
    setLoadingMessages(true);

    const msgsCol = collection(db, `conversations/${selected.id}/messages`);
    const q = query(msgsCol, orderBy("timestamp", "asc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingMessages(false);
        setTimeout(scrollToBottom, 200);
      },
      () => setLoadingMessages(false)
    );
    return () => unsub();
  }, [selected, db]);

  /* === Scroll handling === */
  const handleScroll = () => {
    if (!messagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollDown(distanceFromBottom > 150);
  };
  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  /* === Mark notifications as read === */
  const markNotificationsRead = useCallback(
    async (employeeId) => {
      const q = query(
        collection(db, "notifications"),
        where("to", "==", user.id),
        where("from", "==", employeeId),
        where("read", "==", false)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((docSnap) =>
          batch.update(docSnap.ref, { read: true })
        );
        await batch.commit();
      }

      // Open that conversation immediately
      const conv = conversations.find((c) => c.id === employeeId);
      if (conv) {
        setSelected(conv);
        console.log("Opened conversation with:", employeeId);
        setTimeout(scrollToBottom, 300);
      }
    },
    [db, conversations, scrollToBottom]
  );

  /* === Send message === */
  const sendMessage = useCallback(async () => {
    if (!text.trim() || !selected || !db) return;

    const msgsCol = collection(db, `conversations/${selected.id}/messages`);
    await addDoc(msgsCol, {
      senderId: user.id,
      text: text.trim(),
      timestamp: new Date(),
      image: user.image,
    });

    await addDoc(collection(db, "notifications"), {
      to: selected.id,
      from: user.id,
      text: text.trim(),
      timestamp: new Date(),
      read: false,
    });

    setText("");
    setTimeout(scrollToBottom, 200);
  }, [text, selected, db, user, scrollToBottom]);

  return (
    <Container>
      <ConversationSidebar
        selected={selected}
        setSelected={setSelected}
        markNotificationsRead={markNotificationsRead}
        conversations={conversations}
        loading={loadingConversations}
      />
      <ChatArea>
        {!selected ? (
          <Placeholder>Select a conversation</Placeholder>
        ) : (
          <>
            <ChatHeader selected={selected} />
            <ChatMessages
              messages={messages}
              selected={selected}
              messagesRef={messagesRef}
              messagesEndRef={messagesEndRef}
              loadingMessages={loadingMessages}
              handleScroll={handleScroll}
            />
            {showScrollDown && (
              <ScrollButton onClick={scrollToBottom}>
                <ArrowDown size={18} />
              </ScrollButton>
            )}
            <ChatInput
              text={text}
              setText={setText}
              sendMessage={sendMessage}
            />
          </>
        )}
      </ChatArea>
    </Container>
  );
}

/* ============ Styles ============ */
const Container = styled.div`
  display: flex;
  height: 90vh;
  background: #f9fafb;
  overflow: hidden;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const ScrollButton = styled.button`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: #2563eb;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;
