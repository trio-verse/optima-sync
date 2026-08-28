"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Check,
  X,
  Building2,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Palette,
  AlertTriangle,
} from "lucide-react";

import {
  creatIndustry,
  updateIndustry,
  deleteIndustry,
  getindustries,
} from "@/actions/services/industryService";

const PRESET_COLORS = [
  "#2563eb", // Blue
  "#7c3aed", // Violet
  "#db2777", // Pink
  "#ea580c", // Orange
  "#16a34a", // Green
  "#0891b2", // Cyan
  "#4b5563", // Slate
];

export default function IndustriesPage({ params }) {
  const queryClient = useQueryClient();
  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#2563eb");
  const [addError, setAddError] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");

  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const { data: industries = [], isLoading: loadingFetch } = useQuery({
    queryKey: ["industries", orgId],
    queryFn: async () => {
      const result = await getindustries(orgId);
      if (result?.success) return result?.data || [];
      throw new Error(result?.message || "Failed to load industries");
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: ({ name, color }) => creatIndustry(name, color, orgId),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["industries", orgId] });
        queryClient.invalidateQueries({ queryKey: ["clientLookups", orgId] });
        setNewName("");
        setNewColor("#2563eb");
        setAddError("");
        setIsAdding(false);
      } else {
        setAddError(result?.message || "Could not save industry, please try again.");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, color }) => updateIndustry(id, name, color, orgId),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["industries", orgId] });
        queryClient.invalidateQueries({ queryKey: ["clientLookups", orgId] });
        setEditingId(null);
        setEditingName("");
        setEditingColor("");
      } else {
        console.error("Failed to update industry", result?.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteIndustry(id, orgId),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["industries", orgId] });
        queryClient.invalidateQueries({ queryKey: ["clientLookups", orgId] });
        setDeletingItem(null);
        setDeleteError("");
      } else {
        setDeleteError("Cannot delete this industry because it is linked to existing clients.");
      }
    },
  });

  const loading =
    addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleAddIndustry = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setAddError("Industry name is required.");
      return;
    }
    const isDuplicate = industries.some(
      (item) => item.name.toLowerCase() === newName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setAddError("An industry with this name already exists.");
      return;
    }
    addMutation.mutate({ name: newName.trim(), color: newColor });
  };

  const handleSaveEdit = (id) => {
    if (!editingName.trim()) return;
    const isDuplicate = industries.some(
      (item) =>
        item.id !== id &&
        item.name.toLowerCase() === editingName.trim().toLowerCase()
    );
    if (isDuplicate) {
      alert("An industry with this name already exists.");
      return;
    }
    updateMutation.mutate({ id, name: editingName.trim(), color: editingColor });
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    setDeleteError("");
    deleteMutation.mutate(deletingItem.id);
  };

  const filteredIndustries = industries.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
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
              disabled={loading || loadingFetch}
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Industry</span>
            </button>
          )}
        </div>

        {/* 1. نموذج الإضافة */}
        {isAdding && (
          <form
            onSubmit={handleAddIndustry}
            className="bg-white border border-blue-200 p-6 rounded-2xl shadow-md flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" /> New Industry
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                  setAddError("");
                }}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Industry Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (addError) setAddError("");
                  }}
                  disabled={loading}
                  placeholder="e.g. Software, Healthcare..."
                  autoFocus
                  className={`bg-zinc-50 border text-zinc-900 rounded-xl px-4 py-2.5 text-sm outline-none w-full focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                    addError ? "border-rose-500 bg-rose-50/20" : "border-zinc-200"
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                  <span>Theme Color</span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {newColor.toUpperCase()}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 flex-1 overflow-x-auto">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-6 h-6 rounded-lg shrink-0 transition-transform ${
                          newColor === c
                            ? "scale-110 ring-2 ring-offset-1 ring-blue-600"
                            : "hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <label
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer shrink-0 transition text-xs text-zinc-700 font-medium"
                    title="Custom color picker"
                  >
                    <Palette className="w-4 h-4 text-zinc-500" />
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      disabled={loading}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            {addError && (
              <span className="text-rose-500 text-xs font-medium">
                {addError}
              </span>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                  setAddError("");
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{addMutation.isPending ? "Saving..." : "Save Industry"}</span>
              </button>
            </div>
          </form>
        )}

        {industries.length > 0 && (
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search industries..."
              className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {loadingFetch ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200/80 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-zinc-500 text-sm font-medium">
                Loading industries...
              </p>
            </div>
          ) : (
            filteredIndustries.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow transition-all"
              >
                {editingId === item.id ? (
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={loading}
                      autoFocus
                      className="bg-zinc-50 border border-blue-500 rounded-xl px-3 py-2 text-sm text-zinc-900 outline-none flex-1 focus:bg-white"
                    />

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 overflow-x-auto">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditingColor(c)}
                            className={`w-6 h-6 rounded-lg shrink-0 transition-transform ${
                              editingColor === c
                                ? "scale-110 ring-2 ring-offset-1 ring-blue-600"
                                : "hover:scale-105 opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <label
                        className="flex items-center gap-1.5 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer shrink-0 transition text-xs text-zinc-700 font-medium"
                        title="Custom color picker"
                      >
                        <Palette className="w-4 h-4 text-zinc-500" />
                        <input
                          type="color"
                          value={editingColor}
                          onChange={(e) => setEditingColor(e.target.value)}
                          disabled={loading}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 justify-end">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSaveEdit(item.id)}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                        title="Save"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setEditingId(null)}
                        className="p-2 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color || "#2563eb" }}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-zinc-800 font-semibold text-sm">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingName(item.name);
                          setEditingColor(item.color || "#2563eb");
                        }}
                        className="p-2 text-zinc-600 bg-zinc-50 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200/60 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setDeletingItem(item);
                          setDeleteError("");
                        }}
                        className="p-2 text-zinc-600 bg-zinc-50 hover:bg-rose-50 hover:text-rose-600 border border-zinc-200/60 rounded-xl transition-all cursor-pointer disabled:opacity-40"
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

          {!loadingFetch && filteredIndustries.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2">
              <Building2 className="w-10 h-10 text-zinc-300" />
              <p className="text-zinc-500 text-sm font-semibold">
                No industries added yet.
              </p>
              <p className="text-zinc-400 text-xs">
                Click the Add Industry button above to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-zinc-100 shadow-xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-base">
                  Delete Industry
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-zinc-800">
                    {deletingItem.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setDeletingItem(null);
                  setDeleteError("");
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={confirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deleteMutation.isPending ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}