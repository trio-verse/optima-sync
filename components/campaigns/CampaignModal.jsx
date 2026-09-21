"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaign, updateCampaign } from "@/actions/campaigns";
import { campaignSchema } from "@/lib/validations/campaignSchema"; // تأكدي من مسار الـ Schema الصحيح

const AVAILABLE_STATUS = ["active", "draft", "paused", "completed", "cancelled"];

export default function CampaignModal({
  isOpen,
  onClose,
  onSuccess,
  orgId,
  campaignToEdit = null,
}) {
  const isEditing = Boolean(campaignToEdit);

  // تنسيق التاريخ لصيغة YYYY-MM-DD لتناسب مدخلات input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // إعداد React Hook Form مع Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      estimated_content_count: "",
      expected_budget: "",
      status: "draft",
      start_date: "",
      end_date: "",
      target: "",
    },
  });

  const selectedStatus = watch("status");

  // إعادة ضبط قيم الفورم عند تغيير البيانات أو فتح/إغلاق المودال
  useEffect(() => {
    if (isOpen) {
      if (campaignToEdit) {
        reset({
          name: campaignToEdit.name || "",
          description: campaignToEdit.description || "",
          estimated_content_count: campaignToEdit.estimated_content_count || "",
          expected_budget: campaignToEdit.expected_budget || campaignToEdit.budget || "",
          status: campaignToEdit.status || "draft",
          start_date: formatDateForInput(campaignToEdit.start_date),
          end_date: formatDateForInput(campaignToEdit.end_date),
          target: campaignToEdit.target || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          estimated_content_count: "",
          expected_budget: "",
          status: "draft",
          start_date: "",
          end_date: "",
          target: "",
        });
      }
    }
  }, [isOpen, campaignToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    // إرسال FormData إلى Server Action
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    let result;
    if (isEditing) {
      result = await updateCampaign(campaignToEdit.id, formData, orgId);
    } else {
      result = await createCampaign(formData, orgId);
    }

    if (result?.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      // إظهار خطأ عام قادم من السيرفر
      setError("root", {
        type: "manual",
        message: result?.error || result?.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* عرض خطأ السيرفر العام */}
        {errors.root && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="e.g. Summer Growth Campaign"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              {...register("description")}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Describe Your Campaign...."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Estimated Content Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Content Count</label>
            <input
              type="number"
              {...register("estimated_content_count")}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="80"
            />
            {errors.estimated_content_count && (
              <p className="mt-1 text-xs text-red-500">{errors.estimated_content_count.message}</p>
            )}
          </div>

          {/* Expected Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Budget ($)</label>
            <input
              type="number"
              {...register("expected_budget")}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="5000"
            />
            {errors.expected_budget && (
              <p className="mt-1 text-xs text-red-500">{errors.expected_budget.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STATUS.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setValue("status", status, { shouldValidate: true })}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                {...register("start_date")}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              />
              {errors.start_date && (
                <p className="mt-1 text-xs text-red-500">{errors.start_date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                {...register("end_date")}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              />
              {errors.end_date && (
                <p className="mt-1 text-xs text-red-500">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Target</label>
            <input
              type="text"
              {...register("target")}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Enter Your Expected Target"
            />
            {errors.target && <p className="mt-1 text-xs text-red-500">{errors.target.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Campaign"
                : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}