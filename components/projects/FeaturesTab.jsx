"use client";

import { useState, useEffect, useCallback } from "react";
// 👇 تعديل: تمت إضافة useRouter هنا
import { useRouter } from "next/navigation"; 
import { Plus, Search, Edit3, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import { 
    getProjectFeatures,
    createProjectFeature, 
    updateProjectFeature, 
    deleteProjectFeature ,
    updateProjectFeatureStatus,
} from "@/actions/featureActions";

export default function FeaturesTab({
    projectId,
    orgId,
    features: initialFeatures = [],
    activeVersionObj = {},
    isEditingAllowed = false,
}) {

    const router = useRouter();

    const [featuresList, setFeaturesList] = useState(initialFeatures);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    // Form State
    const [featureName, setFeatureName] = useState("");
    const [featureDesc, setFeatureDesc] = useState("");
    const [featureStatus, setFeatureStatus] = useState("new");

    const fetchFeatures = useCallback(async () => {
        if (!projectId || !orgId) return;
        setIsLoadingData(true);
        try {
            const res = await getProjectFeatures(projectId, orgId);

            const data = res?.data || res || [];
            setFeaturesList(data);
        } catch (err) {
            console.error("Error fetching features:", err);
        } finally {
            setIsLoadingData(false);
        }
    }, [projectId, orgId]);


    useEffect(() => {
        setFeaturesList(initialFeatures);
    }, [initialFeatures]);


    const currentVersionFeatures = activeVersionObj?.freeze
        ? activeVersionObj?.features_snapshot || []
        : featuresList.filter(f => Number(f.project_version_id) === Number(activeVersionObj?.id));

    const filteredFeatures = currentVersionFeatures.filter(f =>
        (f.name || f.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAddModal = () => {
        setEditingFeature(null);
        setFeatureName("");
        setFeatureDesc("");
        setFeatureStatus("new");
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (ft) => {
        setEditingFeature(ft);
        setFeatureName(ft.name || ft.title || "");
        setFeatureDesc(ft.description || "");
        setFeatureStatus(ft.status || "new");
        setIsFormModalOpen(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            name: featureName,
            description: featureDesc,
            status: featureStatus,
            project_version_id: activeVersionObj?.id
        };

        try {
            if (editingFeature) {
                await updateProjectFeature(projectId, editingFeature.id, orgId, payload);
            } else {
                await createProjectFeature(projectId, orgId, payload);
            }
            
            await fetchFeatures();
            setIsFormModalOpen(false);

            router.refresh(); 

        } catch (err) {
            console.error("Error saving feature:", err);
            alert(err?.message || "An error occurred while saving the feature.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInlineStatusChange = async (featureId, newStatus) => {
        const targetFeature = featuresList.find(f => f.id === featureId);
        if (!targetFeature) return;

        setUpdatingStatusId(featureId);

        setFeaturesList(prev =>
            prev.map(f => f.id === featureId ? { ...f, status: newStatus } : f)
        );

        try {
            const res = await updateProjectFeatureStatus(projectId, featureId, orgId, newStatus);
            
            if (res?.data) {
                setFeaturesList(prev =>
                    prev.map(f => f.id === featureId ? res.data : f)
                );
            }

            router.refresh();

        } catch (err) {
            console.error("Error updating status:", err);

            setFeaturesList(prev =>
                prev.map(f => f.id === featureId ? { ...f, status: targetFeature.status } : f)
            );
            alert(err?.message || "Failed to update status.");
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!featureToDelete) return;
        setIsDeleting(true);

        try {
            await deleteProjectFeature(projectId, featureToDelete.id, orgId);

            setFeaturesList(prev => prev.filter(f => f.id !== featureToDelete.id));
            setFeatureToDelete(null);
            

            router.refresh();

        } catch (err) {
            console.error("Error deleting feature:", err);
            alert(err?.message || "An error occurred while deleting the feature.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        Features List (v{activeVersionObj?.version_number || "1"})
                    </h3>
                    <p className="text-xs text-slate-500">Manage and track software features for this version.</p>
                </div>
                
                {isEditingAllowed && (
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Feature
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 pr-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    {isLoadingData && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                </div>

                {/* Mobile Cards View */}
                <div className="block md:hidden space-y-3">
                    {filteredFeatures.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                            No features found.
                        </div>
                    ) : (
                        filteredFeatures.map((ft, idx) => (
                            <div key={ft.id || idx} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800 text-sm">{ft.name || ft.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{ft.description || "No description provided."}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <select
                                            disabled={!isEditingAllowed || updatingStatusId === ft.id}
                                            value={ft.status || "new"}
                                            onChange={(e) => handleInlineStatusChange(ft.id, e.target.value)}
                                            className={`text-[11px] font-bold rounded-lg px-2 py-1 border border-slate-200 focus:outline-none cursor-pointer ${
                                                ft.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                                ft.status === "in_progress" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-blue-50 text-blue-600 border-blue-200"
                                            }`}
                                        >
                                            <option value="new">New</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        {updatingStatusId === ft.id && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                                    </div>

                                    {isEditingAllowed && (
                                        <div className="flex gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditModal(ft)}
                                                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-medium flex items-center gap-1 shadow-sm active:bg-slate-100"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFeatureToDelete(ft)}
                                                className="px-2.5 py-1 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm active:bg-red-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase">
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4">Status</th>
                                {isEditingAllowed && <th className="py-3 px-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredFeatures.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400">
                                        No features found.
                                    </td>
                                </tr>
                            ) : (
                                filteredFeatures.map((ft, idx) => (
                                    <tr key={ft.id || idx} className="hover:bg-slate-50/50">
                                        <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                                        <td className="py-3 px-4 font-bold text-slate-800">{ft.name || ft.title}</td>
                                        <td className="py-3 px-4 text-slate-500">{ft.description || "-"}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <select
                                                    disabled={!isEditingAllowed || updatingStatusId === ft.id}
                                                    value={ft.status || "new"}
                                                    onChange={(e) => handleInlineStatusChange(ft.id, e.target.value)}
                                                    className={`text-[11px] font-bold rounded-lg p-1 border border-slate-200 focus:outline-none cursor-pointer ${
                                                        ft.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                                        ft.status === "in_progress" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-blue-50 text-blue-600 border-blue-200"
                                                    }`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                {updatingStatusId === ft.id && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                                            </div>
                                        </td>
                                        {isEditingAllowed && (
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(ft)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFeatureToDelete(ft)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add / Edit Feature */}
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
                                    {editingFeature ? "Edit Feature" : "Add New Feature"}
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
                                <label className="font-semibold text-slate-700">Feature Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. User Authentication"
                                    value={featureName}
                                    onChange={(e) => setFeatureName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add details about this feature..."
                                    value={featureDesc}
                                    onChange={(e) => setFeatureDesc(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Status</label>
                                <select
                                    value={featureStatus}
                                    onChange={(e) => setFeatureStatus(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                >
                                    <option value="new">New</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
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
                                    {editingFeature ? "Update Feature" : "Add Feature"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Confirmation */}
            {featureToDelete && (
                <div
                    onClick={() => !isDeleting && setFeatureToDelete(null)}
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
                            <h3 className="font-bold text-slate-900 text-base">Remove Feature?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <span className="font-semibold text-slate-800">{featureToDelete.name || featureToDelete.title}</span>?
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setFeatureToDelete(null)}
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