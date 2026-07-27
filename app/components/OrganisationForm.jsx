 "use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Pencil, Camera, ImagePlus } from "lucide-react";

export default function OrganisationForm({
    initialValues = {},
    onSubmit,
    onImageUpload,
    isEditing = false,
    loading = false
}) {
    const fileInputRef = useRef(null);

    const [formData, setformData] = useState({
        name: initialValues?.name||"",
        email: initialValues?.email||"",
        phone: initialValues?.phone_number||"",
        orgCountryCode: initialValues?.orgCountryCode||"+963",
        address: initialValues?.address||"",
        description: initialValues?.description||"",
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [canEdit, setCanEdit] = useState(false);

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
        const cleanCode=countryCode.replace("+","");
        return "+"+cleanCode +clean;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
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
        errors.email = "Please enter a valid email address (e.g., name@domain.com).";
    }


    const cleanPhone = formData.phone.replace(/[\s+]/g, "");
    const phoneRegex = /^[0-9]+$/;

    if (!formData.phone.trim()) {
        errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(cleanPhone)) {
        errors.phone = "Phone number must contain only numbers.";
    } else if (cleanPhone.length < 8 || cleanPhone.length > 13) {
        errors.phone = "Phone number length must be between 8 and 13 digits.";
    }


    if (!formData.address.trim()) {
        errors.address = "Address is required.";
    } else if (formData.address.trim().length < 3) {
        errors.address = "Please enter a valid address.";
    }

    if (!formData.description.trim()) {
        errors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
        errors.description = "Description should be at least 10 characters long.";
    }

    setFormErrors(errors);
    

    return Object.keys(errors).length === 0;
};

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const finalPayload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone_number: formatFullPhone(formData.phone, formData.orgCountryCode),
                address: formData.address.trim(),
                description: formData.description.trim(),
            };
            onSubmit(finalPayload);
        }
    };

    return (
        <div aria-description="Org-Container" className="min-h-lvh flex justify-center items-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-zinc-100 p-6">
            <div aria-description="Org-Card" className="w-full max-w-2xl bg-white/60 flex flex-col items-center justify-center rounded-2xl p-8 shadow-sm border border-white/40">

                <div aria-description="Org-header" className="w-full mb-6">
                    {isEditing && (
                        <div className="flex justify-end w-full mb-2">
                            <button
                                type="button"
                                onClick={() => setCanEdit(prev => !prev)}
                                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                {canEdit ? "Cancel" : "Edit"}
                            </button>
                        </div>
                    )}

                    <div className="text-center w-full">
                        <h1 className="text-zinc-900 font-extrabold text-3xl tracking-wide mb-2">
                            {isEditing ? "Edit Organisation" : "Create Organisation"}
                        </h1>
                        <p className="text-zinc-500 text-xs px-4 leading-relaxed font-medium">
                            Set up your organisation workspace to start managing your team, projects, and ERP operations.
                        </p>
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


                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full" noValidate>


                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Organisation Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isInputDisabled}
                            placeholder="Optima Solutions"
                            className={`disabled:bg-zinc-100/70 disabled:cursor-not-allowed disabled:text-zinc-500 bg-white border w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm ${formErrors.name ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'}`}
                        />
                        {formErrors.name && <span className="text-rose-500 text-[11px] font-medium">{formErrors.name}</span>}
                    </div>


                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Organisation Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isInputDisabled}
                            placeholder="info@optima-sync.com"
                            className={`disabled:bg-zinc-100/70 disabled:cursor-not-allowed disabled:text-zinc-500 bg-white border w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm ${formErrors.email ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'}`}
                        />
                        {formErrors.email && <span className="text-rose-500 text-[11px] font-medium">{formErrors.email}</span>}
                    </div>


                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Phone Number:</label>
                        <div className={`flex items-center rounded-xl w-full border text-zinc-900 px-4 py-2.5 outline-none transition-all shadow-sm text-sm ${
                            isInputDisabled
                                ? 'bg-zinc-100/70 border-zinc-200 cursor-not-allowed opacity-70'
                                : 'bg-white focus-within:border-blue-500 focus-within:ring-1'
                            } ${formErrors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'}`}
                        >
                            <select
                                className="text-black border-r border-zinc-200 outline-none w-24 bg-transparent disabled:text-zinc-500 disabled:cursor-not-allowed"
                                name="orgCountryCode"
                                disabled={isInputDisabled}
                                value={formData.orgCountryCode}
                                onChange={handleChange}
                            >
                                <option value="+963">🇸🇾 +963</option>
                                <option value="+971">🇦🇪 +971</option>
                                <option value="+966">🇸🇦 +966</option>
                                <option value="+961">🇱🇧 +961</option>
                                <option value="+962">🇯🇴 +962</option>
                            </select>

                            <input
                                type="tel"
                                name="phone"
                                disabled={isInputDisabled}
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={getPhonePlaceholder()}
                                className="outline-none px-2 w-full bg-transparent disabled:text-zinc-500 disabled:cursor-not-allowed"
                            />
                        </div>
                        {formErrors.phone && <span className="text-rose-500 text-[11px] font-medium">{formErrors.phone}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Address:</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="City , Country"
                            onChange={handleChange}
                            disabled={isInputDisabled}
                            value={formData.address}
                            className={`disabled:bg-zinc-100/70 disabled:cursor-not-allowed disabled:text-zinc-500 bg-white border w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm ${formErrors.address ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'}`}
                        />
                        {formErrors.address && <span className="text-rose-500 text-[11px] font-medium">{formErrors.address}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Description:</label>
                        <textarea
                            rows="3"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isInputDisabled}
                            placeholder="Tell us more about your business fields, branches, or operations..."
                            className={`disabled:bg-zinc-100/70 disabled:cursor-not-allowed disabled:text-zinc-500 bg-white border w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm resize-none ${formErrors.description ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'}`}
                        />
                        {formErrors.description && <span className="text-rose-500 text-[11px] font-medium">{formErrors.description}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || isInputDisabled}
                        className="bg-blue-500 hover:bg-blue-700 font-bold w-full py-3 rounded-xl text-sm transition-all duration-300 text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2 mt-2"
                    >
                        {loading ? "Saving changes..." : isEditing ? "Save Changes" : "Create & Get Started"}
                    </button>
                </form>
            </div>
        </div>
    );
}