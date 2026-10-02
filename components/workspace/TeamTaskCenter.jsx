"use client";

import { useState } from "react";
import { Plus, CheckCircle2, AlertCircle, Award, Kanban, Table2, CheckSquare } from "lucide-react";

import BaseCard from "@/components/ui/BaseCard";
import KanbanColumn from "@/components/ui/KanbanColumn";
import Select from "@/components/ui/Select";
import TaskForm from "@/components/workspace/TaskForm.jsx";
import Table from "@/components/ui/Table";
function StatCard({ title, value, icon: Icon, colorClass, bgColorClass, textColorClass }) {
    return (
        <BaseCard className="flex items-center justify-between">
            <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{title}</p>
                <h4 className={`text-2xl font-black ${textColorClass || "text-slate-800"}`}>{value}</h4>
            </div>
            <div className={`p-3 rounded-xl ${bgColorClass} ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
        </BaseCard>
    );
}

function KanbanCard({ task }) {
    return (
        <BaseCard className="flex flex-col gap-3 p-3">
            <div className="flex justify-start">
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                    {task.category}
                </span>
            </div>
            
            <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
                {task.title}
            </h4>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
                <span className={`text-[11px] font-bold ${task.isLate ? "text-red-500" : "text-slate-400"}`}>
                    {task.dueDate}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                    {task.assignee}
                </span>
            </div>
        </BaseCard>
    );
}

export default function TeamTaskCenter() {
    const [viewMode, setViewMode] = useState("kanban");
    const [employeeFilter, setEmployeeFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mockTasks = [
        { id: 1, title: "Review final contract for Al-Madar Company", category: "Sales", assignee: "Sarah Al-Ahmed", dueDate: "Overdue", isLate: true, status: "in_progress" },
        { id: 2, title: "Prepare Advertising Campaign", category: "Marketing", assignee: "Khaled Al-Salem", dueDate: "Tomorrow", isLate: false, status: "pending" }
    ];
const handleSaveTask = (taskData) => {
        console.log("New Task Created:", taskData);

    };
    return (
        <div className="space-y-6 w-full" dir="ltr">
            

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Team Task Center</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage, distribute, and track all team and department tasks.</p>
                </div>
                <button 
                onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Create New Task
                </button>
            </div>

  
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Active Tasks" value="42" icon={CheckSquare} bgColorClass="bg-blue-50" colorClass="text-blue-600" />
                <StatCard title="Completed Today" value="18" icon={CheckCircle2} bgColorClass="bg-emerald-50" colorClass="text-emerald-600" />
                <StatCard title="Overdue Tasks" value="5" icon={AlertCircle} bgColorClass="bg-red-50" colorClass="text-red-600" textColorClass="text-red-600" />
                <StatCard title="Top Achiever" value="M. Al-Otaibi" icon={Award} bgColorClass="bg-purple-50" colorClass="text-purple-600" />
            </div>

            <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                    <button 
                        onClick={() => setViewMode("table")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === "table" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Table2 className="w-4 h-4" /> Table
                    </button>
                    <button 
                        onClick={() => setViewMode("kanban")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === "kanban" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Kanban className="w-4 h-4" /> Kanban
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full max-w-xs">
                    <Select 
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        placeholder="Development"
                        options={[{label: "Development", value: "dev"}, {label: "Sales", value: "sales"}]}
                    />
                    <Select 
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                        placeholder="All Employees"
                        options={[{label: "All Employees", value: "all"}]}
                    />
                </div>
            </div>

            {/* الكانبان */}
            {viewMode === "kanban" && (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 [&::-webkit-scrollbar]:hidden">
                    <KanbanColumn title="Pending" count={3} badgeColor="bg-slate-200 text-slate-700">
                        {mockTasks.filter(t => t.status === "pending").map(task => (
                            <KanbanCard key={task.id} task={task} />
                        ))}
                    </KanbanColumn>

                    <KanbanColumn title="In Progress" count={2} badgeColor="bg-blue-100 text-blue-700">
                        {mockTasks.filter(t => t.status === "in_progress").map(task => (
                            <KanbanCard key={task.id} task={task} />
                        ))}
                    </KanbanColumn>
                    
                    <KanbanColumn title="Under Review" count={1} badgeColor="bg-purple-100 text-purple-700" />
                    <KanbanColumn title="Completed" count={8} badgeColor="bg-emerald-100 text-emerald-700" />
                </div>
            )}

{viewMode === "table" && (
    <Table 
        headers={["Task Title", "Category", "Assignee", "Due Date", "Status"]}
        data={mockTasks}
        renderRow={(task) => (
            <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-800">{task.title}</td>
                <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                        {task.category}
                    </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{task.assignee}</td>
                <td className={`py-3.5 px-4 font-bold text-xs ${task.isLate ? "text-red-500" : "text-slate-500"}`}>
                    {task.dueDate}
                </td>
                <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {task.status}
                    </span>
                </td>
            </tr>
        )}
    />
)}
    <TaskForm 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveTask}
            />
        </div>
    );
}