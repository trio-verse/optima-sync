// components/connections/ActivityModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Send, AlertTriangle } from "lucide-react";

export default function ActivityModal({
    isOpen,
    onClose,
    onSubmit,
    connectionName,
    isSubmitting,
    initialData = null,
}) {
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content || "");
        } else {
            setContent("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError("Please enter activity content");
            return;
        }
        setError("");
        onSubmit(content.trim());
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
            <div
                className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-4 sm:gap-5 animate-in fade-in zoom-in-95 duration-150 border border-slate-100 max-h-[90vh] overflow-y-auto"
                dir="ltr"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3 sm:pb-4 gap-2">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                            {initialData ? "Edit Activity" : "Add New Activity"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                            {connectionName ? `For: ${connectionName}` : "Record a new activity"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Content */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs sm:text-sm font-bold text-slate-700">
                            What is the update? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="Write your activity note here..."
                            rows={4}
                            className={`w-full border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
                                error ? "border-red-300 bg-red-50/30" : "border-slate-200"
                            }`}
                        />
                        {error && (
                            <span className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                {error}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            <span>{isSubmitting ? "Saving..." : initialData ? "Update Activity" : "Add Activity"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}