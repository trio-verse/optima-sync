"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, ImagePlus, Check, Loader2 } from "lucide-react";

export default function LogoUploader({
    onUpload,
    onSkip = null,
    currentLogo = null,
    showSkip = false,
    size = 84,
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentLogo);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (currentLogo) {
            setPreviewUrl(currentLogo);
        }
    }, [currentLogo]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setSuccess(false);
            setError("");
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        const res = await onUpload(selectedFile);

        if (res?.success) {
            setSuccess(true);
            setSelectedFile(null);
        } else {
            setError(res?.message || "Failed to upload image.");
        }
        setLoading(false);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center text-center">
            {error && (
                <div className="w-full max-w-xs p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-xl mb-2 font-medium">
                    {error}
                </div>
            )}

            {success && (
                <div className="w-full max-w-xs p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] rounded-xl mb-2 flex items-center justify-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Logo updated!
                </div>
            )}

            {/* [تعديل رقم 13 - الشعار]: حذف التأثيرات الزائدة المضيئة (Glow effects) لحل العجقة */}
            <div className="relative" style={{ width: size, height: size }}>
                <label
                    className={`absolute rounded-full border flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-slate-50 group ${loading
                            ? "inset-0 border-blue-500 opacity-80"
                            : "inset-0 border-slate-200 hover:border-blue-400 hover:bg-slate-100/50"
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                    />

                    {previewUrl ? (
                        <>
                            <Image
                                src={previewUrl}
                                alt="Logo Preview"
                                fill
                                priority
                                unoptimized
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-medium gap-1 transition-opacity">
                                <Camera className="w-3.5 h-3.5" />
                                <span>Change</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            ) : (
                                <>
                                    <ImagePlus className="w-5 h-5 mb-0.5" />
                                    <span className="text-[9px] font-semibold">Upload</span>
                                </>
                            )}
                        </div>
                    )}
                </label>

                {!loading && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white pointer-events-none">
                        <Camera className="w-3 h-3" />
                    </div>
                )}
            </div>

            {/* [تعديل رقم 14 - زر حفظ الصورة]: إظهار زر تنفيذي صغير وأنيق عند تحديد صورة جديدة فقط */}
            {selectedFile && (
                <div className="mt-2.5">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Uploading..." : "Save Logo"}
                    </button>
                </div>
            )}

            {showSkip && onSkip && (
                <button
                    type="button"
                    onClick={onSkip}
                    disabled={loading}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium mt-1 transition-colors cursor-pointer"
                >
                    Skip for now
                </button>
            )}
        </div>
    );
}