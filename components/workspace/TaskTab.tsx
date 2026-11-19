"use client";
import KanbanItem from "./KanbanItem";
import TaskItem from "./TaskItem";
import { TaskStatus, TaskType } from "@/types/workspaceTypes";
import { useState } from "react";
import TaskForm from "./TaskForm";
import { OrgMember } from "@/types/organization";
import { AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";
import useTaskStore from "@/hooks/useTaskStore";
import useMemberStore from "@/hooks/useMemberStore";
import { Model } from "../ui/Model";

interface TaskTabProps {

  orgId: string;
  workSpaceId: number;
}
const TaskTab = ({  orgId, workSpaceId }: TaskTabProps) => {
  const [isModelOpoen, setIsModelOpen] = useState(false);
  const {
    tasks,
    isloading,
    isError,
    createTask,
    error,
    updateTask,
  
    changeAsignee,
    changeStatusTask,
    deleteTask,
  } = useTaskStore(String(workSpaceId), orgId);
  const { members = [] } = useMemberStore(String(workSpaceId), orgId);
  const [editingTask, setEditingTask] = useState<TaskType>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);

  const handleFormSubmit = async (formData: any) => {
    if (formData.id) {
      updateTask({ data: formData, taskId: formData.id });
    } else createTask(formData);

    setIsModelOpen(false);
    setEditingTask(null);
  };

  const handleAsigneeChange = async (taskId: number, memberId: string) => {
    changeAsignee({ memberId, taskId });
  };

  const handleStatusChange = async (task: TaskType, newStatus: TaskStatus) => {
    changeStatusTask({ task, status: newStatus });
  };
  const statusLis = Object.entries(TaskStatus).map(([key, value]) => {
    return {
      key,
      value,
    };
  });
  const handleOpenEditModal = (task: TaskType) => {
    setEditingTask(task);
    setIsModelOpen(true);
  };
  const handleOpenDeleteModal = (task: TaskType) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = (task: TaskType) => {
    deleteTask(task.id);
  };
  if (isError) return <h1>{error}</h1>;
  if (isloading)
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <span className="ml-2 text-sm text-slate-500">Loading Tasks...</span>
      </div>
    );
  return (
    <>
      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-col w-[70%]">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl font-bold capitalize my-2 me-4">
              Workspace title
            </h1>
            {/* <p className="text-gray-900 font-bold text-base ">11-12-2026</p> */}
          </div>

        </div>
        <Model
          isbackDropClose={true}
          buttonText={"Add Task"}
          title={"Add Task"}
        >
          {(closeModal) => (
            <TaskForm
              workSpaceId={String(workSpaceId)}
              orgId={orgId}
              onSuccessClose={closeModal}
              members={members}
              initialData={editingTask}
            />
          )}
        </Model>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Delete Task
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                &quot;{taskToDelete?.title}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(taskToDelete)}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {!tasks ||
        (tasks.length === 0 && (
          <h1>No Tasks Yet Click add to start manage your tasks </h1>
        ))}
      {tasks && tasks.length > 0 && (
        <div className="flex flex-row justify-between gap-5 py-6 relative overflow-y-scroll ">
          {statusLis.map((status) => {
            return (
              <KanbanItem
                key={status.key}
                title={status.value}
                status={status.key as TaskStatus}
              >
                {tasks
                  .filter((task) => {
                    return task?.status === (status.key as TaskStatus);
                  })
                  .map((task, index) => {
                    return (
                      <TaskItem
                        key={task.id || index}
                        task={task}
                        members={members}
                        onAssigneeChange={handleAsigneeChange}
                        onStatusChange={handleStatusChange}
                        workspaceId={String(workSpaceId)}
                        orgId={orgId}
                        onDelete={handleOpenDeleteModal}
                      />
                    );
                  })}
              </KanbanItem>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TaskTab;
