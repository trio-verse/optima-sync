"use client";

import { useState, useMemo, useEffect } from "react";
import { Info, GitBranch, Layers, DollarSign, Users, Video, FileText, Lock } from "lucide-react";

import ProjectHeader from "./ProjectHeader";
import OverviewTab from "./OverviewTab";
import VersionsTab from "./VersionsTab";
import FeaturesTab from "./FeaturesTab";
import ExpensesTab from "./ExpensesTab";

import MeetingsTab from "./MeetingsTab";


export default function ProjectDetailsView({ initialData, orgId, projectId }) {
    const [activeTab, setActiveTab] = useState("info");
   
    const [projectData, setProjectData] = useState(initialData || {});

    useEffect(() => {
        setProjectData(initialData || {});
    }, [initialData]);

    const { 
        current_version = {},
        freeze_versions_data = [], 
        features = [], 
        costs = [], 
        quotations = [],
        employees = [] 
    } = projectData;

    const project = projectData; 
    const versions_data = freeze_versions_data; 

    const [selectedVersionId, setSelectedVersionId] = useState(
        current_version?.id || versions_data[0]?.id
    );

  
    useEffect(() => {
        if (current_version?.id) {
            setSelectedVersionId(current_version.id);
        }
    }, [current_version?.id]);

    const activeVersionObj = useMemo(() => {
        return versions_data.find(v => Number(v.id) === Number(selectedVersionId)) || current_version || {};
    }, [versions_data, selectedVersionId, current_version]);

    const isFrozen = Boolean(activeVersionObj?.freeze);

  
    const [forkAcknowledged, setForkAcknowledged] = useState(false);


    useEffect(() => {
        setForkAcknowledged(false);
    }, [current_version?.id]);

    const isEditingAllowed = Boolean(activeVersionObj?.is_editable) || forkAcknowledged;

    const handleAcknowledgeFork = () => {
        setForkAcknowledged(true);
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 bg-slate-50/50 min-h-screen text-slate-800" dir="ltr">

            {isFrozen && !forkAcknowledged && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
                    <div className="flex items-start sm:items-center gap-2.5">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                        <span className="leading-relaxed">
                            أنت تعرض إصداراً مجمّداً <strong>(v{activeVersionObj?.version_number})</strong>. أي تعديل (على الميزات، التكاليف، الفريق، أو الاجتماعات) سيُنشئ نسخة جديدة نشطة تلقائياً.
                        </span>
                    </div>
                    <button
                        onClick={handleAcknowledgeFork}
                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-4 py-1.5 rounded-xl font-bold transition shrink-0 text-center cursor-pointer"
                    >
                        موافق
                    </button>
                </div>
            )}

            <ProjectHeader
                project={project}
                currentVersion={current_version}
                versionsData={versions_data}
                orgId={orgId}
                selectedVersionId={selectedVersionId}
                setSelectedVersionId={setSelectedVersionId}
            />

            <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-2 sm:px-4 rounded-xl shadow-sm overflow-x-auto scrollbar-none">
                {[
                    { id: "info", label: "Overview", icon: Info },
                    { id: "versions", label: `Versions (${versions_data?.length || 0})`, icon: GitBranch },
                    { id: "features", label: `Features (${features?.length || 0})`, icon: Layers },
                    { id: "expenses", label: `Costs (${costs?.length || 0})`, icon: DollarSign },
                    { id: "team", label: `Team (${employees?.length || 0})`, icon: Users },
                    { id: "meetings", label: "Meetings", icon: Video },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                                isActive
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                            }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "info" && (
                <OverviewTab
                    project={project}
                    activeVersionObj={activeVersionObj}
                />
            )}

            {/* TAB 2: VERSIONS HISTORY */}
            {activeTab === "versions" && (
                <VersionsTab
                    projectId={projectId}
                    orgId={orgId}
                    versionsData={versions_data}
                    selectedVersionId={selectedVersionId}
                    setSelectedVersionId={setSelectedVersionId}
                    handleAcknowledgeFork={handleAcknowledgeFork}
                    forkAcknowledged={forkAcknowledged}
                />
            )}

            {/* TAB 3: FEATURES */}
            {activeTab === "features" && (
                <FeaturesTab
                    projectId={projectId}
                    orgId={orgId}
                    features={features}
                    activeVersionObj={activeVersionObj}
                    isEditingAllowed={isEditingAllowed}
                />
            )}

            {/* TAB 4: COSTS */}
            {activeTab === "expenses" && (
                <ExpensesTab
                    projectId={projectId}
                    orgId={orgId}
                    costs={costs}
                    activeVersionObj={activeVersionObj}
                    isEditingAllowed={isEditingAllowed}
                />
            )}

            {/* TAB 5: TEAM / EMPLOYEES */}
            {activeTab === "team" && (
                <TeamTab
                    projectId={projectId}
                    orgId={orgId}
                    activeVersionObj={activeVersionObj}
                    isEditingAllowed={isEditingAllowed}
                />
            )}

            {/* TAB 6: MEETINGS */}
            {activeTab === "meetings" && (
                <MeetingsTab
                    projectId={projectId}
                    orgId={orgId}
                    meetings={projectData?.meetings || []}
                    activeVersionObj={activeVersionObj}
                    isEditingAllowed={isEditingAllowed}
                />
            )}


        </div>
    );
}