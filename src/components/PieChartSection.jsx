import { Pie } from "react-chartjs-2";
import styled from "styled-components";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function PieChartSection({ distribution }) {
  // Calculate total feedback count
  const total =
    Object.values(distribution).reduce((sum, val) => sum + (val || 0), 0) || 1;

  // Convert to percentage
  const percentageData = [
    (distribution[1] / total) * 100 || 0,
    (distribution[2] / total) * 100 || 0,
    (distribution[3] / total) * 100 || 0,
    (distribution[4] / total) * 100 || 0,
    (distribution[5] / total) * 100 || 0,
  ];

  const data = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        data: percentageData,
        backgroundColor: [
          "#f87171",
          "#fb923c",
          "#34d399",
          "#60a5fa",
          "#facc15",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options — show % on hover
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw?.toFixed(1) || 0;
            return `${label}: ${value}%`;
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <ChartSection>
      <Card>
        <Content>
          <SectionTitle>Feedback Score Distribution</SectionTitle>
          <Description>
            This chart shows the percentage distribution of feedback scores
            among employees for the current evaluation cycle.
          </Description>
          <List>
            {Object.entries(distribution).map(([score, count]) => {
              const percent = ((count / total) * 100).toFixed(1);
              return (
                <ListItem key={score}>
                  <span>{score} Star</span>
                  <b>
                    {count || 0} ({percent}%)
                  </b>
                </ListItem>
              );
            })}
          </List>
        </Content>

        <PieWrapper>
          <Pie data={data} options={options} />
        </PieWrapper>
      </Card>
    </ChartSection>
  );
}

/* ========== STYLES ========== */
const ChartSection = styled.div`
  width: 100%;
  background: #f9fafb;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 280px;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

const Description = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  color: #374151;

  span {
    color: #4b5563;
  }

  b {
    color: #111827;
  }
`;

const PieWrapper = styled.div`
  flex: 0 0 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 900px) {
    flex: 0 0 auto;
  }
`;
