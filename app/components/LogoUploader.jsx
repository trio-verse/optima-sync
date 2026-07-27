"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ImagePlus, ArrowRight, Check } from "lucide-react";

export default function LogoUploader({ 
    onUpload, 
    onSkip = null, 
    currentLogo = null,
    showSkip = false 
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentLogo);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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
        } else {
            setError(res?.message || "Failed to upload image. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className=" w-full flex flex-col items-center justify-center text-center">
            {error && (
                <div className="w-full p-3 bg-rose-100 text-rose-700 text-xs rounded-lg mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="w-full p-3 bg-emerald-100 text-emerald-700 text-xs rounded-lg mb-4 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" /> Logo updated successfully!
                </div>
            )}


            <label className="relative w-32 h-32 rounded-full border-2 border-dashed border-zinc-300 hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-zinc-50 mb-6 group">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                />

                {previewUrl ? (
                    <>
                        <Image 
                            src={previewUrl} 
                            alt="Logo Preview" 
                            fill 
                            className="object-cover" 
                            unoptimized 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs gap-1 transition-opacity">
                            <Camera className="w-4 h-4" />
                            <span>Change</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-zinc-400 group-hover:text-blue-500 transition-colors">
                        <ImagePlus className="w-8 h-8 mb-1" />
                        <span className="text-xs font-medium">Select Image</span>
                    </div>
                )}
            </label>


            <div className="flex flex-col gap-2.5 w-full">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading || !selectedFile}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Uploading..." : "Save Logo"}
                    {!showSkip && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
                    {showSkip && onSkip && (
                    <button
                        type="button"
                        onClick={onSkip}
                        disabled={loading}
                        className="text-xs text-zinc-500 hover:text-zinc-800 font-medium py-1.5 transition-colors cursor-pointer"
                    >
                        Skip for now
                    </button>
                )}
            </div>
        </div>
    );
}