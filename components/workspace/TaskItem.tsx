import React from "react";
import { OrgMember } from "@/types/organization";
import { TaskPriority, TaskType } from "@/types/workspaceTypes";
import { MoreVertical, Flag, User } from "lucide-react";
interface TaskItemProps {
  task: TaskType;
}
const priorityVarient: Record<TaskPriority, string> = {
  [TaskPriority.High]: "bg-red-50/50 text-red-700",
  [TaskPriority.Medium]: "bg-yellow-50/50 border-yellow-200 text-yellow-700",
  [TaskPriority.Low]: "bg-blue-50/50 text-blue-700",
};
const priorityIconVarient: Record<TaskPriority, string> = {
  [TaskPriority.High]: "text-red-700",
  [TaskPriority.Medium]: "text-yellow-700",
  [TaskPriority.Low]: "text-blue-700",
};
const TaskItem = ({ task }: TaskItemProps) => {
  const selectedPriorityTheme =
    priorityVarient[task.priority] || priorityVarient.low;

  const selectedPriorityIconTheme =
    priorityIconVarient[task.priority] || priorityIconVarient.low;

  return (
    <div className="flex flex-col bg-white w-full p-2 rounded ">
      <div className="flex flex-row justify-between mb-2 items-center">
        <h3 className=" font-bold">Task 1</h3>
        <MoreVertical />
      </div>
      <div className="flex flex-row justify-between ">
        <p className="text-gray-500">Description</p>
        <div className="flex gap-1 items-center">
          <Flag
            className={`w-4 h-4 flex ${selectedPriorityIconTheme} bg-white`}
          />

          <p
            className={`font-bold text-sm px-1 capitalize py-0.5 rounded border flex ${selectedPriorityTheme}`}
          >
            {task.priority}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 bg-blue-50 text-blue-700 rounded p-2 mt-2">
        <User className="w-5 h-5 " />
        <p>ghazal</p>
      </div>
    </div>
  );
};

export default TaskItem;
