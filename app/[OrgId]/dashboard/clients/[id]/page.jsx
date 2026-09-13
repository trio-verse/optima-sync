"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import ConnectionsTimeline from "@/components/connections/ConnectionsTimeline";
import { updateClient, getClients } from "@/actions/clientActions";
import {
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Check,
  X,
  Users,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  IdCard,
  ExternalLink,
} from "lucide-react";
import {
  getStakeholders,
  createStakeholder,
  updateStakeholder,
  deleteStakeholder,
} from "@/actions/services/stakeholderService";

export default function ClientProfilePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const clientId = params.id;
  const orgId = params.OrgId || params.orgId;
  const router = useRouter();

  const [clientData, setClientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [stakeholders, setStakeholders] = useState([]);
  const [saving, setSaving] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({ name: "", phone: "", role: "" });
  const [addError, setAddError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: "",
    phone: "",
    role: "",
  });

  const [deletingStakeholder, setDeletingStakeholder] = useState(null);

  useEffect(() => {
    if (!clientId || !orgId) return;

    async function fetchAllData() {
      setLoading(true);
      try {
        const [clientRes, stakeholderRes] = await Promise.all([
          getClients({}, orgId),
          getStakeholders(orgId, clientId),
        ]);

        if (clientRes?.success) {
          const found = clientRes.data.find(
            (c) => String(c.id) === String(clientId),
          );
          setClientData(found || null);
        }

        if (stakeholderRes?.success) {
          setStakeholders(stakeholderRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [clientId, orgId]);

  const handleUpdate = async (formDataPayload) => {
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await updateClient(clientId, formDataPayload, orgId);

    if (res?.success) {
      setClientData(res.data || { ...clientData, ...formDataPayload });
      setIsEditing(false);
      router.refresh();
    } else {
      setErrorMsg(res?.message || "Failed to update client data");
    }
    setIsSubmitting(false);
  };

  const handleAddStakeholder = async (e) => {
    e.preventDefault();
    if (!newData.name.trim() || !newData.phone.trim()) {
      setAddError("Please provide both name and phone number.");
      return;
    }

    setSaving(true);
    setAddError("");

    const res = await createStakeholder(
      clientId,
      {
        name: newData.name.trim(),
        phone: newData.phone.trim(),
        role: newData.role.trim(),
      },
      orgId,
    );

    if (res?.success) {
      if (res.data) {
        setStakeholders((prev) => [...prev, res.data]);
      } else {
        const fresh = await getStakeholders(orgId, clientId);
        if (fresh?.success) setStakeholders(fresh.data || []);
      }
      setIsAdding(false);
      setNewData({ name: "", phone: "", role: "" });
    } else {
      setAddError(res?.message || "Failed to add stakeholder.");
    }
    setSaving(false);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingData({
      name: item.name || "",
      phone: item.phone || "",
      role: item.role || "",
    });
  };

  const handleSaveEdit = async (id) => {
    if (!editingData.name.trim() || !editingData.phone.trim()) return;

    setSaving(true);
    const res = await updateStakeholder({
      stakeholderId: id,
      name: editingData.name.trim(),
      phone: editingData.phone.trim(),
      role: editingData.role.trim(),
      orgId: orgId,
      clientId: clientId,
    });

    if (res?.success) {
      setStakeholders((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                name: editingData.name,
                phone: editingData.phone,
                role: editingData.role,
              }
            : item,
        ),
      );

      setEditingId(null);
      setEditingData({ name: "", phone: "", role: "" });
    } else {
      setAddError(res?.message || "Failed to update stakeholder.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setSaving(true);
    const res = await deleteStakeholder(orgId, clientId, id);
    if (res?.success) {
      setStakeholders((prev) => prev.filter((item) => item.id !== id));
      setDeletingStakeholder(null);
    } else {
      console.error("Failed to delete stakeholder", res?.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse" dir="ltr">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="h-20 bg-gray-100 rounded-2xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="p-12 max-w-md mx-auto text-center" dir="ltr">
        <div className="bg-white border border-gray-100 p-8 rounded-2xl space-y-4 shadow-sm">
          <p className="text-base font-semibold text-gray-900">
            Client Not Found
          </p>
          <p className="text-xs text-gray-500">
            Could not find the requested client or it may have been removed.
          </p>
          <button
            onClick={() => router.push(`/${orgId}/dashboard/clients`)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Clients
          </button>
        </div>
      </div>
    );
  }

  const clientType = clientData.type || clientData.client_type || "-";
  const cityName =
    clientData.address?.city?.name || clientData.city?.name || "-";
  const industryName = clientData.industry?.name || "-";
  const phone = clientData.contact_info?.phone || clientData.phone || "-";
  const email = clientData.contact_info?.email || clientData.email || "-";
  const website = clientData.contact_info?.website || clientData.website || "-";

  const whatsapp =
    clientData.contact_info?.whatsapp || clientData.whatsapp || "-";
  const fullAddress =
    (typeof clientData.address === "string" ? clientData.address : null) ||
    clientData.address?.raw ||
    clientData.address?.full ||
    "-";

  return (
    <div
      className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 text-gray-800"
      dir="ltr"
    >
      {/* Option 1: Clean Open Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 md:pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => router.push(`/${orgId}/dashboard/clients`)}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition border border-transparent hover:border-gray-200"
            title="Back to Clients"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight truncate">
                {clientData.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              isEditing
                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50/50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <ClientForm
            initialData={clientData}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            orgId={orgId}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stakeholders Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  Stakeholders
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setNewData({ name: "", phone: "", role: "" });
                    setAddError("");
                    setIsAdding(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Add Stakeholder Form */}
              {isAdding && (
                <form
                  onSubmit={handleAddStakeholder}
                  className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={newData.name}
                      onChange={(e) =>
                        setNewData({ ...newData, name: e.target.value })
                      }
                      className="p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone *"
                      value={newData.phone}
                      onChange={(e) =>
                        setNewData({ ...newData, phone: e.target.value })
                      }
                      className="p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
                      dir="ltr"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={newData.role}
                      onChange={(e) =>
                        setNewData({ ...newData, role: e.target.value })
                      }
                      className="p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
                    />
                  </div>
                  {addError && (
                    <p className="text-[11px] text-red-500">{addError}</p>
                  )}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-700 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                      Save
                    </button>
                  </div>
                </form>
              )}

              {stakeholders.length === 0 && !isAdding ? (
                <p className="text-gray-400 text-xs py-1">
                  No stakeholders added.
                </p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {stakeholders.map((s) =>
                    editingId === s.id ? (
                      <div key={s.id} className="py-3 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editingData.name}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                name: e.target.value,
                              })
                            }
                            className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                          />
                          <input
                            type="text"
                            value={editingData.phone}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            value={editingData.role}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                role: e.target.value,
                              })
                            }
                            className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleSaveEdit(s.id)}
                            className="px-3 py-1 bg-gray-900 text-white text-xs rounded-md hover:bg-gray-800"
                          >
                            {saving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={s.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="font-semibold text-gray-800">
                            {s.name}
                          </span>
                          <span
                            className="text-gray-400 font-mono text-[11px]"
                            dir="ltr"
                          >
                            {s.phone}
                          </span>
                          {s.role && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-500 font-medium shrink-0">
                              {s.role}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 pt-1 sm:pt-0">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => startEdit(s)}
                            className="text-gray-400 hover:text-gray-700 p-1"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => setDeletingStakeholder(s)}
                            className="text-gray-400 hover:text-red-600 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Timeline */}
            <ConnectionsTimeline clientId={clientId} orgId={orgId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Type Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                Client Type
              </h2>
              <p className=" flex items-center gap-3 text-gray-500 text-xs leading-relaxed pt-1">
                <IdCard className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-800" dir="ltr">
                  {" "}
                  {clientType}
                </span>
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">
                Contact Info
              </h2>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                      Phone
                    </span>
                    <span className="font-medium text-gray-800" dir="ltr">
                      {phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                      WhatsApp
                    </span>
                    <span className="font-medium text-gray-800" dir="ltr">
                      {whatsapp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                      Email
                    </span>
                    <span className="font-medium text-gray-800">{email}</span>
                  </div>
                </div>
                <a
                  href={
                    website?.startsWith("http") ? website : `https://${website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 shrink-0 transition-colors" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                      Website
                    </span>
                    <span className="font-medium text-gray-800 group-hover:text-blue-600 group-hover:underline transition-colors">
                      {website}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Industry & Location Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">
                Location & Field
              </h2>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                      Industry
                    </span>
                    <span className="font-medium text-gray-800">
                      {industryName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                      Address
                    </span>
                    <span className="font-medium text-gray-800 block">
                      {cityName}
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      {fullAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Notes Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Notes
              </h2>
              <p className="text-gray-500 text-xs leading-relaxed pt-1">
                {clientData.notes || "No notes registered."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStakeholder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 space-y-3 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Delete Stakeholder
              </h3>
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Are you sure you want to remove{" "}
              <span className="font-medium text-gray-800">
                {deletingStakeholder.name}
              </span>
              ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStakeholder(null)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleDelete(deletingStakeholder.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
