"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar, Clock, MapPin, Edit3, Trash2, X, AlertTriangle, Loader2, Link as LinkIcon } from "lucide-react";
import {
    getProjectMeetings,
    createProjectMeeting,
    updateProjectMeeting,
    deleteProjectMeeting
} from "@/actions/meetingActions";

export default function MeetingsTab({
    projectId,
    orgId,
    meetings: initialMeetings = [],
    activeVersionObj = {},
    isEditingAllowed = false,
}) {
    const router = useRouter();

    const [meetingsList, setMeetingsList] = useState(initialMeetings);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [meetingToDelete, setMeetingToDelete] = useState(null);


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [meetingUrl, setMeetingUrl] = useState("");

    const fetchMeetings = useCallback(async () => {
        if (!projectId || !orgId) return;
        setIsLoadingData(true);
        try {
            const res = await getProjectMeetings(projectId, orgId);
            const data = res?.data || res || [];
            if (Array.isArray(data)) {
                setMeetingsList(data);
            }
        } catch (err) {
            console.error("Error fetching meetings:", err);
        } finally {
            setIsLoadingData(false);
        }
    }, [projectId, orgId]);
    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const handleOpenAddModal = () => {
        setEditingMeeting(null);
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setMeetingUrl("");
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (m) => {
        setEditingMeeting(m);
        setTitle(m.title || "");
        setDescription(m.description || "");
        setMeetingUrl(m.meeting_url || m.location || "");

        if (m.meeting_date) {
            const d = new Date(m.meeting_date);
            if (!isNaN(d.getTime())) {
                setDate(d.toISOString().split("T")[0]);
                setTime(d.toTimeString().split(" ")[0].substring(0, 5));
            } else {
                setDate("");
                setTime("");
            }
        } else {
            setDate(m.date || "");
            setTime(m.time || "");
        }
        setIsFormModalOpen(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let combinedDateTime = null;
        if (date) {
            const timeString = time ? `${time}:00` : "00:00:00";
            combinedDateTime = new Date(`${date}T${timeString}`).toISOString();
        }

        const payload = {
            title,
            description,
            meeting_date: combinedDateTime,
            meeting_url: meetingUrl || null,
            stakeholders: editingMeeting?.stakeholders || [],
            team_members: editingMeeting?.team_members || [],
        };

        try {
            if (editingMeeting) {

                setMeetingsList(prev => prev.map(m => m.id === editingMeeting.id ? { ...m, ...payload } : m));
                await updateProjectMeeting(projectId, editingMeeting.id, orgId, payload);
            } else {

                const tempId = Date.now();
                const newMeeting = { ...payload, id: tempId };
                setMeetingsList(prev => [newMeeting, ...prev]);

                const res = await createProjectMeeting(projectId, orgId, payload);


                if (res?.data?.id) {
                    setMeetingsList(prev => prev.map(m => m.id === tempId ? { ...m, ...res.data } : m));
                }
            }

            setIsFormModalOpen(false);

            router.refresh();

        } catch (err) {
            console.error("Error saving meeting:", err);
            fetchMeetings();
            alert(err?.message || "An error occurred while saving the meeting.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!meetingToDelete) return;
        setIsDeleting(true);
        const deletedId = meetingToDelete.id;

        try {

            setMeetingsList(prev => prev.filter(m => m.id !== deletedId));
            setMeetingToDelete(null);

            await deleteProjectMeeting(projectId, deletedId, orgId);
            router.refresh();
        } catch (err) {
            console.error("Error deleting meeting:", err);
            fetchMeetings();
            alert(err?.message || "An error occurred while deleting the meeting.");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatMeetingDateTime = (dateStr) => {
        if (!dateStr) return { date: "N/A", time: "N/A" };
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return { date: dateStr, time: "" };
        return {
            date: d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        };
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        Meetings ({activeVersionObj?.version_number ? `v${activeVersionObj.version_number}` : "v1.0"})
                    </h3>
                    <p className="text-xs text-slate-500">Schedule and manage project meetings for this version.</p>
                </div>

                {isEditingAllowed && (
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Schedule New Meeting
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-3 shadow-sm relative">
                {isLoadingData && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                )}

                {meetingsList.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs">
                        No meetings scheduled for this project.
                    </div>
                ) : (
                    meetingsList.map((m) => {
                        const { date: formattedDate, time: formattedTime } = formatMeetingDateTime(m.meeting_date || m.date);

                        return (
                            <div
                                key={m.id}
                                className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                            >
                                <div className="space-y-1.5">
                                    <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                                    {m.description && (
                                        <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {formattedDate}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {formattedTime || m.time || "N/A"}
                                        </span>
                                        {(m.meeting_url || m.location) && (
                                            <a
                                                href={m.meeting_url || m.location}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 text-blue-600 hover:underline"
                                            >
                                                <LinkIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span className="truncate max-w-[200px]">{m.meeting_url || m.location}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {isEditingAllowed && (
                                    <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/50 w-full sm:w-auto justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(m)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMeetingToDelete(m)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {isFormModalOpen && (
                <div
                    onClick={() => !isSubmitting && setIsFormModalOpen(false)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 cursor-default"
                    >
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">
                                    {editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}
                                </h3>
                            </div>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setIsFormModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="p-4 sm:p-5 space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Meeting Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Client Review Meeting"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="Add meeting agenda or notes..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Date *</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Meeting URL / Link</label>
                                <input
                                    type="text"
                                    placeholder="e.g. https://zoom.us/j/987654321"
                                    value={meetingUrl}
                                    onChange={(e) => setMeetingUrl(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {meetingToDelete && (
                <div
                    onClick={() => !isDeleting && setMeetingToDelete(null)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center cursor-default"
                    >
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Remove Meeting?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to delete <span className="font-semibold text-slate-800">{meetingToDelete.title}</span>?
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setMeetingToDelete(null)}
                                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteConfirm}
                                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}