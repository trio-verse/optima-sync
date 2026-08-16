"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import { updateClient, getClients } from "@/actions/clientActions";

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

  useEffect(() => {
    async function fetchClient() {
      setLoading(true);
      const res = await getClients({},orgId);
      if (res.success) {
        const found = res.data.find((c) => String(c.id) === String(clientId));
        setClientData(found || null);
      }
      setLoading(false);
    }
    fetchClient();
  }, [clientId,orgId]);

  const handleUpdate = async (formDataPayload) => {
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await updateClient(clientId, formDataPayload,orgId);

    if (res.success) {
      setClientData(res.data || { ...clientData, ...formDataPayload });
      setIsEditing(false);
      router.refresh();
    } else {
      setErrorMsg(res.message || "فشل تحديث البيانات");
    }
    setIsSubmitting(false);
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
    </div>
  );
}
