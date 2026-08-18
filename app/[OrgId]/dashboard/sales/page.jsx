"use client";

import { useState, useEffect, use, useCallback } from "react";
import {
  Link2,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Tag,
  User,
  ArrowRightLeft,
  Search,
  Filter,
} from "lucide-react";
import {
  getAllConnections,
  deleteConnection,
} from "@/actions/connectionActions";
import ConnectionModal from "@/components/connections/ConnectionForm";

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
  win: {
    label: "Won",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  closed: { 
    label: "Closed", 
    color: "bg-red-100 text-red-700 border-red-200" 
  },
};

const INITIATED_LABELS = {
  CLIENT: "Client",
  SALES_REP: "Sales Rep",
};

export default function AllSalesConnectionsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orgId = params.OrgId;

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  /* ── Fetch Organization Connections ── */
  const fetchAllConnectionsData = useCallback(async () => {
    setLoading(true);
    const res = await getAllConnections(orgId);
    if (res?.success) {
      setConnections(res.data || []);
    }
    setLoading(false);
  }, [orgId]);

  useEffect(() => {
    fetchAllConnectionsData();
  }, [fetchAllConnectionsData]);

  /* ── Success Handler ── */
  const handleSuccess = (updatedConnection) => {
    setToast({ type: "success", message: "Connection updated successfully!" });
    setTimeout(() => setToast(null), 3000);

    setConnections((prev) =>
      prev.map((c) =>
        c.id === updatedConnection?.id ? { ...c, ...updatedConnection } : c,
      ),
    );
    setEditingConnection(null);
  };

  const handleEdit = (conn) => {
    setEditingConnection(conn);
    setIsModalOpen(true);
  };

  const handleDelete = async (conn) => {
    if (!confirm("Are you sure you want to delete this connection?")) return;
    setDeletingId(conn.id);
    const res = await deleteConnection(
      conn.id,
      orgId,
      conn.client_id || conn.client?.id,
    );
    if (res?.success) {
      setConnections((prev) => prev.filter((c) => c.id !== conn.id));
      setToast({ type: "success", message: "Deleted successfully" });
    } else {
      setToast({ type: "error", message: res?.message || "Delete failed" });
    }
    setDeletingId(null);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Data Filtering ── */
  const filteredConnections = connections.filter((conn) => {
    const clientName = conn.client?.name || "";
    const productName = conn.product?.name || "";
    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = selectedStage ? conn.stage === selectedStage : true;

    return matchesSearch && matchesStage;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6" dir="ltr">
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

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl border border-orange-100">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              All Clients Connections Log
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage and track all interactions and stages across all clients in one place
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Stage Filter Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
          >
            <option value="">All Stages</option>
            {Object.entries(STAGES)
              .slice(0, 7)
              .map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Connections List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm font-semibold">
            Loading connections log...
          </p>
        </div>
      ) : filteredConnections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Link2 className="w-6 h-6" />
          </div>
          <p className="text-slate-700 text-sm font-bold">
            No matching connections found
          </p>
          <p className="text-slate-400 text-xs">
            Try changing the search query or adjusting the selected filter
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredConnections.map((conn) => {
            const rawStage = conn.stage ? String(conn.stage).toLowerCase() : "lead";
            const stageInfo = STAGES[rawStage] || STAGES.lead;
            const clientName = conn.client?.name || "Unknown Client";

            return (
              <div
                key={conn.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col gap-2 flex-1">
                  {/* Top Bar: Stage, Client Name & Initiator */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-slate-900 text-base bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                      {clientName}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${stageInfo.color}`}
                    >
                      {stageInfo.label}
                    </span>
                    {conn.initiated_by && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        <ArrowRightLeft className="w-3 h-3" />
                        {INITIATED_LABELS[conn.initiated_by] ||
                          conn.initiated_by}
                      </span>
                    )}
                  </div>

                  {/* Details Bar */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap mt-1">
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

                  {/* Date */}
                  <p className="text-xs text-slate-400 mt-1">
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

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(conn)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(conn)}
                    disabled={deletingId === conn.id}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-40"
                    title="Delete"
                  >
                    {deletingId === conn.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal (reusing ConnectionModal) */}
      {editingConnection && (
        <ConnectionModal
          clientId={editingConnection.client_id || editingConnection.client?.id}
          orgId={orgId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingConnection(null);
          }}
          onSuccess={handleSuccess}
          editingConnection={editingConnection}
        />
      )}
    </div>
  );
}