"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ClientForm from "@/components/ClientForm";

import ConnectionsTimeline from "@/components/connections/ConnectionsTimeline";
import { updateClient, getClients } from "@/actions/clientActions";
import { Pencil, Trash2, Plus, Loader2, Check, X, Users, AlertTriangle } from "lucide-react";
import {
  getStakeholders,
  createStakeholder,
  updateStakeholder,
  deleteStakeholder,
} from "@/actions/services/stakeholderService";

export default function ClientProfilePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const clientId = params.id;
  const orgId = params.OrgId;
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
  const [editingData, setEditingData] = useState({ name: "", phone: "", role: "" });

  // حالة لتخزين صاحب المصلحة المراد حذفه وعرض دايلوج التأكيد
  const [deletingStakeholder, setDeletingStakeholder] = useState(null);

  // جلب بيانات العميل وأصحاب المصلحة معا لتفادي مشاكل الـ Loading المتضاربة
  useEffect(() => {
    if (!clientId || !orgId) return;

    async function fetchAllData() {
      setLoading(true);
      const res = await getClients({}, orgId);
      if (res.success) {
        const found = res.data.find((c) => String(c.id) === String(clientId));
        setClientData(found || null);
      }
    }
    fetchClient();
  }, [clientId, orgId]);

  const handleUpdate = async (formDataPayload) => {
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await updateClient(clientId, formDataPayload, orgId);

    if (res.success) {
      setClientData(res.data || { ...clientData, ...formDataPayload });
      setIsEditing(false);
      router.refresh();
    } else {
      setErrorMsg(res.message || "Failed to update client data");
    }
    setIsSubmitting(false);
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
      clientId: clientId
    });

    if (res?.success) {
      setStakeholders((items) =>
        items.map((item) =>
          item.id === id
            ? { ...item, name: editingData.name, phone: editingData.phone, role: editingData.role }
            : item
        )
      );

      setEditingId(null);
      setEditingData({ name: "", phone: "", role: "" });
    } else {
      setAddError(res?.message || "تعذر تعديل بيانات صاحب المصلحة.");
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
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse" dir="ltr">
        <div className="h-20 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="p-12 max-w-lg mx-auto text-center" dir="ltr">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl space-y-3">
          <p className="text-lg font-bold">Client Not Found</p>
          <p className="text-sm text-red-500">Could not find the requested client or it may have been deleted.</p>
          <button onClick={() => router.push(`/${orgId}/dashboard/clients`)}
            className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">
            Back to Clients List
          </button>
        </div>
      </div>
    );
  }

  const clientType = clientData.type || clientData.client_type || "-";

  const cityName = 
    clientData.address?.city?.name || 
    clientData.city?.name || 
    "-";

  const industryName = clientData.industry?.name || "-";

  const phone = 
    clientData.contact_info?.phone || 
    clientData.phone || 
    "-";

  const email = 
    clientData.contact_info?.email || 
    clientData.email || 
    "-";

  const whatsapp = 
    clientData.contact_info?.whatsapp || 
    clientData.whatsapp || 
    "-";

  const fullAddress = 
    (typeof clientData.address === "string" ? clientData.address : null) ||
    clientData.address?.raw || 
    clientData.address?.full || 
    "-";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6" dir="ltr">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
            {clientData.name?.[0] || "C"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{clientData.name}</h1>
            <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
              {clientType}
            </span>
          </div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
            isEditing
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10"
          }`}>
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{errorMsg}</div>
      )}

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <ClientForm
            initialData={clientData}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            orgId={orgId}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">Industry & Location Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 font-medium block">Industry / Field</span>
                <p className="text-gray-800 font-semibold mt-0.5">{industryName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">City</span>
                <p className="text-gray-800 font-semibold mt-0.5">{cityName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">Full Address</span>
                <p className="text-gray-800 font-semibold mt-0.5">{fullAddress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 font-medium block">Phone Number</span>
                <p className="text-gray-800 font-semibold mt-0.5" dir="ltr">{phone}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">WhatsApp</span>
                <p className="text-gray-800 font-semibold mt-0.5" dir="ltr">{whatsapp}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">Email Address</span>
                <p className="text-gray-800 font-semibold mt-0.5">{email}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                أصحاب المصلحة
              </h2>
              <button
                type="button"
                onClick={() => {
                  setNewData({ name: "", phone: "", role: "" });
                  setAddError("");
                  setIsAdding(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                إضافة صاحب مصلحة
              </button>
            </div>

            {stakeholders.length === 0 ? (
              <p className="text-gray-400 text-sm pt-1">
                لا يوجد أصحاب مصلحة مرتبطين بهذا العميل بعد.
              </p>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                {stakeholders.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-xl p-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-gray-900 font-semibold text-sm min-w-[120px]">
                        {s.name}
                      </span>
                      <span className="text-gray-500 text-sm" dir="ltr">
                        {s.phone}
                      </span>
                      {s.role && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-fit">
                          {s.role}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => startEdit(s)}
                        className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-40"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setDeletingStakeholder(s)}
                        className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">Notes</h2>
            <p className="text-gray-600 leading-relaxed pt-1">
              {clientData.notes || "No notes registered for this client."}
            </p>
          </div>
        </div>
      )}

      {/* Connections Timeline */}
      <ConnectionsTimeline clientId={clientId} orgId={orgId} />
    </div>
  );
}