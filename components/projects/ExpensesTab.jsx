"use client";

import { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, X, AlertTriangle, DollarSign, Loader2 } from "lucide-react";
import { createProjectCost, updateProjectCost, deleteProjectCost ,getProjectCosts} from "@/actions/expenseActions";

export default function ExpensesTab({
    projectId,
    orgId,
    costs = [],
    activeVersionObj,
    isEditingAllowed
}) {
    const router = useRouter();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [costToDelete, setCostToDelete] = useState(null);
    const [editingCostId, setEditingCostId] = useState(null);

    // Form States matching Backend fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [costsList, setCostsList] = useState(costs);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setCostsList(costs);
    }, [costs]);

const fetchCosts = async () => {
        setFetching(true);
        try {
            const res = await getProjectCosts(projectId, orgId);
            if (res?.success) {
                setCostsList(res.data);
            }
        } catch (error) {
            console.error("Failed to load costs", error);
        } finally {
            setFetching(false);
        }
    };
    const handleOpenAddModal = () => {
        setEditingCostId(null);
        setName("");
        setDescription("");
        setAmount("");
        setQuantity(1);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingCostId(item.id);
        setName(item.name || "");
        setDescription(item.description || "");
        setAmount(item.amount || "");
        setQuantity(item.quantity || 1);
        setIsFormModalOpen(true);
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { 
                name, 
                description, 
                amount: Number(amount), 
                quantity: Number(quantity) 
            };

            if (editingCostId) {
                await updateProjectCost(projectId, editingCostId, orgId, payload);
            } else {
                await createProjectCost(projectId, orgId, payload);
            }

            setIsFormModalOpen(false);
            await fetchCosts();
        } catch (error) {
            alert(error?.message || "Something went wrong while saving cost.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCost = async () => {
        if (!costToDelete) return;
        setLoading(true);

        try {
            await deleteProjectCost(projectId, costToDelete.id, orgId);
            setCostToDelete(null);
            await fetchCosts();
        } catch (error) {
            alert(error?.message || "Failed to delete cost item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 w-full">
            {/* Header Block & Add Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        Costs Breakdown ({activeVersionObj?.version_number || activeVersionObj?.versionNumber || "v1.0"})
                    </h3>
                    <p className="text-xs text-slate-500">Manage expense items and track overall project costs for this version.</p>
                </div>
                {isEditingAllowed && (
                    <button
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add Cost Item
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-3 sm:p-4">
                {fetching && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center gap-2 text-slate-600 text-xs font-medium">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span>Updating costs...</span>
                    </div>
                )}
                {/* 1. Mobile Cards View */}
                <div className="block md:hidden space-y-3">
                    {costsList.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                            No costs added to this project yet.
                        </div>
                    ) : (
                        costsList.map((item, idx) => (
                            <div key={item.id || idx} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800 text-sm break-words">{item.name}</h4>
                                        {item.description && (
                                            <p className="text-xs text-slate-500">{item.description}</p>
                                        )}
                                    </div>
                                    <span className="font-bold text-red-600 text-sm shrink-0">
                                        ${item.formatted_line_total || item.line_total || item.amount}
                                    </span>
                                </div>

                                {isEditingAllowed && (
                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50">
                                        <button
                                            onClick={() => handleOpenEditModal(item)}
                                            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-medium flex items-center gap-1 shadow-sm active:bg-slate-100"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setCostToDelete(item)}
                                            className="px-3 py-1 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm active:bg-red-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* 2. Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase">
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Cost Item</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4">Qty</th>
                                <th className="py-3 px-4">Unit Price</th>
                                <th className="py-3 px-4">Total</th>
                                {isEditingAllowed && <th className="py-3 px-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {costsList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400">
                                        No costs added to this project yet.
                                    </td>
                                </tr>
                            ) : (
                                costsList.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-slate-50/50">
                                        <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                                        <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                                        <td className="py-3 px-4 text-slate-600">{item.description || "-"}</td>
                                        <td className="py-3 px-4 text-slate-600">{item.quantity || 1}</td>
                                        <td className="py-3 px-4 text-slate-600">${item.formatted_amount || item.amount}</td>
                                        <td className="py-3 px-4 font-bold text-red-600">
                                            ${item.formatted_line_total || item.line_total || item.amount}
                                        </td>
                                        {isEditingAllowed && (
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setCostToDelete(item)}
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

            {/* Modal: Add / Edit Expense Dialog */}
            {isFormModalOpen && (
                <div 
                    onClick={() => setIsFormModalOpen(false)}
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
                                    {editingCostId ? "Edit Cost Item" : "Add Cost Item"}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsFormModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={onSubmitForm} className="p-4 sm:p-5 space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Cost Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Stripe Account, Server Hosting" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Description</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Account for global payment transactions" 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Quantity</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-slate-700">Amount ($) *</label>
                                    <div className="relative">
                                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            placeholder="0.00" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 text-xs"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingCostId ? "Update Cost" : "Add Cost"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dialog: Delete Confirmation Modal */}
            {costToDelete && (
                <div 
                    onClick={() => setCostToDelete(null)}
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
                            <h3 className="font-bold text-slate-900 text-base">Remove Cost Item?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <span className="font-semibold text-slate-800">{costToDelete.name}</span> (${costToDelete.amount})?
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setCostToDelete(null)}
                                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCost}
                                disabled={loading}
                                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}