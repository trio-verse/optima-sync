"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Check,
  Loader2,
  Link2,
  User,
  ArrowRightLeft,
  Tag,
  Package,
  AlertTriangle,
  DollarSign,
  Megaphone,
} from "lucide-react";
import {
  createConnection,
  updateConnection,
} from "@/actions/connectionActions";
import { useConnectionSelects } from "@/hooks/useConnectionSelects"; // قم بتعديل مسار الهوك حسب مشروعك

export default function ConnectionModal({
  clientId,
  orgId,
  isOpen,
  onClose,
  onSuccess,
  editingConnection = null,
}) {
  const queryClient = useQueryClient();

  /* ── 1. جلب البيانات باستخدام الهوك المخصص ── */
  const {
    products,
    channels,
    members,
    campaigns,
    isLoading: loadingLists,
  } = useConnectionSelects(orgId, isOpen);

  const [formData, setFormData] = useState({
    productId: "",
    stage: "lead",
    channelId: "",
    assigneeId: "",
    campaignId: "",
    dealValue: "",
    initiatedBy: "",
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const isEditing = !!editingConnection;

  // لمعالجة أخطاء الباك إند وتعيينها للحقول
  const handleBackendErrors = (result) => {
    if (result?.errors) {
      const map = {
        product_id: "productId",
        channel_id: "channelId",
        campaign_id: "campaignId",
        assignee_id: "assigneeId",
        initiated_by: "initiatedBy",
        deal_value: "dealValue",
      };
      const be = {};
      Object.entries(result.errors).forEach(([k, v]) => {
        be[map[k] || k] = Array.isArray(v) ? v[0] : v;
      });
      setErrors(be);
    } else {
      setGlobalError(result?.message || "An error occurred while saving");
    }
  };

  /* ── 2. Mutation لعملية الحفظ/التعديل ── */
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      let result;
      if (isEditing) {
        result = await updateConnection(
          editingConnection.id,
          data,
          orgId,
          clientId
        );
      } else {
        result = await createConnection(clientId, data, orgId);
      }
      return result;
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        onSuccess?.(result.data);
        onClose();
      } else {
        handleBackendErrors(result);
      }
    },
    onError: (err) => {
      if (err?.errors) {
        handleBackendErrors(err);
      } else {
        setGlobalError(
          err?.message || "Unable to connect to the server. Please try again."
        );
      }
    },
  });

  /* ── تعبئة النموذج عند فتح المودال أو التعديل ── */
  useEffect(() => {
    if (!isOpen) return;

    if (editingConnection) {
      setFormData({
        productId: String(
          editingConnection.product_id || editingConnection.productId || ""
        ),
        stage: editingConnection.stage || "lead",
        channelId: String(
          editingConnection.channel_id || editingConnection.channelId || ""
        ),
        assigneeId:
          editingConnection.assignee_id || editingConnection.assigneeId || "",
        campaignId: String(
          editingConnection.campaign_id || editingConnection.campaignId || ""
        ),
        dealValue:
          editingConnection.deal_value || editingConnection.dealValue || "",
        initiatedBy:
          editingConnection.initiated_by || editingConnection.initiatedBy || "",
      });
    } else {
      setFormData({
        productId: "",
        stage: "lead",
        channelId: "",
        assigneeId: "",
        campaignId: "",
        dealValue: "",
        initiatedBy: "",
      });
    }

    setErrors({});
    setGlobalError("");
  }, [isOpen, editingConnection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "productId") {
        const selectedProd = products.find(
          (p) => String(p.id) === String(value)
        );
        updated.dealValue = selectedProd?.price || selectedProd?.value || "";
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
    if (globalError) setGlobalError("");
  };

  /* ── التحقق المحلي ── */
  const validate = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.channelId) newErrors.channelId = "Channel is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setGlobalError("");
    submitMutation.mutate(formData);
  };

  if (!isOpen) return null;

  const isWonStage =
    String(formData.stage).toLowerCase() === "win" ||
    String(formData.stage).toLowerCase() === "won";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150 border border-slate-100"
        dir="ltr"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {isEditing ? "Edit Connection" : "New Connection"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isEditing
                  ? "Update client connection details"
                  : "Register a new interaction with the client"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Product */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Product <span className="text-red-500">*</span>
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              disabled={loadingLists}
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${
                errors.productId
                  ? "border-red-300 bg-red-50/30"
                  : "border-slate-200"
              }`}
            >
              <option value="">Select product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <span className="text-red-500 text-xs font-medium">
                {errors.productId}
              </span>
            )}
          </div>

          {/* Deal Value */}
          {isWonStage && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-150">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Deal Value
              </label>
              <input
                type="number"
                name="dealValue"
                value={formData.dealValue}
                readOnly
                placeholder="Product price"
                className="border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed select-none font-semibold"
              />
            </div>
          )}

          {/* Channel */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Channel <span className="text-red-500">*</span>
            </label>
            <select
              name="channelId"
              value={formData.channelId}
              onChange={handleChange}
              disabled={loadingLists}
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${
                errors.channelId
                  ? "border-red-300 bg-red-50/30"
                  : "border-slate-200"
              }`}
            >
              <option value="">Select channel...</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.channelId && (
              <span className="text-red-500 text-xs font-medium">
                {errors.channelId}
              </span>
            )}
          </div>

          {/* Campaign */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5 text-slate-400" />
              Campaign
            </label>
            <select
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              disabled={loadingLists}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
            >
              <option value="">Select campaign...</option>
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name || camp.title || `Campaign #${camp.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Assignee
            </label>
            <select
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
              disabled={loadingLists}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
            >
              <option value="" className="bg-white text-slate-800">
                Select assignee...
              </option>
              {members.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                  className="bg-white text-slate-800"
                >
                  {m.user?.name || m.user?.full_name || m.user?.email}
                </option>
              ))}
            </select>
          </div>

          {/* Initiated By */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              Initiated By
            </label>
            <input
              type="text"
              name="initiatedBy"
              value={formData.initiatedBy || ""}
              onChange={handleChange}
              placeholder="Enter who initiated this..."
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
            />
          </div>

          {/* Global Error */}
          {globalError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {globalError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {submitMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
              <span>
                {submitMutation.isPending
                  ? "Saving..."
                  : isEditing
                    ? "Update"
                    : "Save Connection"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}