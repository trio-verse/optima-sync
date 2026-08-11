"use client";

import { useRouter } from "next/navigation";
import LogoUploader from "@/components/LogoUploader";
import { uploadInitialLogo } from "@/actions/createNewOrganisation";

export default function UploadLogoPage() {
  const router = useRouter();

  const handleUpload = async (file) => {
    const res = await uploadInitialLogo(file);
    if (res?.success) {
      router.push("/dashboard");
    }
    return res;
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-zinc-200">
        <h1 className="text-xl font-bold text-zinc-900 mb-1 text-center">
          Upload Organisation Logo
        </h1>
        <p className="text-xs text-zinc-500 mb-6 text-center">
          Add a photo to personalize your workspace.
        </p>

        <LogoUploader
          onUpload={handleUpload}
          onSkip={handleSkip}
          showSkip={true}
        />
      </div>
    </div>
  );
}
