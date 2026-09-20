"use client";

import { useState ,useEffect} from "react";
import {
    User,
    Mail,
    Phone,
    Briefcase,
    UploadCloud,
    X,
    FileCheck,
    Loader2,
    CheckCircle2,
    Copy,
    Check,
    Send,
    Sparkles
} from "lucide-react";

import { getPublicIntakeUrl, submitPublicProject } from "@/actions/publicProjectActions";

export default function ProjectIntakeForm({ token }) {
    const [formData, setFormData] = useState({
        client_name: "",
        company_name: "",
        email: "",
        phone: "",
        project_title: "",
        description: "",
    });

    const [attachments, setAttachments] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [isLoadingUrl, setIsLoadingUrl] = useState(true);
    const [urlError, setUrlError] = useState("");
    const [targetEndpoint, setTargetEndpoint] = useState(null);

    useEffect(() => {
    let isCancelled = false;

    async function fetchEndpoint() {
        if (!token) {
            setUrlError("Invalid or missing token.");
            setIsLoadingUrl(false);
            return;
        }

        setIsLoadingUrl(true);
        const res = await getPublicIntakeUrl(token);

        if (!isCancelled) {
            if (res.success && res.endpoint) {
                setTargetEndpoint(res.endpoint);
            } else {
                setUrlError(res.message || "This intake link is invalid or has expired.");
            }
            setIsLoadingUrl(false);
        }
    }
    fetchEndpoint();

    return () => {
        isCancelled = true;
    };
}, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const allowedTypes = [
            "application/pdf",
            "application/zip",
            "application/x-zip-compressed",
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const validFiles = files.filter((file) => {
            return (
                allowedTypes.includes(file.type) ||
                file.name.endsWith(".zip") ||
                file.name.endsWith(".rar")
            );
        });

        setAttachments((prev) => [...prev, ...validFiles]);
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.client_name.trim()) newErrors.client_name = "Required";
        if (!formData.email.trim()) newErrors.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Invalid email";
        if (!formData.phone.trim()) newErrors.phone = "Required";
        if (!formData.project_title.trim()) newErrors.project_title = "Required";
        if (!formData.description.trim()) newErrors.description = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (!targetEndpoint) {
            setErrors({ server: "Form configuration error. Please refresh the page." });
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            attachments.forEach((file) => {
                data.append("attachments[]", file);
            });

            // إرسال مباشر إلى الـ Endpoint الجاهز
            const result = await submitPublicProject(targetEndpoint, data);

            if (result.success) {
                setSubmitSuccess({
                    reference_number: result.data?.reference_number || "PRJ-SUCCESS",
                    message: result.message || "Your project request has been submitted successfully!",
                });
            } else {
                setErrors({ server: result.message || "Failed to submit project request." });
            }
        } catch (err) {
            setErrors({ server: "Something went wrong. Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingUrl) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500 text-sm">Loading request form...</p>
            </div>
        );
    }

    if (urlError) {
        return (
            <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
                <h3 className="text-lg font-bold text-red-700 mb-2">Invalid Link</h3>
                <p className="text-xs text-red-600">{urlError}</p>
            </div>
        );
    }

    // الشاشة التي تظهر بعد نجاح إرسال الفورم
    if (submitSuccess) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50/50">
                <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Request Received!
                    </h2>
                    <p className="text-gray-500 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                        {submitSuccess.message}
                    </p>

                    <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 max-w-xs mx-auto mb-6 flex items-center justify-between shadow-inner">
                        <div className="text-left">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                Reference Number
                            </span>
                            <span className="text-base font-extrabold text-gray-800 tracking-wide">
                                #{submitSuccess.reference_number}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // نموذج إدخال البيانات الرئيسي
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gray-50/50">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">
                
                <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full mb-2">
                        <Sparkles className="w-3 h-3" /> Optima Sync
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Let’s Build Something Amazing
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                        Share your vision with us and Let’s turn your ideas into reality.
                    </p>
                </div>

                <form onSubmit={handleSubmit} dir="ltr" className="space-y-5">
                    {errors.server && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center font-medium">
                            {errors.server}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                                <User className="w-3.5 h-3.5 text-blue-600" />
                                Client Details
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="client_name"
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full border px-3 py-2 rounded-xl text-xs focus:outline-none bg-white transition shadow-2xs ${
                                        errors.client_name
                                            ? "border-red-400 focus:border-red-500"
                                            : "border-gray-200 focus:border-blue-500"
                                    }`}
                                />
                                {errors.client_name && (
                                    <p className="text-red-500 text-[10px] mt-0.5">
                                        {errors.client_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    placeholder="Acme Corp"
                                    className="w-full border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white transition shadow-2xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className={`w-full border px-3 py-2 rounded-xl text-xs focus:outline-none bg-white transition shadow-2xs ${
                                            errors.email
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-200 focus:border-blue-500"
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-[10px] mt-0.5">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567"
                                        className={`w-full border px-3 py-2 rounded-xl text-xs focus:outline-none bg-white transition shadow-2xs ${
                                            errors.phone
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-200 focus:border-blue-500"
                                        }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-[10px] mt-0.5">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                                Project Details
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    name="project_title"
                                    value={formData.project_title}
                                    onChange={handleChange}
                                    placeholder="Web Application"
                                    className={`w-full border px-3 py-2 rounded-xl text-xs focus:outline-none bg-white transition shadow-2xs ${
                                        errors.project_title
                                            ? "border-red-400 focus:border-red-500"
                                            : "border-gray-200 focus:border-blue-500"
                                    }`}
                                />
                                {errors.project_title && (
                                    <p className="text-red-500 text-[10px] mt-0.5">
                                        {errors.project_title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Overview & Scope *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Briefly describe project requirements and timeline..."
                                    className={`w-full border px-3 py-2 rounded-xl text-xs focus:outline-none bg-white resize-none transition shadow-2xs ${
                                        errors.description
                                            ? "border-red-400 focus:border-red-500"
                                            : "border-gray-200 focus:border-blue-500"
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-[10px] mt-0.5">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="relative border border-dashed border-gray-200 hover:border-blue-400 transition rounded-2xl px-4 py-2.5 bg-gray-50/50 flex items-center gap-3 flex-1 cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept=".pdf,.png,.jpg,.jpeg,.webp,.zip,.rar"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="p-2 bg-white rounded-xl border border-gray-100 text-blue-600 flex-shrink-0 shadow-2xs">
                                    <UploadCloud className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-gray-700">
                                        Attach files <span className="text-gray-400 font-normal">(PDF, ZIP, Images)</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Optional - Up to 25MB each
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-44 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-2xl text-xs transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Submit Request</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {attachments.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[11px]"
                                    >
                                        <FileCheck className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                        <span className="font-medium text-gray-700 truncate max-w-[140px]">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(idx)}
                                            className="hover:bg-gray-200/80 rounded p-0.5 text-gray-400 hover:text-gray-600 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}