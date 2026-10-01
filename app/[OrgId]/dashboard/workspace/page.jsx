"use client";

import { useState, use } from "react";
 import { Users, Kanban, Briefcase } from "lucide-react";

// استدعاء مكون الموظفين ومكون مهام الفريق الذي أنشأناه للتو
import EmployeeView from "@/components/workspace/EmployeeView";
import TeamTaskCenter from "@/components/workspace/TeamTaskCenter"; 

export default function WorkspacePage({ params }) {
    const resolvedParams = use(params);
    const orgId = resolvedParams?.OrgId;

    // تبويب افتراضي
    const [activeTab, setActiveTab] = useState("team-tasks");

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6 bg-slate-50 min-h-screen" dir="ltr">
            
            {/* شريط التبويبات العلوي */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                    onClick={() => setActiveTab("my-tasks")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                        activeTab === "my-tasks" ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    <Briefcase className="w-4 h-4" />
                    My Workspace
                </button>

                <button
                    onClick={() => setActiveTab("team-tasks")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                        activeTab === "team-tasks" ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    <Kanban className="w-4 h-4" />
                    Team Task Center
                </button>

                <button
                    onClick={() => setActiveTab("employees")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                        activeTab === "employees" ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    <Users className="w-4 h-4" />
                    Employees
                </button>
            </div>

            {/* منطقة العرض بناءً على التبويب النشط */}
            <div className="w-full">
                
                {activeTab === "my-tasks" && (
                    <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
                        My Workspace View Will Be Here
                    </div>
                )}

                {/* استدعاء المكون هنا */}
                {activeTab === "team-tasks" && (
                    <TeamTaskCenter /> 
                )}

                {activeTab === "employees" && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <EmployeeView orgId={orgId} />
                    </div>
                )}
            </div>

        </div>
    );
}