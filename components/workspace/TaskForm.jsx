"use client";

import { useState } from "react";
import Modal from "@/components/ui/Model";
import Select from "@/components/ui/Select";

export default function TaskForm({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        priority: "medium",
        assignee: "",
        actionUrl: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
        onClose();
    };

    const departmentOptions = [
        { label: "Sales", value: "sales" },
        { label: "Marketing", value: "marketing" },
        { label: "Development", value: "dev" },
        { label: "Support", value: "support" }
    ];

    const priorityOptions = [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" }
    ];

    const employeeOptions = [
        { label: "Sarah Al-Ahmed", value: "sarah" },
        { label: "Khaled Al-Salem", value: "khaled" },
        { label: "Ahmed Ali", value: "ahmed" }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
   
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Task Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Review contract..."
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Select department..."
                        options={departmentOptions}
                    />
                    <Select
                        label="Priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        placeholder="Select priority..."
                        options={priorityOptions}
                    />
                </div>

        
                <Select
                    label="Assigned Employee"
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleChange}
                    placeholder="Select employee..."
                    options={employeeOptions}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Action URL</label>
                    <input
                        type="url"
                        name="actionUrl"
                        value={formData.actionUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-2">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                        Create Task
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