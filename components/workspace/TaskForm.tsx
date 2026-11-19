"use client";

import { useState, useEffect } from "react";
import { Model } from "@/components/ui/Model";
import Select from "@/components/ui/Select";
import { TaskPriority, TaskStatus, TaskType } from "@/types/workspaceTypes";
import { OrgMember } from "@/types/organization";
import useTaskStore from "@/hooks/useTaskStore";
interface TaskFormProps {
  onSuccessClose?: () => void;
  members: OrgMember[];
  initialData?: TaskType | null;
  workSpaceId: string;
  orgId: string;
}
export default function TaskForm({
  onSuccessClose,
  members = [],
  initialData = null,
  workSpaceId,
  orgId,
}: TaskFormProps) {
  const { createTask, updateTask } = useTaskStore(String(workSpaceId), orgId);
  const [formData, setFormData] = useState({
    id: initialData?.id ?? null,
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    priority: initialData?.priority ?? TaskPriority.medium,
    assignee: initialData?.assigneee ?? "",
    status: initialData?.status ?? TaskStatus.pending,
    organization_member_id: initialData?.organization_member_id ?? null,
    workSpaceId: initialData?.workspaceId ?? workSpaceId,
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      updateTask({ data: formData, taskId: formData.id });
    } else createTask(formData);
    onSuccessClose();
  };

  const priorityOptions = [
    { key: "high", value: TaskPriority.high },
    { key: "low", value: TaskPriority.low },
    { key: "medium", value: TaskPriority.medium },
  ];
  const statusOptions = [
    { key: "completed", value: TaskStatus.completed },
    { key: "pending", value: TaskStatus.pending },
    { key: "in_progress", value: TaskStatus.in_progress },
  ];
  const employeeOptions = members.map((m) => ({
    value: `${m.user?.name ?? "Undefined"}`,
    key: m.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* عنوان المهمة */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700">Task Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. Review contract..."
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter task description..."
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          selectedValue={formData.priority}
          onChange={(value) => handleChange("priority", value)}
          placeholder="Select priority..."
          options={priorityOptions}
        />
        <Select
          label="Status"
          selectedValue={formData.status}
          onChange={(value) => handleChange("status", value)}
          placeholder="Select status..."
          options={statusOptions}
        />
      </div>

      <Select
        label="Assigned Employee"
        selectedValue={String(formData.organization_member_id)}
        onChange={(value) => handleChange("organization_member_id", value)}
        placeholder="Select employee..."
        options={employeeOptions}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          {initialData ? "Save Changes" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onSuccessClose}
          className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
