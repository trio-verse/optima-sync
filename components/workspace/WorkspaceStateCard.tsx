import React from "react";

interface WorkspaceStateCardProps {
  title: string;
  percentage: number;
  value: number;
  color?: "blue" | "green" | "purple" | "amber" | "red";
}
const colorVariants = {
  blue: "bg-sky-50/70 text-blue-700 border-blue-200  ",
  green: "bg-emerald-50/70 text-emerald-700 border-emerald-200 ",
  purple: "bg-purple-50/70 text-purple-700 border-purple-200 ",
  amber: "bg-amber-50/70 text-amber-700 border-amber-200 ",
  red: "bg-red-50/70 text-red-700 border-red-200 ",
};
const WorkspaceStateCard = (props: WorkspaceStateCardProps) => {
  const activeColorClass = colorVariants[props.color] || colorVariants.blue;
  return (
    <div
      className={`flex flex-col items-start p-4  w-full rounded-xl shadow-md  shadow-gray-200 bordered ${activeColorClass}`}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <h3 className={`capitalize text-base font-bold`}>{props.title}</h3>
        <p className="font-xl text-xl ">{props.percentage}%</p>
      </div>
      <div className="flex flex-row items-end py-2">
        <h3 className="text-4xl me-1">{props.value}</h3>
        <p>(workspaces)</p>
      </div>
    </div>
  );
};

export default WorkspaceStateCard;
