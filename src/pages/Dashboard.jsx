import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { collection, onSnapshot } from "firebase/firestore";
import { getDb } from "../utils/firebase";
import FeedbackTable from "../components/FeedbackTable";
import PieChartSection from "../components/PieChartSection";

export default function Dashboard() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const db = getDb();
    if (!db) return;

    const col = collection(db, "feedback");
    const unsub = onSnapshot(
      col,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFeedback(docs);
      },
      (err) => console.error(err)
    );
    return () => unsub();
  }, []);

  const distribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach((f) => {
      const s = f.score || 0;
      if (s >= 1 && s <= 5) counts[s]++;
    });
    return counts;
  }, [feedback]);

  return (
    <Container>
      <Header>Dashboard</Header>
      <ContentGrid>
        <PieChartSection distribution={distribution} />
        <FeedbackTable feedback={feedback} />
      </ContentGrid>
    </Container>
  );
}

/* ============ Styles ============ */
const Container = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
`;

const Header = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const ContentGrid = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;
