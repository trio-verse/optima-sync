// components/ClientForm.jsx
"use client";

import { useState } from "react";
import { useClientLookups } from "@/hooks/useClientLookups"; 

const CLIENT_TYPES = [
  { value: "company", label: "شركة" },
  { value: "individual", label: "فرد" },
  { value: "government", label: "جهة حكومية" },
  { value: "charity", label: "جمعية خيرية" },
  { value: "agency", label: "وكالة" },
];

export default function ClientForm({ initialData = null, onSubmit, isSubmitting }) {
  const { cities, industries, loadingLookups } = useClientLookups();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    client_type: initialData?.type || initialData?.client_type || "individual",
    city_id: initialData?.address?.city?.id || initialData?.city?.id || initialData?.city_id || "",
    industry_id: initialData?.industry?.id || initialData?.industry_id || "",
    phone: initialData?.contact_info?.phone || initialData?.phone || "",
    email: initialData?.contact_info?.email || initialData?.email || "",
    whatsapp: initialData?.contact_info?.whatsapp || initialData?.whatsapp || "",
    facebook: initialData?.contact_info?.facebook || initialData?.facebook || "",
    instagram: initialData?.contact_info?.instagram || initialData?.instagram || "",
    website: initialData?.contact_info?.website || initialData?.website || "",
    address: initialData?.address?.raw || initialData?.address || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4">{initialData ? "تعديل بيانات العميل" : "إضافة عميل جديد"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium mb-1">اسم العميل *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* نوع العميل */}
        <div>
          <label className="block text-sm font-medium mb-1">نوع العميل</label>
          <select
            name="client_type"
            value={formData.client_type}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg bg-white"
          >
            {CLIENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* المدينة */}
        <div>
          <label className="block text-sm font-medium mb-1">المدينة</label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleChange}
            disabled={loadingLookups}
            className="w-full border p-2 rounded-lg bg-white"
          >
            <option value="">اختر المدينة...</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* المجال / الصناعة */}
        <div>
          <label className="block text-sm font-medium mb-1">الصناعة / المجال</label>
          <select
            name="industry_id"
            value={formData.industry_id}
            onChange={handleChange}
            disabled={loadingLookups}
            className="w-full border p-2 rounded-lg bg-white"
          >
            <option value="">اختر المجال...</option>
            {industries.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name}
              </option>
            ))}
          </select>
        </div>

        {/* الهاتف */}
        <div>
          <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* واتساب */}
        <div>
          <label className="block text-sm font-medium mb-1">واتساب</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* الموقع الإلكتروني */}
        <div>
          <label className="block text-sm font-medium mb-1">الموقع الإلكتروني</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>
      </div>

      {/* العنوان التفصيلي */}
      <div>
        <label className="block text-sm font-medium mb-1">العنوان</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          className="w-full border p-2 rounded-lg"
        />
      </div>

      {/* ملاحظات */}
      <div>
        <label className="block text-sm font-medium mb-1">ملاحظات</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 rounded-lg"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة العميل"}
      </button>
    </form>
  );
}