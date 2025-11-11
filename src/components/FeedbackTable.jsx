import { useState, useMemo } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";

export default function Dashboard({ feedback }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Filter feedback by search query
  const filtered = useMemo(() => {
    return feedback.filter(
      (f) =>
        f.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        f.notes?.toLowerCase().includes(search.toLowerCase())
    );
  }, [feedback, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <FeedbackSection>
      <ContentWrapper>
        <HeaderRow>
          <SectionTitle>Employee Feedback</SectionTitle>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or notes..."
          />
        </HeaderRow>

        <Card>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Score</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((f) => (
                  <tr key={f.id}>
                    <td>
                      {f.date?.toDate
                        ? f.date.toDate().toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
                    </td>
                    <td>{f.employeeName}</td>
                    <td>
                      <ScoreBadge $score={f.score}>{f.score}</ScoreBadge>
                    </td>
                    {/* <td>{(f.notes || "").slice(0, 60)}</td> */}
                    <td className="notes-cell">
                      <NoteText title={f.notes || "No notes"}>
                        {f.notes || "—"}
                      </NoteText>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", color: "#9ca3af" }}
                  >
                    No feedback found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              <PageButton disabled={page === 1} onClick={handlePrev}>
                Prev
              </PageButton>
              <PageIndicator>
                Page {page} of {totalPages}
              </PageIndicator>
              <PageButton disabled={page === totalPages} onClick={handleNext}>
                Next
              </PageButton>
            </Pagination>
          )}
        </Card>
      </ContentWrapper>
    </FeedbackSection>
  );
}

/* ========== STYLES ========== */
const FeedbackSection = styled.div`
  width: 100%;
  background: #f9fafb;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  max-width: 1200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  table-layout: fixed;
  color: #374151;

  th {
    background: #f3f4f6;
    text-align: left;
    padding: 0.75rem;
    font-weight: 600;
  }

  td {
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }
`;
const NoteText = styled.div`
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: #374151;
  font-size: 0.93rem;
  line-height: 1.5;
  padding: 8px 10px;

  &:hover {
    background: #f3f4f6;
  }
`;

const ScoreBadge = styled.span`
  background: ${(p) =>
    p.score >= 4 ? "#34d399" : p.score >= 3 ? "#facc15" : "#f87171"};
  color: white;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  background: ${(p) => (p.disabled ? "#e5e7eb" : "#2563eb")};
  color: ${(p) => (p.disabled ? "#9ca3af" : "#fff")};
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: 0.2s;
  font-weight: 500;

  &:hover {
    background: ${(p) => (p.disabled ? "#e5e7eb" : "#1e40af")};
  }
`;

const PageIndicator = styled.span`
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
`;
