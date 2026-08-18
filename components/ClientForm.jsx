// components/ClientForm.jsx
"use client";

import { useState } from "react";
import { useClientLookups } from "@/hooks/useClientLookups";

const CLIENT_TYPES = [
  { value: "company", label: "Company" },
  { value: "individual", label: "Individual" },
  { value: "government", label: "Government Entity" },
  { value: "charity", label: "Charity" },
  { value: "agency", label: "Agency" },
];

export default function ClientForm({
  initialData = null,
  onSubmit,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border"
      dir="ltr"
    >
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Client Details" : "Add New Client"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Client Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Client Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Client Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500"
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
          <label className="block text-sm font-medium mb-1">City</label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleChange}
            disabled={loadingLookups}
            className="w-full border p-2 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500"
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
          <label className="block text-sm font-medium mb-1">Industry</label>
          <select
            name="industry_id"
            value={formData.industry_id}
            onChange={handleChange}
            disabled={loadingLookups}
            className="w-full border p-2 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500"
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
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : initialData
            ? "Save Changes"
            : "Add Client"}
      </button>
    </form>
  );
}
