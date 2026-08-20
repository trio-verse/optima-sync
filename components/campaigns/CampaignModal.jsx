"use client";

import { useState, useEffect } from "react";
import { createCampaign, updateCampaign } from "@/actions/campaigns";

const AVAILABLE_STATUS = ["active", "draft", "paused", "completed", "cancelled"];

export default function CampaignModal({ isOpen, onClose, orgId, campaignToEdit = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("draft");

  const isEditing = Boolean(campaignToEdit);

  // تحديث حالة Status والـ Error عند فتح المودال أو تغيير الحملة المراد تعديلها
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (campaignToEdit) {
        setSelectedStatus(campaignToEdit.status || "draft");
      } else {
        setSelectedStatus("draft");
      }
    }
  }, [isOpen, campaignToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("status", selectedStatus);

    let result;
    if (isEditing) {
      // استدعاء الأكشن الخاص بالتعديل في حال وجود campaignToEdit
      result = await updateCampaign(campaignToEdit.id, formData, orgId);
    } else {
      // استدعاء الأكشن الخاص بالإنشاء
      result = await createCampaign(formData, orgId);
    }

    setLoading(false);

    if (result?.success) {
      onClose();
    } else {
      setError(result?.error || result?.message || "An unexpected error occurred");
    }
  };

  // تنسيق التاريخ لصيغة YYYY-MM-DD لتناسب مدخلات input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
            <input
              type="text"
              name="name"
              defaultValue={campaignToEdit?.name || ""}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="e.g. Summer Growth Campaign"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              defaultValue={campaignToEdit?.description || ""}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Describe Your Campaign...."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Content Count</label>
            <input
              type="number"
              name="estimated_content_count"
             
              defaultValue={campaignToEdit?.estimated_content_count || ""}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Budget ($)</label>
            <input
              type="number"
              name="expected_budget"
              defaultValue={campaignToEdit?.expected_budget || campaignToEdit?.budget || ""}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STATUS.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setSelectedStatus(status)}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                defaultValue={formatDateForInput(campaignToEdit?.start_date)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                defaultValue={formatDateForInput(campaignToEdit?.end_date)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target</label>
            <input
              type="text"
              name="target"
              defaultValue={campaignToEdit?.target || ""}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Enter Your Expected Target"
            />
          </div>

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
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
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