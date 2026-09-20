"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useClientLookups } from "@/hooks/useClientLookups";
import { Loader2, Plus, UserCheck, X, MapPin, Palette, Building2 } from "lucide-react";
import { clientSchema } from "@/lib/validations/clientSchema"; // قم بتعديل المسار بحسب مكان ملف السكيما لديك
import { createCity } from "@/actions/services/cityService"; // عدّل المسار إذا كان مختلف عندك
import { createIndustry } from "@/actions/services/industryService"; // عدّل المسار إذا كان مختلف عندك

const CLIENT_TYPES = [
  { value: "company", label: "Company" },
  { value: "individual", label: "Individual" },
  { value: "government", label: "Government" },
  { value: "charity", label: "Charity" },
  { value: "agency", label: "Agency" },
];

const PRESET_COLORS = [
  "#2563eb", // Blue
  "#7c3aed", // Violet
  "#db2777", // Pink
  "#ea580c", // Orange
  "#16a34a", // Green
  "#0891b2", // Cyan
  "#4b5563", // Slate
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
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "individual",
    city_id: String(
      initialData?.address?.city?.id ||
        initialData?.city?.id ||
        initialData?.city_id ||
        ""
    ),
    industry_id: String(
      initialData?.industry?.id || initialData?.industry_id || ""
    ),
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


  const [errors, setErrors] = useState({});


  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCityColor, setNewCityColor] = useState("#2563eb");
  const [cityModalError, setCityModalError] = useState("");

  const addCityMutation = useMutation({
    mutationFn: () => createCity(newCityName.trim(), newCityColor, orgId),
    onSuccess: (result) => {
      if (result?.success) {

        queryClient.invalidateQueries({ queryKey: ["clientLookups", orgId] });
        queryClient.invalidateQueries({ queryKey: ["cities", orgId] });


        if (result.id) {
          setFormData((prev) => ({ ...prev, city_id: String(result.id) }));
        }

        setNewCityName("");
        setNewCityColor("#2563eb");
        setCityModalError("");
        setIsCityModalOpen(false);
      } else {
        setCityModalError(
          result?.message || "Could not save city, please try again."
        );
      }
    },
  });

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCityName.trim()) {
      setCityModalError("City name is required.");
      return;
    }
    const isDuplicate = cities.some(
      (c) => c.name.toLowerCase() === newCityName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setCityModalError("This city already exists.");
      return;
    }
    setCityModalError("");
    addCityMutation.mutate();
  };

  const closeCityModal = () => {
    setIsCityModalOpen(false);
    setNewCityName("");
    setNewCityColor("#2563eb");
    setCityModalError("");
  };


  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [newIndustryName, setNewIndustryName] = useState("");
  const [newIndustryColor, setNewIndustryColor] = useState("#2563eb");
  const [industryModalError, setIndustryModalError] = useState("");

  const addIndustryMutation = useMutation({
    mutationFn: () =>
      createIndustry(newIndustryName.trim(), newIndustryColor, orgId),
    onSuccess: (result) => {
      if (result?.success) {

        queryClient.invalidateQueries({ queryKey: ["clientLookups", orgId] });
        queryClient.invalidateQueries({ queryKey: ["industries", orgId] });


        if (result.id) {
          setFormData((prev) => ({ ...prev, industry_id: String(result.id) }));
        }

        setNewIndustryName("");
        setNewIndustryColor("#2563eb");
        setIndustryModalError("");
        setIsIndustryModalOpen(false);
      } else {
        setIndustryModalError(
          result?.message || "Could not save industry, please try again."
        );
      }
    },
  });

  const handleAddIndustry = (e) => {
    e.preventDefault();
    if (!newIndustryName.trim()) {
      setIndustryModalError("Industry name is required.");
      return;
    }
    const isDuplicate = industries.some(
      (i) => i.name.toLowerCase() === newIndustryName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setIndustryModalError("This industry already exists.");
      return;
    }
    setIndustryModalError("");
    addIndustryMutation.mutate();
  };

  const closeIndustryModal = () => {
    setIsIndustryModalOpen(false);
    setNewIndustryName("");
    setNewIndustryColor("#2563eb");
    setIndustryModalError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "city_id" && value === "__add_city__") {
      setIsCityModalOpen(true);
      return; 
    }
    if (name === "industry_id" && value === "__add_industry__") {
      setIsIndustryModalOpen(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  const handleSubmit = (e, actionType = "redirect") => {
    e.preventDefault();

    const result = clientSchema.safeParse(formData);

    if (!result.success) {

      const fieldErrors = {};


      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    onSubmit(formData, { actionType, resetForm });
  };

  return (
    <>
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
                placeholder="e.g. John Doe / Tech Corp"
                className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
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
                className={`w-full border p-2.5 rounded-xl bg-white text-sm focus:outline-none ${
                  errors.type
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              >
                {CLIENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
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
                className={`w-full border p-2.5 rounded-xl bg-white text-sm focus:outline-none disabled:opacity-50 ${
                  errors.city_id
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              >
                <option value="">Select city...</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
                <option value="__add_city__" className="font-semibold text-blue-600">
                  + Add New City
                </option>
              </select>
              {errors.city_id && (
                <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>
              )}
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
                className={`w-full border p-2.5 rounded-xl bg-white text-sm focus:outline-none disabled:opacity-50 ${
                  errors.industry_id
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              >
                <option value="">Select industry...</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
                <option
                  value="__add_industry__"
                  className="font-semibold text-blue-600"
                >
                  + Add New Industry
                </option>
              </select>
              {errors.industry_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.industry_id}
                </p>
              )}
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
                className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
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
                className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white ${
                  errors.whatsapp
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.whatsapp}
                </p>
              )}
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
                className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white ${
                  errors.website
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website}</p>
              )}
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
              className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white resize-none ${
                errors.address
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
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
              className={`w-full border p-2.5 rounded-xl text-sm focus:outline-none bg-white resize-none ${
                errors.notes
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
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
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
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
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Save & Add Another
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, "redirect")}
                className="w-full sm:w-1/2 bg-blue-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                Save & View Profile
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Quick Add City Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-zinc-100 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> New City
              </span>
              <button
                type="button"
                onClick={closeCityModal}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                City Name *
              </label>
              <input
                type="text"
                value={newCityName}
                onChange={(e) => {
                  setNewCityName(e.target.value);
                  if (cityModalError) setCityModalError("");
                }}
                autoFocus
                placeholder="e.g. Beirut"
                className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Color
              </label>
              <div className="flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 overflow-x-auto">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCityColor(c)}
                    className={`w-6 h-6 rounded-lg shrink-0 transition-transform ${
                      newCityColor === c
                        ? "scale-110 ring-2 ring-offset-1 ring-blue-600"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label
                  className="flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded-lg cursor-pointer shrink-0 text-[11px] text-zinc-600"
                  title="Custom color"
                >
                  <Palette className="w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="color"
                    value={newCityColor}
                    onChange={(e) => setNewCityColor(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {cityModalError && (
              <p className="text-red-500 text-xs">{cityModalError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={closeCityModal}
                disabled={addCityMutation.isPending}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCity}
                disabled={addCityMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition disabled:opacity-50"
              >
                {addCityMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                {addCityMutation.isPending ? "Saving..." : "Add City"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Industry Modal */}
      {isIndustryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-zinc-100 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> New Industry
              </span>
              <button
                type="button"
                onClick={closeIndustryModal}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Industry Name *
              </label>
              <input
                type="text"
                value={newIndustryName}
                onChange={(e) => {
                  setNewIndustryName(e.target.value);
                  if (industryModalError) setIndustryModalError("");
                }}
                autoFocus
                placeholder="e.g. Retail"
                className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Color
              </label>
              <div className="flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 overflow-x-auto">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewIndustryColor(c)}
                    className={`w-6 h-6 rounded-lg shrink-0 transition-transform ${
                      newIndustryColor === c
                        ? "scale-110 ring-2 ring-offset-1 ring-blue-600"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label
                  className="flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded-lg cursor-pointer shrink-0 text-[11px] text-zinc-600"
                  title="Custom color"
                >
                  <Palette className="w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="color"
                    value={newIndustryColor}
                    onChange={(e) => setNewIndustryColor(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {industryModalError && (
              <p className="text-red-500 text-xs">{industryModalError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={closeIndustryModal}
                disabled={addIndustryMutation.isPending}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs rounded-xl transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddIndustry}
                disabled={addIndustryMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition disabled:opacity-50"
              >
                {addIndustryMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                {addIndustryMutation.isPending ? "Saving..." : "Add Industry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}