"use client";

import { useState } from "react";
import { Plus, Check, X, Building2, Pencil, Trash2, Search } from "lucide-react";
import { creatIndustry } from "@/app/actions/services/industryService";
export default function IndustriesPage() {

    const [industries, setIndustries] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [addError, setAddError] = useState("");


    const [searchQuery, setSearchQuery] = useState("");


    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");


    const handleAddIndustry = async(e) => {
        e.preventDefault();
        
        if (!newName.trim()) {
            setAddError("Industry name is required.");
            return;
        }

        const newIndustry=  {
            id: Date.now(), 
            name: newName.trim(),
        };
        const result = await creatIndustry({name:newName});
        setIndustries((prev) => [newIndustry, ...prev]);
        setNewName("");
        setAddError("");
        setIsAdding(false);
    };


    const handleSaveEdit = (id) => {
        if (!editingName.trim()) return;

        setIndustries((prev) =>
            prev.map((item) => (item.id === id ? { ...item, name: editingName.trim() } : item))
        );
        setEditingId(null);
        setEditingName("");

    };


    const handleDelete = (id) => {
        setIndustries((prev) => prev.filter((item) => item.id !== id));
    };

    const filteredIndustries = industries.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col gap-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
                            <Building2 className="w-7 h-7 text-blue-600" />
                            Industries & Specializations
                        </h1>
                        <p className="text-zinc-500 text-xs mt-1 font-medium">
                            Manage and organize the industries available in your system.
                        </p>
                    </div>


                    {!isAdding && (
                        <button
                            type="button"
                            onClick={() => setIsAdding(true)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Industry</span>
                        </button>
                    )}
                </div>


                {isAdding && (
                    <form
                        onSubmit={handleAddIndustry}
                        className="bg-blue-50/40 border border-blue-200 p-5 rounded-2xl shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                            New Industry
                        </span>
                        <div className="flex items-center gap-2.5">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                    if (addError) setAddError("");
                                }}
                                placeholder="Enter industry name (e.g. Software, Healthcare)..."
                                autoFocus
                                className={`bg-white border text-zinc-900 rounded-xl px-4 py-2.5 text-sm outline-none w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                                    addError ? "border-rose-500 bg-rose-50/20" : "border-zinc-300"
                                }`}
                            />


                            <button
                                type="submit"
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                            >
                                <Check className="w-4 h-4" />
                                <span>Save</span>
                            </button>


                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewName("");
                                    setAddError("");
                                }}
                                className="p-2.5 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all shrink-0 cursor-pointer"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {addError && <span className="text-rose-500 text-xs font-medium px-1">{addError}</span>}
                    </form>
                )}


                {industries.length > 0 && (
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search industries..."
                            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {filteredIndustries.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow transition-all group"
                        >
                            {editingId === item.id ? (

                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        autoFocus
                                        className="bg-white border border-blue-500 rounded-xl px-3 py-1.5 text-sm text-zinc-900 outline-none w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSaveEdit(item.id)}
                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shrink-0 cursor-pointer"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-all shrink-0 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (

                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-zinc-800 font-semibold text-sm">
                                            {item.name}
                                        </span>
                                    </div>


                                    <div className="flex items-center gap-1.5 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(item.id);
                                                setEditingName(item.name);
                                            }}
                                            className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {industries.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2">
                            <Building2 className="w-10 h-10 text-zinc-300" />
                            <p className="text-zinc-500 text-sm font-semibold">No industries added yet.</p>
                            <p className="text-zinc-400 text-xs">Click the Add Industry button above to get started.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}