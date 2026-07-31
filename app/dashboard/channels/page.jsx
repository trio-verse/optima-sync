"use client";

import { useState, useEffect } from "react";
import { Plus, Check, X, Radio, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { createChannel, updateChannel, deleteChannel, getChannels } from "@/app/actions/services/channelService";

export default function ChannelsPage() {
    const [channels, setChannels] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("#2563eb");
    const [addError, setAddError] = useState("");
    const [search, setSearch] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingColor, setEditingColor] = useState("");

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function fetchChannelsData() {
            setLoading(true);
            const result = await getChannels();
            if (result?.success) {
                setChannels(result?.data || []);
            } else {
                console.error("Failed to load channels:", result?.message);
            }
            setLoading(false);
        }
        fetchChannelsData();
    }, []);


    const handleAddChannel = async (e) => {
        e.preventDefault();

        if (!newName.trim()) {
            setAddError("Channel name is required.");
            return;
        }

        const isDuplicate = channels.some(
            (item) => item.name.toLowerCase() === newName.trim().toLowerCase()
        );

        if (isDuplicate) {
            setAddError("A channel with this name already exists.");
            return;
        }

        setLoading(true);
        const result = await createChannel(newName.trim(), newColor);

        if (result?.success) {
            const createdItem = result.data || {
                id: result.id,
                name: newName.trim(),
                color: newColor,
                createdAt: new Date().toISOString(),
            };

            setChannels((prev) => [createdItem, ...prev]);
            setNewName("");
            setNewColor("#2563eb");
            setAddError("");
            setIsAdding(false);
        } else {
            console.error(result?.message, "Failed to add channel");
            setAddError(result?.message || "Could not save channel, please try again.");
        }
        setLoading(false);
    };


    const handleSaveEdit = async (id) => {
        if (!editingName.trim()) return;

        const isDuplicate = channels.some(
            (item) => item.id !== id && item.name.toLowerCase() === editingName.trim().toLowerCase()
        );

        if (isDuplicate) {
            alert("A channel with this name already exists.");
            return;
        }

        setLoading(true);
        const result = await updateChannel(id, editingName.trim(), editingColor);

        if (result?.success) {
            setChannels((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, name: editingName.trim(), color: editingColor } : item
                )
            );
            setEditingId(null);
            setEditingName("");
            setEditingColor("");
        } else {
            console.error("Failed to update channel:", result?.message);
        }
        setLoading(false);
    };


    const handleDelete = async (id) => {
        setLoading(true);
        const result = await deleteChannel(id);

        if (result?.success) {
            setChannels((prev) => prev.filter((item) => item.id !== id));
        } else {
            console.error("Delete Failed:", result?.message);
        }

        setLoading(false);
    };

    const filteredChannels = channels.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col gap-6">


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
                            <Radio className="w-7 h-7 text-blue-600" />
                            Channels Management
                        </h1>
                        <p className="text-zinc-500 text-xs mt-1 font-medium">
                            Manage and organize the communication channels available in your system.
                        </p>
                    </div>

                    {!isAdding && (
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => setIsAdding(true)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Channel</span>
                        </button>
                    )}
                </div>


                {isAdding && (
                    <form
                        onSubmit={handleAddChannel}
                        className="bg-blue-50/40 border border-blue-200 p-5 rounded-2xl shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                            New Channel
                        </span>
                        <div className="flex items-center gap-2.5">
                            <input
                                type="color"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                disabled={loading}
                                className="w-10 h-10 rounded-xl border border-zinc-300 p-1 cursor-pointer bg-white shrink-0 disabled:opacity-50"
                                title="Choose channel color"
                            />
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                    if (addError) setAddError("");
                                }}
                                disabled={loading}
                                placeholder="Enter channel name (e.g. WhatsApp, Email, Telegram)..."
                                autoFocus
                                className={`bg-white border text-zinc-900 rounded-xl px-4 py-2.5 text-sm outline-none w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${addError ? "border-rose-500 bg-rose-50/20" : "border-zinc-300"
                                    }`}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                <span>{loading ? "Saving..." : "Save Channel"}</span>
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewName("");
                                    setAddError("");
                                }}
                                className="p-2.5 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all shrink-0 cursor-pointer disabled:opacity-50"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {addError && <span className="text-rose-500 text-xs font-medium px-1">{addError}</span>}
                    </form>
                )}


                {channels.length > 0 && (
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search channels..."
                            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {loading && channels.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200/80 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="text-zinc-500 text-sm font-medium">Loading channels...</p>
                        </div>
                    ) : (
                        filteredChannels.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow transition-all group"
                            >
                                {editingId === item.id ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <input
                                            type="color"
                                            value={editingColor}
                                            onChange={(e) => setEditingColor(e.target.value)}
                                            disabled={loading}
                                            className="w-9 h-9 rounded-lg border border-zinc-300 p-0.5 cursor-pointer bg-white shrink-0"
                                        />

                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            disabled={loading}
                                            autoFocus
                                            className="bg-white border border-blue-500 rounded-xl px-3 py-1.5 text-sm text-zinc-900 outline-none w-full"
                                        />
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => handleSaveEdit(item.id)}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => setEditingId(null)}
                                            className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shrink-0 border border-black/10 shadow-sm"
                                                style={{ backgroundColor: item.color || "#2563eb" }}
                                            >
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-zinc-800 font-semibold text-sm">
                                                {item.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => {
                                                    setEditingId(item.id);
                                                    setEditingName(item.name);
                                                    setEditingColor(item.color || "#2563eb");
                                                }}
                                                className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}

                    {!loading && filteredChannels.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2">
                            <Radio className="w-10 h-10 text-zinc-300" />
                            <p className="text-zinc-500 text-sm font-semibold">No channels found.</p>
                            <p className="text-zinc-400 text-xs">Try adding a new channel or clearing the search filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}