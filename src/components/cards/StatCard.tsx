import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number | string; 
  description: string;
  Icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, description, Icon }) => {
  return (
    <div className="h-full group w-[25%] rounded-xl dark:bg-neutral-800 dark:text-neutral-300 bg-neutral-100 dark:hover:bg-thirve-blue hover:shadow-[0px_0px_31px_1px_#00000024] hover:bg-thirve-blue hover:text-black transition duration-300 flex">
      <div className="w-[70%] p-5">
        <p className="font-semibold mb-1">{title}</p>
        <p className="font-bold text-5xl mb-1">{count}</p>
        <p className="text-sm w-max flex items-center gap-2">
          <Icon size={16} />
          {description}
        </p>
      </div>
      <div className="w-[30%] flex justify-center pt-3">
        <div className="w-16 h-16 rounded-md flex justify-center items-center text-black dark:bg-thirve-blue bg-neutral-200 group-hover:bg-thirve-blue transition duration-300">
          <Icon size={40} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
