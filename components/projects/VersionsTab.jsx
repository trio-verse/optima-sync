"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock, Loader2, Trash2, Pencil, X } from "lucide-react";
import { getVersions, getVersionById, updateVersion, freezeVersion, deleteVersion } from "@/actions/versionActions";

export default function VersionsTab({
    projectId,
    orgId,
    versionsData: initialVersionsData = [],
    selectedVersionId,
    setSelectedVersionId,
    handleAcknowledgeFork,
    forkAcknowledged
}) {
    const router = useRouter();

    const [versionsData, setVersionsData] = useState(initialVersionsData);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingId, setLoadingId] = useState(false);
    const [fetchingId, setFetchingId] = useState(null);

    const [editingVersion, setEditingVersion] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "", changeDescription: "" });
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");

    useEffect(() => {
        setVersionsData(initialVersionsData);
    }, [initialVersionsData]);

    const selectedVersion = versionsData.find((v) => Number(v.id) === Number(selectedVersionId)) || versionsData[0];
    const isFrozen = selectedVersion?.freeze;

    const refreshVersions = async () => {
        setRefreshing(true);
        try {
            const res = await getVersions(projectId, orgId);
            if (res?.success) {
                setVersionsData(res.data || []);
            }
        } catch (err) {
            console.error("Failed to refresh versions", err);
        } finally {
            setRefreshing(false);
        }
    };

    const handleSelectVersion = async (vId) => {
        setSelectedVersionId(vId);
        setFetchingId(vId);
        try {
            await getVersionById(projectId, vId, orgId);
        } catch (err) {
            console.error("Failed to fetch version details", err);
        } finally {
            setFetchingId(null);
        }
    };

    const handleFreeze = async (versionId) => {
        setLoadingId(versionId);
        try {
            const res = await freezeVersion(projectId, versionId, orgId);
            if (!res?.success) {
                alert(res?.message || "Failed to freeze version");
                return;
            }
            await refreshVersions();
            router.refresh(); 
        } catch (err) {
            alert(err?.message || "Failed to freeze version");
        } finally {
            setLoadingId(false);
        }
    };

    const handleDelete = async (versionId) => {
        if (!window.confirm("Are you sure you want to delete this version?")) return;
        setLoadingId(versionId);
        try {
            const res = await deleteVersion(projectId, versionId, orgId);
            if (!res?.success) {
                alert(res?.message || "Failed to delete version");
                return;
            }
            await refreshVersions();
            router.refresh();
        } catch (err) {
            alert(err?.message || "Failed to delete version");
        } finally {
            setLoadingId(false);
        }
    };

    const handleOpenEdit = (v, e) => {
        e.stopPropagation();
        setEditingVersion(v);
        setEditForm({
            title: v.title || "",
            description: v.description || "",
            changeDescription: v.change_description || "",
        });
        setEditError("");
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingVersion) return;

        setEditSaving(true);
        setEditError("");
        try {
            const res = await updateVersion(projectId, editingVersion.id, orgId, editForm);
            if (!res?.success) {
                setEditError(res?.message || "Failed to update version");
                return;
            }

            setVersionsData((prev) =>
                prev.map((v) =>
                    v.id === editingVersion.id
                        ? { ...v, ...res.data, title: res.data?.title ?? editForm.title, description: res.data?.description ?? editForm.description, change_description: res.data?.change_description ?? editForm.changeDescription }
                        : v
                )
            );

            setEditingVersion(null);
            router.refresh();
        } catch (err) {
            setEditError(err?.message || "Failed to update version");
        } finally {
            setEditSaving(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            {isFrozen && !forkAcknowledged && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
                    <div className="flex items-start sm:items-center gap-2.5">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                        <span className="leading-relaxed">
                            You are viewing a frozen version <strong>(v{selectedVersion?.version_number})</strong>. Making any changes will automatically fork and create a new active version branch.
                        </span>
                    </div>
                    {handleAcknowledgeFork && (
                        <button 
                            onClick={handleAcknowledgeFork}
                            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 text-center cursor-pointer"
                        >
                            confirm
                        </button>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Project Versions Timeline</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Manage and track project versions and snapshots.</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={refreshVersions}
                            disabled={refreshing}
                            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition shrink-0 cursor-pointer"
                            title="Refresh versions"
                        >
                            <Loader2 className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : "hidden"}`} />
                            {!refreshing && <span className="text-xs font-semibold px-1">Refresh</span>}
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {versionsData.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400">No versions available.</div>
                    ) : (
                        versionsData.map((v) => (
                            <div 
                                key={v.id} 
                                onClick={() => handleSelectVersion(v.id)}
                                className={`p-3.5 sm:p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                    Number(v.id) === Number(selectedVersionId) ? "border-blue-500 bg-blue-50/20" : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex items-start sm:items-center gap-3">
                                    <span className="px-2.5 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg shrink-0 mt-0.5 sm:mt-0">
                                        v{v.version_number}
                                    </span>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-800 break-words flex items-center gap-2">
                                            {v.title || "Untitled Version"}
                                            {fetchingId === v.id && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
                                        </p>
                                        {v.change_description && (
                                            <p className="text-[10px] sm:text-xs text-blue-500 italic">
                                                {v.change_description}
                                            </p>
                                        )}
                                        <p className="text-[10px] sm:text-xs text-slate-400">
                                            Created: {v.created_at ? new Date(v.created_at).toLocaleDateString() : "N/A"} by {v.created_by_user?.name || "Admin"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-center">
                                    {v.freeze ? (
                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Frozen
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1">
                                            <Unlock className="w-3 h-3" /> Active
                                        </span>
                                    )}

                                    {!v.freeze && (
                                        <button
                                            onClick={(e) => handleOpenEdit(v, e)}
                                            disabled={loadingId === v.id}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                                            title="Edit version"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    )}

                                    {!v.freeze && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFreeze(v.id);
                                            }}
                                            disabled={loadingId === v.id}
                                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                                        >
                                            {loadingId === v.id && <Loader2 className="w-3 h-3 animate-spin" />}
                                            Freeze
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(v.id);
                                        }}
                                        disabled={loadingId === v.id}
                                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                        title="Delete version"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal: Edit Version (Update Version) */}
            {editingVersion && (
                <div 
                    onClick={() => !editSaving && setEditingVersion(null)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs"
                    >
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="font-bold text-slate-900 text-sm">
                                Edit Version v{editingVersion.version_number}
                            </h3>
                            <button 
                                onClick={() => setEditingVersion(null)} 
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {editError && (
                            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-center font-medium">
                                {editError}
                            </div>
                        )}

                        <form onSubmit={handleSaveEdit} className="space-y-3">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Title</label>
                                <input 
                                    type="text" 
                                    value={editForm.title} 
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Description</label>
                                <textarea
                                    rows={3}
                                    value={editForm.description} 
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Change Description</label>
                                <textarea
                                    rows={2}
                                    value={editForm.changeDescription} 
                                    onChange={(e) => setEditForm({ ...editForm, changeDescription: e.target.value })} 
                                    placeholder="e.g. Scope changed after client review"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button 
                                    type="button"
                                    disabled={editSaving}
                                    onClick={() => setEditingVersion(null)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={editSaving}
                                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {editSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}