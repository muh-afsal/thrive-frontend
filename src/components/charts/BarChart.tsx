import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const BarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDummyData = () => {
      try {
        setLoading(true);
        const dailyIncome = [
          { date: "2024-11-13", amount: 1200 },
          { date: "2024-11-14", amount: 1800 },
          { date: "2024-11-15", amount: 1500 },
          { date: "2024-11-16", amount: 2000 },
          { date: "2024-11-17", amount: 2200 },
          { date: "2024-11-18", amount: 1700 },
          { date: "2024-11-14", amount: 1800 },
        ];

        const formattedData: ChartData = {
          labels: dailyIncome.map((item) => item.date),
          datasets: [
            {
              label: "Daily Income",
              data: dailyIncome.map((item) => item.amount),
              backgroundColor: "#36A2EB",
              borderColor: "#36A2EB",
              borderWidth: 1,
            },
          ],
        };

        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching dummy chart data:", err);
        setError("Could not fetch dummy chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDummyData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Income from Programs",
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
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default BarChart;
