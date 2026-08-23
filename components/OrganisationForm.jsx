"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Building2, Mail, Phone, MapPin, FileText, Loader2, X } from "lucide-react";

export default function OrganisationForm({
  initialValues = {},
  onSubmit,
  onImageUpload,
  isEditing = false,
  loading = false,
  variant = "standalone",
}) {
  const fileInputRef = useRef(null);

  const [formData, setformData] = useState({
    name: "",
    email: "",
    phone_number: "",
    orgCountryCode: "+963",
    address: "",
    description: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [canEdit, setCanEdit] = useState(false);

  const supportedCountryCodes = ["+971", "+966", "+961", "+963", "+962"];
  const countryFlags = {
    "+971": "🇦🇪",
    "+966": "🇸🇦",
    "+961": "🇱🇧",
    "+963": "🇸🇾",
    "+962": "🇯🇴",
  };

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      let extractedCode = "+963";
      let rawPhone = initialValues.phone_number;

      if (rawPhone) {
        for (const code of supportedCountryCodes) {
          if (rawPhone.startsWith(code)) {
            extractedCode = code;
            rawPhone = rawPhone.replace(code, "");
            break;
          }
        }
      }

      setformData({
        name: initialValues.name || "",
        email: initialValues.email || "",
        phone_number: rawPhone,
        orgCountryCode: extractedCode,
        address: initialValues.address || "",
        description: initialValues.description || "",
      });

      if (initialValues.logo || initialValues.image || initialValues.logo_url) {
        setPreviewUrl(initialValues.logo || initialValues.image || initialValues.logo_url);
      }
    }
  }, [initialValues]);

  const isInputDisabled = isEditing && !canEdit;

  const getPhonePlaceholder = () => {
    switch (formData.orgCountryCode) {
      case "+971": return "50 123 4567";
      case "+966": return "50 123 4567";
      case "+961": return "70 123 456";
      case "+963": return "99 123 4567";
      default: return "123 456 789";
    }
  };

  const formatFullPhone = (phone, countryCode) => {
    if (!phone) return "";
    let clean = phone.replace(/[\s\-\(\)]/g, "");
    if (clean.startsWith("0")) {
      clean = clean.slice(1);
    }
    const cleanCode = countryCode.replace("+", "");
    return "+" + cleanCode + clean;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = "Organization name is required.";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const phoneVal = formData.phone_number || formData.phone || "";
    const cleanPhone = phoneVal.replace(/[\s+]/g, "");
    const phoneRegex = /^[0-9]+$/;

    if (!phoneVal.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.phone = "Phone number must contain only numbers.";
    } else if (cleanPhone.length < 6 || cleanPhone.length > 13) {
      errors.phone = "Phone number length must be valid.";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedPhone = formatFullPhone(formData.phone_number, formData.orgCountryCode);
      const finalPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formattedPhone,
        phone_number: formattedPhone,
        address: formData.address.trim(),
        description: formData.description.trim(),
      };
      onSubmit(finalPayload);
    }
  };


  const inputClass = (hasError) =>
    `w-full text-slate-800 text-xs rounded-xl px-3 py-2.5 outline-none transition-all duration-200 border ${
      isInputDisabled
        ? "bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed"
        : "bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 hover:border-slate-300"
    } ${hasError ? "border-rose-300 bg-rose-50/20 text-rose-900" : ""}`;


  const labelClass =
    "text-slate-600 font-semibold text-xs flex items-center gap-1.5 mb-1";

  const content = (
    <div className="w-full">
      

      <div className="w-full mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-slate-900 font-bold text-xl tracking-tight">
              {isEditing ? "Organisation Profile" : "Create Organisation"}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              {isEditing? "Update":"Create"} your organization details and public information.
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={() => setCanEdit((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                canEdit
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              {canEdit ? (
                <>
                  <X className="w-3.5 h-3.5" /> Cancel
                </>
              ) : (
                <>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isInputDisabled}
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" noValidate>
        <div className="flex flex-col">
          <label className={labelClass}>
            <Building2 className="w-3.5 h-3.5 text-slate-400" /> Organisation Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isInputDisabled}
            placeholder="Optima Solutions"
            className={inputClass(formErrors.name)}
          />
          {formErrors.name && <span className="text-rose-500 text-[10px] mt-1 font-medium">{formErrors.name}</span>}
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isInputDisabled}
            placeholder="info@optima-sync.com"
            className={inputClass(formErrors.email)}
          />
          {formErrors.email && <span className="text-rose-500 text-[10px] mt-1 font-medium">{formErrors.email}</span>}
        </div>


        <div className="flex flex-col">
          <label className={labelClass}>
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
          </label>
          <div
            className={`flex items-center rounded-xl w-full border text-xs overflow-hidden transition-all ${
              isInputDisabled
                ? "bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-white border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 hover:border-slate-300"
            } ${formErrors.phone ? "border-rose-300 bg-rose-50/20" : ""}`}
          >
            <select
              className="bg-slate-50 border-r border-slate-200 outline-none h-full px-2 py-2.5 text-slate-700 disabled:cursor-not-allowed"
              name="orgCountryCode"
              disabled={isInputDisabled}
              value={formData.orgCountryCode}
              onChange={handleChange}
            >
              {supportedCountryCodes.map((code) => (
                <option key={code} value={code}>
                  {countryFlags[code]} {code}
                </option>
              ))}
            </select>

            <input
              type="tel"
              name="phone_number"
              disabled={isInputDisabled}
              value={formData.phone_number || ""}
              onChange={handleChange}
              placeholder={getPhonePlaceholder()}
              className="outline-none px-3 py-2.5 w-full bg-transparent text-slate-800 disabled:cursor-not-allowed"
            />
          </div>
          {formErrors.phone && <span className="text-rose-500 text-[10px] mt-1 font-medium">{formErrors.phone}</span>}
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location / Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="City, Country"
            onChange={handleChange}
            disabled={isInputDisabled}
            value={formData.address}
            className={inputClass(formErrors.address)}
          />
          {formErrors.address && <span className="text-rose-500 text-[10px] mt-1 font-medium">{formErrors.address}</span>}
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label className={labelClass}>
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Description
          </label>
          <textarea
            rows="3"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isInputDisabled}
            placeholder="Tell us more about your business fields..."
            className={`${inputClass(formErrors.description)} resize-none`}
          />
          {formErrors.description && (
            <span className="text-rose-500 text-[10px] mt-1 font-medium">{formErrors.description}</span>
          )}
        </div>


        <button
          type="submit"
          disabled={loading || isInputDisabled}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed sm:col-span-2 mt-2 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Organisation"}
        </button>
      </form>
    </div>
  );

  if (variant === "embedded") {
    return content;
  }


  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
        {content}
      </div>
    </div>
  );
}