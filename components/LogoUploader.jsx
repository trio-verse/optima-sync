"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, ImagePlus, Check, Loader2, Upload } from "lucide-react";

export default function LogoUploader({
  onUpload,
  onSkip = null,
  currentLogo = null,
  showSkip = false,
  size = 96,
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

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await onUpload(selectedFile);

    if (res?.success) {
      setSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res?.message || "Failed to upload image.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {error && (
        <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-xl mb-2 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] rounded-xl mb-2 flex items-center justify-center gap-1 font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-600" /> Logo updated!
        </div>
      )}

      <div className="relative group" style={{ width: size, height: size }}>
        {/* الدائرة الأساسية */}
        <label
          className={`relative w-full h-full rounded-full border-2 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-slate-50 shadow-inner ${
            loading
              ? "border-blue-500 opacity-80"
              : "border-white hover:border-blue-300"
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
            <div className="relative w-full h-full">
              <Image
                src={previewUrl}
                alt="Logo"
                fill
                priority
                unoptimized
                className="object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-medium transition-opacity rounded-full gap-0.5">
                <Camera className="w-4 h-4" />
                <span>Change</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600 transition-colors">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <>
                  <ImagePlus className="w-6 h-6 mb-0.5 text-slate-400 group-hover:text-blue-600" />
                  <span className="text-[10px] font-medium text-slate-500">
                    Upload
                  </span>
                </>
              )}
            </div>
          )}
        </label>

        {/* أيقونة الكاميرا السفلية لتغيير الصورة */}
        {!selectedFile && !loading && (
          <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-105">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Camera className="w-3.5 h-3.5" />
          </label>
        )}

        {/* زر الحفظ يظهر كأيقونة تأكيد عائمة فوق الدائرة دون خربطة الشكل */}
        {selectedFile && (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-full shadow-lg border-2 border-white flex items-center gap-1 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            <span>{loading ? "Saving..." : "Save"}</span>
          </button>
        )}
      </div>

      {showSkip && onSkip && (
        <button
          type="button"
          onClick={onSkip}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium mt-3 transition-colors cursor-pointer"
        >
          Skip for now
        </button>
      )}
    </div>
  );
}