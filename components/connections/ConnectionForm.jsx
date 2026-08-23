"use client";

import { useState, useEffect } from "react";
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
import { getProducts } from "@/actions/services/productsService";
import { getChannels } from "@/actions/services/channelService";
import { getMembers } from "@/actions/services/membersAction";
import { getCampaigns } from "@/actions/campaigns";
import { getConnections } from "@/actions/connectionActions";
/* ── STAGES (Lowercase) ── */
const STAGES = {
  lead: { label: "Lead", color: "bg-amber-100 text-amber-700" },
  conected: { label: "Contacted", color: "bg-blue-100 text-blue-700" },
  missing_info: {
    label: "Missing Info",
    color: "bg-purple-100 text-purple-700",
  },
  intrested: { label: "Interested", color: "bg-emerald-100 text-emerald-700" },
  not_intrested: {
    label: "Not Interested",
    color: "bg-gray-100 text-gray-700",
  },
  win: { label: "Won", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed", color: "bg-red-100 text-red-700" },
};

const INITIATED_BY_OPTIONS = [
  { value: "CLIENT", label: "Client" },
  { value: "SALES_REP", label: "Sales Rep" },
];

export default function ConnectionModal({
  clientId,
  orgId,
  isOpen,
  onClose,
  onSuccess,
  editingConnection = null,
}) {
  const [products, setProducts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [dealValue, setDealValue] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const [formData, setFormData] = useState({
    productId: "",
    stage: "",
    channelId: "",
    assigneeId: "",
    campaignId: "",
    dealValue: "",
    initiatedBy: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const isEditing = !!editingConnection;

  /* ── Fetch Products & Channels ── */
  useEffect(() => {
    if (!isOpen) return;

    if (!orgId) {
      console.error(" orgId is missing in ConnectionModal");
      return;
    }

    async function fetchLists() {
      setLoadingLists(true);
      try {
        const [prodRes, chanRes, memRes, campRes, dealRes] = await Promise.all([
          getProducts(orgId),
          getChannels(orgId),
          getMembers(orgId),
          getCampaigns(orgId),
          getConnections(clientId, orgId),
        ]);

        if (prodRes?.success) {
          setProducts(prodRes.data || []);
        } else {
          console.error(" getProducts failed:", prodRes?.message);
        }

        if (chanRes?.success) {
          setChannels(chanRes.data || []);
        } else {
          console.error(" getChannels failed:", chanRes?.message);
        }
        if (memRes?.success) {
          setMembers(memRes.data || []);
          // console.log(members)
        } else {
          console.error(" getMembers failed:", memRes?.message);
        }
        if (campRes?.success) {
          setCampaigns(campRes.data || []);
        } else {
          console.error(" getCampaigns failed:", campRes?.message);
        }
        if (dealRes?.success) {
          setDealValue(dealRes.data.deal_value || []);
        } else {
          console.error(" getDealValue failed:", dealRes?.message);
        }
      } catch (err) {
        console.error(" Exception loading lists:", err);
      } finally {
        setLoadingLists(false);
      }
    }

    fetchLists();

    if (editingConnection) {
      setFormData({
        productId: String(
          editingConnection.product_id || editingConnection.productId || "",
        ),
        stage: editingConnection.stage || "",
        channelId: String(
          editingConnection.channel_id || editingConnection.channelId || "",
        ),
        assigneeId:
          editingConnection.assignee_id || editingConnection.assigneeId || "",
        campaignId: String(
          editingConnection.campaign_id || editingConnection.campaignId || "",
        ),
        dealValue:
          editingConnection.deal_value || editingConnection.dealValue || "",
        initiatedBy:
          editingConnection.initiated_by || editingConnection.initiatedBy || "",
      });
    } else {
      setFormData({
        productId: "",
        stage: "",
        channelId: "",
        assigneeId: "",
        campaignId: "",
        dealValue: "",
        initiatedBy: "",
      });
    }

    setErrors({});
    setGlobalError("");
  }, [isOpen, editingConnection, orgId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // إذا تم تغيير المنتج، جلب قيمته وتحديث dealValue
      if (name === "productId") {
        const selectedProd = products.find(
          (p) => String(p.id) === String(value),
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

  /* ── Local Validation ── */
  const validate = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.stage) newErrors.stage = "Stage is required";
    if (!formData.channelId) newErrors.channelId = "Channel is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");

    try {
      const result = isEditing
        ? await updateConnection(
            editingConnection.id,
            formData,
            orgId,
            clientId,
          )
        : await createConnection(clientId, formData, orgId);

      if (result?.success) {
        onSuccess?.(result.data);
        onClose();
      } else {
        if (result?.errors) {
          const map = {
            product_id: "productId",
            stage: "stage",
            channel_id: "channelId",
            campaign_id: "campaignId",
            assignee_id: "assigneeId",
            initiated_by: "initiatedBy",
          };
          const be = {};
          Object.entries(result.errors).forEach(([k, v]) => {
            be[map[k] || k] = Array.isArray(v) ? v[0] : v;
          });
          setErrors(be);
        } else {
          setGlobalError(result?.message || "An error occurred while saving");
        }
      }
    } catch (err) {
      setGlobalError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${errors.productId ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
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

          {/* Stage */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              Stage <span className="text-red-500">*</span>
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${errors.stage ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
            >
              <option value="">Select stage...</option>
              {Object.entries(STAGES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {errors.stage && (
              <span className="text-red-500 text-xs font-medium">
                {errors.stage}
              </span>
            )}
          </div>

          {/* Deal Value (يظهر فقط عندما تكون الحالة won أو win) */}
          {(formData.stage === "won" || formData.stage === "win") && (
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
                onChange={handleChange}
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
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${errors.channelId ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
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
                  {m.user.name || m.user.full_name || m.user.email}
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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
              <span>
                {loading
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
