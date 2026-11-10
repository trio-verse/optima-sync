"use client";
import React from "react";
import KanbanItem from "./KanbanItem";
import TaskItem from "./TaskItem";
import { TaskStatus, TaskType } from "@/types/workspaceTypes";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import { OrgMember } from "@/types/organization";
import { AlertTriangle } from "lucide-react";
import {
  CreateTask,
  UpdateTask,
  DeleteTask,
  getTasks,
  ChangeStatus,
  ChangeAssignee,
} from "@/actions/taskActions";
import { from } from "node:stream/iter";
import type { WorkSpaceStatus } from "@/types/workspaceTypes";
import { Loader2 } from "lucide-react";
interface TaskTabProps {
  tasks: TaskType[];
  members?: OrgMember[];
  orgId: string;
  workSpaceId: number;
}
const TaskTab = ({
  tasks: initialTasks,
  members = [],
  orgId,
  workSpaceId,
}: TaskTabProps) => {
  const [isModelOpoen, setIsModelOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<TaskType>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId || !workSpaceId) return;
    const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks(orgId, workSpaceId);
      if(res.success&&res.data)
      {
        const taskList=res.data;
         setTasks(taskList)
      }
     
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  }, [orgId, workSpaceId]);

  const handleFormSubmit = async (formData: any) => {
    const selectedMember = members.find((m) => m.id === formData.assigneeId);

    const res = editingTask
      ? await UpdateTask(orgId, workSpaceId, formData, editingTask.id)
      : await CreateTask(orgId, workSpaceId, formData);
    if (res.success) {
      setTasks((prev) => {
        if (editingTask) {
          return prev.map((t) =>
            t.id === editingTask.id
              ? {
                  ...t,
                  ...formData,
                  assigneeId: Number(formData.assigneeId),
                  assignee: selectedMember || t.assigneee,
                }
              : t,
          );
        }

        return [...prev, res.data];
      });
    }

    setIsModelOpen(false);
    setEditingTask(null);
  };

  const handleAsigneeChange = async (taskId: number, memberId: string) => {
    const res = await ChangeAssignee(orgId, workSpaceId, taskId, memberId);
    if (res.success) {
      const newMember = members.find((item) => item.id === memberId);
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              assigneeId: Number(memberId),
              assigneee: newMember,
            };
          }
          return task;
        }),
      );
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    const res = await ChangeStatus(orgId, workSpaceId, taskId, newStatus);
    if (res.success) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              status: newStatus as TaskStatus,
            };
          }
          return task;
        }),
      );
    }
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
    if (taskToDelete) {
      const res = DeleteTask(orgId, workSpaceId, task.id);
      setTasks((prevTasks) =>
        prevTasks.filter((t) => t.id !== taskToDelete.id),
      );
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };
  if (loading)
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

          <p className="text-gray-500 text-sm text-wrap ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum
            cupiditate officia eos veritatis? Facilis libero soluta dolore a,
            iusto asperiores suscipit incidunt, repellendus aliquid magnam sit
            voluptatem illo recusandae quaerat?
          </p>
        </div>

        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-md text-base hover:bg-blue-600"
          onClick={() => setIsModelOpen(true)}
        >
          Add Task
        </button>
      </div>

      <TaskForm
        isOpen={isModelOpoen}
        onClose={() => {
          setIsModelOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        members={members}
        initialData={editingTask}
      />
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
      <div className="flex flex-row justify-between gap-5 py-6 relative overflow-y-scroll ">
        {statusLis.map((status) => {
          return (
            <KanbanItem
              key={status.key}
              title={status.value}
              badge="50"
              status={status.key as TaskStatus}
            >
              {tasks
                .filter((task) => {
                  return task.status === (status.key as TaskStatus);
                })
                .map((task, index) => {
                  return (
                    <TaskItem
                      key={task.id || index}
                      task={task}
                      members={members}
                      onAssigneeChange={handleAsigneeChange}
                      onStatusChange={handleStatusChange}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                    />
                  );
                })}
            </KanbanItem>
          );
        })}
      </div>
    </>
  );
};

export default TaskTab;
