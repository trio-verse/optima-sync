// components/connections/ActivityList.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, User, Calendar, Loader2, Plus } from "lucide-react";
import { getActivities, createActivity } from "@/actions/activityActions"; 
import ActivityModal from "./ActivityModal";

export default function ActivityList({ connectionId, orgId, clientId, connectionName }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleAddActivity = async (content) => {
        setIsSubmitting(true);
        const res = await createActivity(connectionId, content, orgId, clientId);
        if (res?.success) {
            setToast({ type: "success", message: "Activity added successfully!" });
            await fetchActivities();
            setIsModalOpen(false);
        } else {
            setToast({ type: "error", message: res?.message || "Failed to add activity" });
        }
        setIsSubmitting(false);
        setTimeout(() => setToast(null), 3000);
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
        <div className="mt-3 pt-3 border-t border-slate-100">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-5 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-xl shadow-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">
                        Activities ({activities.length})
                    </span>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-all"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Update
                </button>
            </div>

            {/* Activities List */}
            {loading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
            ) : activities.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                    No activities recorded yet. Add the first update!
                </p>
            ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {activities.map((activity, index) => (
                        <div
                            key={activity.id || index}
                            className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-slate-200 transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <User className="w-3.5 h-3.5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 leading-relaxed break-words">
                                        {activity.content}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {activity.created_by?.name || activity.created_by || "Unknown"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(activity.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Activity Modal */}
            <ActivityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddActivity}
                connectionName={connectionName}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}