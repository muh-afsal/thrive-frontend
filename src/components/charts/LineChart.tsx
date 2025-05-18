import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    pointStyle: string;
    pointRadius: number;
    pointHoverRadius: number;
    fill: boolean;
  }[];
}

const LineChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDummyData = () => {
      setLoading(true);
      try {
        // Dummy data
        const dailyMemberCount = [
          { date: "2024-11-15", joinedMembers: 12 },
          { date: "2024-11-16", joinedMembers: 19 },
          { date: "2024-11-17", joinedMembers: 23 },
          { date: "2024-11-18", joinedMembers: 15 },
          { date: "2024-11-19", joinedMembers: 28 },
        ];

        setChartData({
          labels: dailyMemberCount.map((item) => item.date),
          datasets: [
            {
              label: "Joined Members",
              data: dailyMemberCount.map((item) => item.joinedMembers),
              borderColor: "#E97451",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              pointStyle: "circle",
              pointRadius: 10,
              pointHoverRadius: 10,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Could not fetch chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDummyData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "#71797E",
        },
      },
      y: {
        grid: {
          color: "#71797E",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Joined Members",
      },
    },
  };

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {chartData ? (
        <div className="w-full h-full">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default LineChart;
