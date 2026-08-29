"use client";

import { useState } from "react";
import { useClientLookups } from "@/hooks/useClientLookups";
import { Loader2, Plus, UserCheck , X} from "lucide-react";

const CLIENT_TYPES = [
  { value: "company", label: "Company" },
  { value: "individual", label: "Individual" },
  { value: "government", label: "Government" },
  { value: "charity", label: "Charity" },
  { value: "agency", label: "Agency" },
];

const INITIAL_FORM_STATE = {
  name: "",
  type: "individual",
  city_id: "",
  industry_id: "",
  phone: "",
  email: "",
  whatsapp: "",
  facebook: "",
  instagram: "",
  website: "",
  address: "",
  notes: "",
};

export default function ClientForm({
  initialData = null,
  onSubmit,
  onClose,
  isSubmitting,
  orgId,
}) {
  const { cities, industries, loadingLookups } = useClientLookups(orgId);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "individual",
    city_id:
      initialData?.address?.city?.id ||
      initialData?.city?.id ||
      initialData?.city_id ||
      "",
    industry_id: initialData?.industry?.id || initialData?.industry_id || "",
    phone: initialData?.contact_info?.phone || initialData?.phone || "",
    email: initialData?.contact_info?.email || initialData?.email || "",
    whatsapp:
      initialData?.contact_info?.whatsapp || initialData?.whatsapp || "",
    facebook:
      initialData?.contact_info?.facebook || initialData?.facebook || "",
    instagram:
      initialData?.contact_info?.instagram || initialData?.instagram || "",
    website: initialData?.contact_info?.website || initialData?.website || "",
    address: initialData?.address?.raw || initialData?.address || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
  };

  const handleSubmit = (e, actionType = "redirect") => {
    e.preventDefault();
    // نرسل نوع الأكشن (redirect أم add_another) والدالة التابعة لتصفير البيانات
    onSubmit(formData, { actionType, resetForm });
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, "redirect")}
      className="flex flex-col max-w-3xl mx-auto max-h-[85vh] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      dir="ltr"
    >
      {/* Sticky Header */}
      <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">
          {initialData ? "Edit Client Details" : "Add New Client"}
        </h2>
        
        {/* زر الإغلاق */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Form Body */}
      <div className="p-6 overflow-y-auto space-y-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe / Tech Corp"
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Client Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Client Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-200 p-2.5 rounded-xl bg-white text-sm focus:outline-none focus:border-blue-500"
            >
              {CLIENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              City
            </label>
            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              disabled={loadingLookups}
              className="w-full border border-gray-200 p-2.5 rounded-xl bg-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Select city...</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Industry
            </label>
            <select
              name="industry_id"
              value={formData.industry_id}
              onChange={handleChange}
              disabled={loadingLookups}
              className="w-full border border-gray-200 p-2.5 rounded-xl bg-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Select industry...</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              dir="ltr"
              placeholder="+1 234 567 890"
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="client@example.com"
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              dir="ltr"
              placeholder="+1 234 567 890"
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            placeholder="Street details, building number..."
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white resize-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional internal notes..."
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white resize-none"
          />
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 z-10">
        {initialData ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, "add_another")}
              className="w-full sm:w-1/2 bg-white text-gray-700 border border-gray-200 py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Save & Add Another
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, "redirect")}
              className="w-full sm:w-1/2 bg-blue-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              Save & View Profile
            </button>
          </div>
        )}
      </div>
    </form>
  );
}