import React from "react";
import { OrgMember } from "@/types/organization";
import {
  TaskPriority,
  TaskType,
  priorityOptions,
  statusOptions,
} from "@/types/workspaceTypes";
import { MoreVertical, Flag, User, Trash2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { TaskStatus } from "@/types/workspaceTypes";
import { Model } from "../ui/Model";
import TaskForm from "./TaskForm";
import { Pencil } from "lucide-react";
import TruncatedText from "../ui/TruncatedText";
import Select from "../ui/Select";
import useTaskStore from "@/hooks/useTaskStore";
import { useParams } from "next/navigation";
interface TaskItemProps {
  task: TaskType;
  orgId: string;
  workspaceId: string;
  members: OrgMember[];
  onAssigneeChange: (taskId: number, newAssigneeId: string) => void;
  onDelete: (task: TaskType) => void;
  onStatusChange: (task: TaskType, status: TaskStatus) => void;
}
const priorityVarient: Record<TaskPriority, string> = {
  [TaskPriority.high]: "bg-red-50/50 text-red-700",
  [TaskPriority.medium]: "bg-yellow-50/50 border-yellow-200 text-yellow-700",
  [TaskPriority.low]: "bg-blue-50/50 text-blue-700",
};

const priorityIconVarient: Record<TaskPriority, string> = {
  [TaskPriority.high]: "text-red-700",
  [TaskPriority.medium]: "text-yellow-700",
  [TaskPriority.low]: "text-blue-700",
};

const TaskItem = ({
  task,
  members,
  onAssigneeChange,
  onStatusChange,
  orgId,
  workspaceId,
  onDelete,
}: TaskItemProps) => {
  console.log(task.assigneee);

  const { changeAsignee, changeStatusTask, deleteTask, changePriorty } =
    useTaskStore(workspaceId, orgId);

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
          <Model
            isbackDropClose={true}
            buttonText={"Edit Task"}
            title={"Edit Task"}
            triggerButton={
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Pencil className="w-5 h-5" />
              </button>
            }
          >
            {(closeModal) => (
              <TaskForm
                orgId={orgId}
                workSpaceId={workspaceId}
                onSuccessClose={closeModal}
                members={members}
                initialData={task}
              />
            )}
          </Model>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <div className="text-xs text-slate-500 leading-relaxed">
          <TruncatedText text={task.description} limit={65} />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span
              className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${selectedPriorityTheme}`}
              
            >
              <Flag className={`w-3.5 h-3.5 ${selectedPriorityIconTheme}`} />
            </span>

            <div className="min-w-[95px]">
              <Select
                options={priorityOptions}
                selectedValue={task.priority}
                onChange={(value) =>
                  changePriorty({ task, priority: value as TaskPriority })
                }
              />
            </div>
          </div>

          {/* قسم الحالة */}
          <div className="min-w-[110px]">
            <Select
              options={statusOptions}
              selectedValue={task.status}
              onChange={(value) =>
                changeStatusTask({ task, status: value as TaskStatus })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 bg-blue-50 text-blue-700 rounded p-1.5 mt-2">
        <User className="w-4 h-4 shrink-0" />
        <select
          value={task.organization_member_id || ""}
          onChange={(e) =>
            changeAsignee({ taskId: task.id, memberId: e.target.value })
          }
          className="bg-transparent text-xs font-medium text-blue-700 outline-none w-full cursor-pointer"
        >
          <option value="" disabled>
            Select assignee...
          </option>
          {members.map((member) => (
            <option
              key={member.id}
              value={member.user?.id ?? member.id}
              className="text-slate-800"
            >
              {member.user?.name ?? "undefined"} ({member.role ?? "N/A"})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskItem;
