import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { ChartData, ChartOptions } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  chartData: ChartData<"doughnut"> | null; 
  loading: boolean;
  error: string | null;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ chartData, loading, error }) => {
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", 
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 14,
          },
        },
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
        <div style={{ width: "300px", height: "300px" }}>
          <Doughnut data={chartData} options={options} />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DoughnutChart;
