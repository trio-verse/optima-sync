"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ClientForm from "@/components/ClientForm";

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

      try {
        const [clientRes, stakeholderRes] = await Promise.all([
          getClients({}, orgId),
          getStakeholders(orgId, clientId)
        ]);

        if (clientRes?.success) {
          const found = clientRes.data.find((c) => String(c.id) === String(clientId));
          setClientData(found || null);
        }

        if (stakeholderRes?.success) {
          setStakeholders(stakeholderRes.data || []);
        } else {
          console.error("Failed to load stakeholders", stakeholderRes?.message);
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [orgId, clientId]);

  const resetAddForm = () => {
    setIsAdding(false);
    setNewData({ name: "", phone: "", role: "" });
    setAddError("");
  };

  const handleAdd = async (e) => {
    if (e) e.preventDefault();

    if (!newData.name.trim() || !newData.phone.trim()) {
      setAddError("الاسم ورقم الهاتف مطلوبان.");
      return;
    }

    setSaving(true);
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
      const created = res.data || { id: Date.now(), ...newData };
      setStakeholders((prev) => [created, ...prev]);
      resetAddForm();
    } else {
      setAddError(res?.message || "تعذر إضافة صاحب المصلحة.");
    }
    setSaving(false);
  };

  const handleUpdate = async (formDataPayload) => {
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await updateClient(clientId, formDataPayload, orgId);

    if (res.success) {
      setClientData(res.data || { ...clientData, ...formDataPayload });
      setIsEditing(false);
      router.refresh();
    } else {
      setErrorMsg(res.message || "فشل تحديث البيانات");
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
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse" dir="rtl">
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
      <div className="p-12 max-w-lg mx-auto text-center" dir="rtl">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl space-y-3">
          <p className="text-lg font-bold">العميل غير موجود</p>
          <p className="text-sm text-red-500">
            تعذر العثور على العميل المطلوب أو قد يكون تم حذفه.
          </p>
          <button
            onClick={() => router.push("/clients")}
            className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            الرجوع لقائمة العملاء
          </button>
        </div>
      </div>
    );
  }

  // استخراج البيانات لسهولة القراءة
  const clientType = clientData.type || clientData.client_type || "-";
  const cityName =
    clientData.address?.city?.name || clientData.city?.name || "-";
  const industryName = clientData.industry?.name || "-";
  const phone = clientData.contact_info?.phone || clientData.phone || "-";
  const email = clientData.contact_info?.email || clientData.email || "-";
  const whatsapp =
    clientData.contact_info?.whatsapp || clientData.whatsapp || "-";
  const fullAddress = clientData.address?.raw || clientData.address || "-";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
            {clientData.name?.[0] || "ع"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {clientData.name}
            </h1>
            <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
              {clientType}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
            isEditing
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10"
          }`}
        >
          {isEditing ? "إلغاء التعديل" : "تعديل الملف الشخصي"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {errorMsg}
        </div>
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
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">
              بيانات النشاط والموقع
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  المجال / الصناعة
                </span>
                <p className="text-gray-800 font-semibold mt-0.5">
                  {industryName}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  المدينة
                </span>
                <p className="text-gray-800 font-semibold mt-0.5">{cityName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  العنوان التفصيلي
                </span>
                <p className="text-gray-800 font-semibold mt-0.5">
                  {fullAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">
              معلومات الاتصال
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  رقم الهاتف
                </span>
                <p className="text-gray-800 font-semibold mt-0.5" dir="ltr">
                  {phone}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  واتساب
                </span>
                <p className="text-gray-800 font-semibold mt-0.5" dir="ltr">
                  {whatsapp}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  البريد الإلكتروني
                </span>
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
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3 border-gray-100">
              ملاحظات
            </h2>
            <p className="text-gray-600 leading-relaxed pt-1">
              {clientData.notes || "لا توجد ملاحظات مسجلة لهذا العميل."}
            </p>
          </div>
        </div>
      )}

      {/* Dialog إضافة صاحب مصلحة جديد */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                إضافة صاحب مصلحة جديد
              </h3>
              <button
                type="button"
                onClick={resetAddForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  الاسم *
                </label>
                <input
                  type="text"
                  placeholder="أدخل الاسم"
                  value={newData.name}
                  onChange={(e) => {
                    setNewData((p) => ({ ...p, name: e.target.value }));
                    if (addError) setAddError("");
                  }}
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="text"
                  placeholder="أدخل رقم الهاتف"
                  value={newData.phone}
                  onChange={(e) => setNewData((p) => ({ ...p, phone: e.target.value }))}
                  disabled={saving}
                  dir="ltr"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  الدور / المنصب
                </label>
                <input
                  type="text"
                  placeholder="مثال: مدير مشتريات"
                  value={newData.role}
                  onChange={(e) => setNewData((p) => ({ ...p, role: e.target.value }))}
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {addError && (
                <p className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-lg">
                  {addError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  disabled={saving}
                  onClick={resetAddForm}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog تعديل صاحب مصلحة */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                تعديل بيانات صاحب المصلحة
              </h3>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  الاسم *
                </label>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData((p) => ({ ...p, name: e.target.value }))}
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="text"
                  value={editingData.phone}
                  onChange={(e) => setEditingData((p) => ({ ...p, phone: e.target.value }))}
                  disabled={saving}
                  dir="ltr"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  الدور / المنصب
                </label>
                <input
                  type="text"
                  value={editingData.role}
                  onChange={(e) => setEditingData((p) => ({ ...p, role: e.target.value }))}
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveEdit(editingId)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog تأكيد الحذف */}
      {deletingStakeholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">حذف صاحب المصلحة</h3>
              <p className="text-sm text-gray-500 mt-1">
                هل أنت تأكد من إزالة <span className="font-semibold text-gray-800">{deletingStakeholder.name}</span>؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setDeletingStakeholder(null)}
                className="w-1/2 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleDelete(deletingStakeholder.id)}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}