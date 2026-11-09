"use client";

import { useState ,useEffect} from "react";
import Modal from "@/components/ui/Model";
import Select from "@/components/ui/Select";
import { TaskPriority, TaskStatus, TaskType } from "@/types/workspaceTypes";
import { OrgMember } from "@/types/organization";
interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  members: OrgMember[];
  initialData?:TaskType | null ;

}
export default function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  members = [],
  initialData = null,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: TaskPriority.Medium,
    assignee: "",
    status: TaskStatus.pending,
    assigneeId: "",

  });
useEffect(() => {
    if (isOpen) {
      if(initialData){
     setFormData({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        status: initialData.status,
        assigneeId: initialData.assigneeId.toString(),
        assignee: "",
      });
      }else{
        setFormData({
        title: "",
        description: "",
        priority: TaskPriority.Medium,
        status: TaskStatus.pending,
        assigneeId: "",
        assignee: "",
      });
      }
 
    }
  }, [isOpen,initialData]);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose();
  };

  const priorityOptions = [
    { label: "High", value: TaskPriority.High },
    { label: "Medium", value: TaskPriority.Medium },
    { label: "Low", value: TaskPriority.Low },
  ];
  const statusOptions = [
    { label: "completed", value: TaskStatus.completed },
    { label: "pending", value: TaskStatus.pending },
    { label: "inProgress", value: TaskStatus.inProgress },
  ];
  const employeeOptions = members.map((m) => ({
    label: `${m.user.name} (${m.user.email}) - (${m.role})`,
    value: m.id,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?"Create Task ":"Add Task"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* عنوان المهمة */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Review contract..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            placeholder="Select priority..."
            options={priorityOptions}
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Select status..."
            options={statusOptions}
          />
        </div>

        <Select
          label="Assigned Employee"
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleChange}
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
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
