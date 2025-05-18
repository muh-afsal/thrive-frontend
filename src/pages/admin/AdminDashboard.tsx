import { useEffect, useState } from "react";
import { Dumbbell, IndianRupee, Speech, Users } from "lucide-react";
import  { Toaster } from "react-hot-toast";
import StatCard from "@/components/cards/StatCard";
import DoughnutChart from "@/components/charts/DoughnutChart";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";



interface StatData {
  totalMembers: number;
  totalTrainers: number;
  totalPrograms: number;
  totalIncome: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const AdminDashboard: React.FC = () => {
  const [statData, setStatData] = useState<StatData>({
    totalMembers: 1000,
    totalTrainers: 50,
    totalPrograms: 30,
    totalIncome: 50000,
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

 

  useEffect(() => {
    const dummyChartData: ChartData = {
      labels: ["Members", "Trainers", "Programs"],
      datasets: [
        {
          label: "Admin Stats",
          data: [statData.totalMembers, statData.totalTrainers, statData.totalPrograms],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };
    setChartData(dummyChartData);
  }, [statData]);

 

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="h-full overflow-y-auto">
        <div className="h-[20%] p-3 px-5 overflow-x-auto flex justify-center pt-4 scrollbar-custom">
          <div className="flex justify-around w-full h-full items-center gap-6">
            <StatCard title="Income" count={statData.totalIncome} description="Total programs income" Icon={IndianRupee} />
            <StatCard title="Total Users" count={statData.totalMembers} description="Users Joined till now" Icon={Users} />
            <StatCard title="Active Users" count={statData.totalTrainers} description="Current Active Trainers" Icon={Speech} />
            <StatCard title="Programs" count={statData.totalPrograms} description="Current Active Programs" Icon={Dumbbell} />
          </div>
        </div>

        <div className="md:h-[40%] h-full w-full flex p-4 gap-4 flex-col md:flex-row">
          <div className="chat-div-doughnuts md:w-[50%] w-full h-full dark:bg-neutral-800 bg-neutral-100 rounded-xl p-3">
            <BarChart />
          </div>
          <div className="md:w-[50%] w-full h-full dark:bg-neutral-800 bg-neutral-100 rounded-xl p-2 overflow-y-auto scrollbar-custom">
       
            <DoughnutChart chartData={chartData} loading={loading} error={error} />
          </div>
        </div>
        <div className="h-[40%] w-full px-4 p-3 pt-0 pb-4 flex gap-4">
          <div className="w-full h-full dark:bg-neutral-800 bg-neutral-100 rounded-xl p-3">
            <LineChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
