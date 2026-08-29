"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, User, Calendar, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { getActivities, createActivity, updateActivity, deleteActivity } from "@/actions/activityActions"; 
import ActivityModal from "./ActivityModal";

export default function ActivityList({ connectionId, orgId, clientId, connectionName }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchActivities = useCallback(async () => {
        if (!connectionId || !orgId) return;
        setLoading(true);
        const res = await getActivities(connectionId, orgId);
        if (res?.success) {
            setActivities(res.data || []);
        }
        setLoading(false);
    }, [connectionId, orgId]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleSaveActivity = async (content) => {
        setIsSubmitting(true);
        let res;
        
        if (editingActivity) {
            res = await updateActivity(connectionId, editingActivity.id, content, orgId, clientId);
        } else {
            res = await createActivity(connectionId, content, orgId, clientId);
        }

        if (res?.success) {
            setToast({ type: "success", message: res.message || "Operation successful" });
            await fetchActivities();
            handleCloseModal();
        } else {
            setToast({ type: "error", message: res?.message || "Operation failed" });
        }
        setIsSubmitting(false);
        setTimeout(() => setToast(null), 3000);
    };

    const handleDeleteActivity = async (activityId) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        
        const res = await deleteActivity(connectionId, activityId, orgId, clientId);
        if (res?.success) {
            setActivities(prev => prev.filter(item => item.id !== activityId));
            setToast({ type: "success", message: "Activity deleted" });
        } else {
            setToast({ type: "error", message: res?.message || "Failed to delete activity" });
        }
        setTimeout(() => setToast(null), 3000);
    };

    const handleOpenEdit = (act) => {
        setEditingActivity(act);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingActivity(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="mt-3 pt-3 border-t border-slate-100 relative">
            {/* Toast Notification - Responsive centering and widths */}
            {toast && (
                <div
                    className={`fixed top-5 left-1/2 -translate-x-1/2 z-[70] max-w-[90vw] sm:max-w-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-xs sm:text-sm font-bold text-center animate-in fade-in slide-in-from-top-2 ${
                        toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Header Section */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-600 truncate">
                        Activities ({activities.length})
                    </span>
                </div>
                <button
                    onClick={() => {
                        setEditingActivity(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 text-xs font-semibold rounded-lg transition-all shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">Add Update</span>
                </button>
            </div>

            {/* Content State */}
            {loading ? (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
            ) : activities.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 text-center sm:text-left">
                    No activities recorded yet. Add the first update!
                </p>
            ) : (
                <div className="space-y-2.5 max-h-72 sm:max-h-60 overflow-y-auto pr-1">
                    {activities.map((activity, index) => (
                        <div
                            key={activity.id || index}
                            className="group relative bg-slate-50 rounded-xl p-2.5 sm:p-3 border border-slate-100 hover:border-slate-200 transition-all"
                        >
                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words pr-14 sm:pr-12">
                                        {activity.content}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[11px] sm:text-xs text-slate-400">
                                        <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-none">
                                            <User className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{activity.user?.name || "Unknown"}</span>
                                        </span>
                                        <span className="flex items-center gap-1 shrink-0">
                                            <Calendar className="w-3 h-3 shrink-0" />
                                            {formatDate(activity.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions: Always visible on touch screens, hover-only on larger screens */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-slate-50/80 sm:bg-transparent rounded-lg p-0.5">
                                <button
                                    onClick={() => handleOpenEdit(activity)}
                                    className="p-1 sm:p-1.5 text-slate-400 hover:text-blue-600 active:text-blue-700 rounded-md hover:bg-white transition-all"
                                    title="Edit"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteActivity(activity.id)}
                                    className="p-1 sm:p-1.5 text-slate-400 hover:text-red-600 active:text-red-700 rounded-md hover:bg-white transition-all"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ActivityModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveActivity}
                connectionName={connectionName}
                isSubmitting={isSubmitting}
                initialData={editingActivity}
            />
        </div>
    );
}