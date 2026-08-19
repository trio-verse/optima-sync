// components/connections/ConnectionsTimeline.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Link2,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Tag,
  User,
  ArrowRightLeft,
  AlertTriangle,
  X,
} from "lucide-react";
import { getConnections, deleteConnection } from "@/actions/connectionActions";
import ConnectionModal from "@/components/connections/ConnectionForm";
import ActivityList from "./ActivityList";

/* ── STAGES (Lowercase) ── */
const STAGES = {
  lead: {
    label: "Lead",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  conected: {
    label: "Contacted",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  missing_info: {
    label: "Missing Info",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  intrested: {
    label: "Interested",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  not_intrested: {
    label: "Not Interested",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  win: { label: "Won", color: "bg-green-100 text-green-700 border-green-200" },
  closed: { label: "Closed", color: "bg-red-100 text-red-700 border-red-200" },
};

const INITIATED_LABELS = {
  CLIENT: "Client",
  SALES_REP: "Sales Rep",
};

export default function ConnectionsTimeline({ clientId, orgId }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  // 👇 State for Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    connectionId: null,
    connectionName: "",
  });

  /* ── Fetch Connections ── */
  const fetchConnections = useCallback(async () => {
    setLoading(true);
    const res = await getConnections(clientId, orgId);
    if (res?.success) setConnections(res.data || []);
    setLoading(false);
  }, [clientId, orgId]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  /* ── On Success ── */
  const handleSuccess = async (newConnection) => {
    setToast({ type: "success", message: "Connection saved successfully!" });
    setTimeout(() => setToast(null), 3000);

    if (editingConnection) {
      setConnections((prev) =>
        prev.map((c) =>
          c.id === newConnection?.id ? { ...c, ...newConnection } : c,
        ),
      );
    } else {
      setConnections((prev) => [newConnection, ...prev]);
    }
    await fetchConnections();
    setEditingConnection(null);
  };

  const handleEdit = (conn) => {
    setEditingConnection(conn);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConnection(null);
  };

  // 👇 Open Delete Dialog instead of confirm()
  const openDeleteDialog = (conn) => {
    setDeleteDialog({
      isOpen: true,
      connectionId: conn.id,
      connectionName: conn.product?.name || "this connection",
    });
  };

  // 👇 Close Delete Dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      connectionId: null,
      connectionName: "",
    });
  };

  // 👇 Handle Delete
  const handleDelete = async () => {
    const id = deleteDialog.connectionId;
    if (!id) return;

    setDeletingId(id);
    closeDeleteDialog();

    const res = await deleteConnection(id, orgId, clientId);
    if (res?.success) {
      setConnections((prev) => prev.filter((c) => c.id !== id));
      setToast({ type: "success", message: "Deleted successfully" });
    } else {
      setToast({ type: "error", message: res?.message || "Delete failed" });
    }
    setDeletingId(null);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-5" dir="ltr">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl shadow-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ============================================ */}
      {/* 🗑️ Delete Confirmation Dialog */}
      {/* ============================================ */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delete Connection</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={closeDeleteDialog}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {deleteDialog.connectionName}
                </span>
                ?
              </p>
              <p className="text-xs text-slate-400 mt-2">
                All activities related to this connection will also be removed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId === deleteDialog.connectionId}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-red-600/20 transition-all disabled:opacity-50"
              >
                {deletingId === deleteDialog.connectionId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Connections Log
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Track all interactions and deals with this client
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingConnection(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Connection</span>
        </button>
      </div>

      {/* Loading / Empty / List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm font-semibold">
            Loading connections...
          </p>
        </div>
      ) : connections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-slate-700 text-sm font-bold">
            No connections recorded
          </p>
          <p className="text-slate-400 text-xs">
            Click New Connection to record the first interaction with the
            client
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {connections.map((conn, index) => {
            const rawStage = conn.stage
              ? String(conn.stage).toLowerCase()
              : "lead";
            const stageInfo = STAGES[rawStage] || STAGES.lead;
            const uniqueKey = conn.id ? `${conn.id}-${index}` : index;

            return (
              <div
                key={uniqueKey}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
              >
                {/* Connection Details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${stageInfo.color}`}
                      >
                        {stageInfo.label}
                      </span>
                      {conn.initiated_by && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <ArrowRightLeft className="w-3 h-3" />
                          {INITIATED_LABELS[conn.initiated_by] ||
                            conn.initiated_by}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                      {conn.product?.name && (
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">
                            {conn.product.name}
                          </span>
                        </span>
                      )}
                      {conn.channel?.name && (
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span
                            style={{ color: conn.channel?.color || "#2563eb" }}
                            className="font-semibold"
                          >
                            {conn.channel.name}
                          </span>
                        </span>
                      )}
                      {conn.assignee?.name && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{conn.assignee.name}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      {conn.created_at
                        ? new Date(conn.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(conn)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {/* 👇 زر الحذف - يفتح Dialog بدلاً من confirm */}
                    <button
                      onClick={() => openDeleteDialog(conn)}
                      disabled={deletingId === conn.id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Activities Component */}
                <ActivityList
                  connectionId={conn.id}
                  orgId={orgId}
                  clientId={clientId}
                  connectionName={`${conn.product?.name || "Connection"} - ${stageInfo.label}`}
                />
              </div>
            );
          })}
        </div>
      )}

      <ConnectionModal
        clientId={clientId}
        orgId={orgId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingConnection={editingConnection}
      />
    </div>
  );
}