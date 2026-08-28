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
import {
  getConnections,
  deleteConnection,
  updateConnectionStage,
} from "@/actions/connectionActions";
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

  // State for Delete Dialog
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
  const handleSuccess = async () => {
    setToast({ type: "success", message: "Connection saved successfully!" });
    setTimeout(() => setToast(null), 3000);
    await fetchConnections();
    setEditingConnection(null);
  };

  /* ── Quick Stage Change Handler ── */
  const handleStageChange = async (connectionId, newStage, currentConn) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === connectionId ? { ...c, stage: newStage } : c))
    );

    const payload = {
      stage: newStage,
      dealValue:
        newStage === "win" || newStage === "won"
          ? currentConn.product?.price || currentConn.deal_value || 0
          : undefined,
    };

    const res = await updateConnectionStage(
      connectionId,
      payload,
      orgId,
      clientId
    );

    if (res?.success) {
      setToast({ type: "success", message: "Stage updated successfully!" });
    } else {
      setConnections((prev) =>
        prev.map((c) =>
          c.id === connectionId ? { ...c, stage: currentConn.stage } : c
        )
      );
      setToast({
        type: "error",
        message: res?.message || "Failed to update stage",
      });
    }

    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (conn) => {
    setEditingConnection(conn);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (conn) => {
    setDeleteDialog({
      isOpen: true,
      connectionId: conn.id,
      connectionName: conn.product?.name || "this connection",
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      connectionId: null,
      connectionName: "",
    });
  };

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
    <div
      className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
      dir="ltr"
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl shadow-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete connection{" "}
              <span className="font-semibold text-gray-900">
                {deleteDialog.connectionName}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDeleteDialog}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === deleteDialog.connectionId}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 transition disabled:opacity-50 shadow-sm"
              >
                {deletingId === deleteDialog.connectionId && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-gray-400" />
          Connections Log
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingConnection(null);
            setIsModalOpen(true);
          }}
         className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Connection
        </button>
      </div>

      {/* Loading / Empty / List */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-gray-400 text-xs font-medium">
            Loading connections...
          </p>
        </div>
      ) : connections.length === 0 ? (
        <p className="text-gray-400 text-sm pt-1">
          No connections recorded yet for this client.
        </p>
      ) : (
        <div className="flex flex-col gap-2 pt-1">
          {connections.map((conn, index) => {
            const rawStage = conn.stage
              ? String(conn.stage).toLowerCase()
              : "lead";
            const stageInfo = STAGES[rawStage] || STAGES.lead;
            const uniqueKey = conn.id ? `${conn.id}-${index}` : index;

            return (
              <div
                key={uniqueKey}
                className="flex flex-col gap-3 border border-gray-100 rounded-xl p-3 hover:bg-gray-50/50 transition-colors"
              >
                {/* Details Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                    {/* اسم المنتج */}
                    <span className="text-gray-900 font-semibold text-sm min-w-[120px] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-gray-400" />
                      {conn.product?.name || "N/A"}
                    </span>

                    {/* قائمة المنسدلة للـ Stage */}
                    <select
                      value={rawStage}
                      onChange={(e) =>
                        handleStageChange(conn.id, e.target.value, conn)
                      }
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border outline-none cursor-pointer transition-all ${stageInfo.color}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.entries(STAGES).map(([key, { label }]) => (
                        <option
                          key={key}
                          value={key}
                          className="bg-white text-gray-800 font-normal"
                        >
                          {label}
                        </option>
                      ))}
                    </select>

                    {/* القناة / Channel */}
                    {conn.channel?.name && (
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        <span
                          style={{
                            color: conn.channel?.color || "#2563eb",
                          }}
                        >
                          {conn.channel.name}
                        </span>
                      </span>
                    )}

                    {/* Assignee */}
                    {conn.assignee?.name && (
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {conn.assignee.name}
                      </span>
                    )}

                    {/* Initiated By */}
                    {conn.initiated_by && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {INITIATED_LABELS[conn.initiated_by] ||
                          conn.initiated_by}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(conn)}
                      className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === conn.id}
                      onClick={() => openDeleteDialog(conn)}
                      className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
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
                  connectionName={`${
                    conn.product?.name || "Connection"
                  } - ${stageInfo.label}`}
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingConnection(null);
        }}
        onSuccess={handleSuccess}
        editingConnection={editingConnection}
      />
    </div>
  );
}