import { TaskStatus } from "@/types/workspaceTypes";
import React, { ReactNode } from "react";

interface KanbanItemsProps {
  title: string;
  status: TaskStatus;
  badge: string;
  children: ReactNode;
}
const colorVarients: Record<TaskStatus, string> = {
  [TaskStatus.inProgress]: "bg-blue-50 text-blue-700",
  [TaskStatus.completed]: "bg-green-50 text-green-700",
  [TaskStatus.pending]: "bg-amber-50 text-amber-700",
};
const KanbanItem = ({ title, status, badge, children }: KanbanItemsProps) => {
  const selectedStatusColor =
    colorVarients[status] || colorVarients[TaskStatus.pending];
  console.log(colorVarients);
  return (
    <>
    
    <div className="w-full min-w-75 bg-gray-100">
      <div
        className={`flex flex-row justify-start items-center ${selectedStatusColor} p-2`}
      >
        <span>{badge}</span>
        <h3 className="mx-2 font-bold">{title}</h3>
      </div>
      <div className="p-3 flex flex-col gap-2 w-full  max-h-[65vh]  overflow-y-scroll">
        {children} 
      </div>
    </div>
    </>
  );
};

export default KanbanItem;
