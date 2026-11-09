import React from "react";
import { OrgMember } from "@/types/organization";
import { TaskPriority, TaskType } from "@/types/workspaceTypes";
import { MoreVertical, Flag, User, Trash2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { TaskStatus } from "@/types/workspaceTypes";
interface TaskItemProps {
  task: TaskType;
  members: OrgMember[];
  onAssigneeChange: (taskId: number, newAssigneeId: string) => void;
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
  onStatusChange: (taskid: number, status: TaskStatus) => void;
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
const TaskItem = ({
  task,
  members,
  onAssigneeChange,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskItemProps) => {
  const selectedPriorityTheme =
    priorityVarient[task.priority] || priorityVarient.low;

  const selectedPriorityIconTheme =
    priorityIconVarient[task.priority] || priorityIconVarient.low;

  return (
    <div className="flex flex-col bg-white w-full p-2 rounded ">
      <div className="flex flex-row justify-between mb-2 items-center">
        <h3 className=" font-bold">{task.title}</h3>
        <div className="flex justify-end">
          <button
            onClick={() => onDelete(task)}
            className="text-slate-400 hover:text-red-600 p-1 rounded cursor-pointer transition"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
            title="Edit Task"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between ">
        <p className="text-gray-500">{task.description}</p>
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
      <div className="flex flex-row items-center gap-2 bg-blue-50 text-blue-700 rounded p-1.5 mt-2">
        <User className="w-4 h-4 shrink-0" />
        <select
          value={task.assigneeId || ""}
          onChange={(e) => onAssigneeChange(task.id, e.target.value)}
          className="bg-transparent text-xs font-medium text-blue-700 outline-none w-full cursor-pointer"
        >
          <option value="" disabled>
            Select assignee...
          </option>
          {members.map((member) => (
            <option
              key={member.id}
              value={member.id}
              className="text-slate-800"
            >
              {member.user.name} ({member.role})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskItem;
