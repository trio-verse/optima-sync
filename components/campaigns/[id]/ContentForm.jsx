"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Tag,
  Layers,
  DollarSign,
  Calendar,
  FileText,
  Type,
  AlertTriangle,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { createContent, updateContent } from "@/actions/campaignDetails";
import { getChannels } from "@/actions/services/channelService";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "published", label: "Published" },
];

const CONTENT_TYPES = [
  { value: "video_script", label: "Video Script" },
  { value: "social_post", label: "Social Media Post" },
  { value: "article", label: "Article / Blog" },
  { value: "email", label: "Email Newsletter" },
  { value: "ad_copy", label: "Ad Copy" },
];

export default function ContentForm({ campaignId, orgId, editingContent = null }) {
  const router = useRouter();
  const [channels, setChannels] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const textareaRef = useRef(null);
  const isEditing = !!editingContent;

  const [formData, setFormData] = useState({
    title: editingContent?.title || "",
    type: editingContent?.type || "",
    channelId: String(editingContent?.channel_id || editingContent?.channelId || ""),
    cost: editingContent?.cost || "",
    status: editingContent?.status || "draft",
    publishedAt: editingContent?.published_at
      ? new Date(editingContent.published_at).toISOString().slice(0, 16)
      : "",
    description: editingContent?.description || "",
    script: editingContent?.script || "",
  });

  useEffect(() => {
    async function fetchChannels() {
      if (!orgId) return;
      setLoadingLists(true);
      try {
        const res = await getChannels(orgId);
        if (res?.success) setChannels(res.data || []);
      } catch (err) {
        console.error("Error loading channels:", err);
      } finally {
        setLoadingLists(false);
      }
    }

    fetchChannels();
  }, [orgId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (globalError) setGlobalError("");
  };

  const applyFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.script.substring(start, end) || "text";

    const newText =
      formData.script.substring(0, start) +
      `${prefix}${selectedText}${suffix}` +
      formData.script.substring(end);

    setFormData((prev) => ({ ...prev, script: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.channelId) newErrors.channelId = "Channel is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("type", formData.type);
    payload.append("channel_id", formData.channelId);
    payload.append("cost", formData.cost);
    payload.append("status", formData.status);
    if (formData.publishedAt) payload.append("published_at", formData.publishedAt);
    payload.append("description", formData.description);
    payload.append("script", formData.script);

    try {
      const result = isEditing
        ? await updateContent(editingContent.id, payload, campaignId)
        : await createContent(campaignId, payload);

      if (result?.success) {
        router.push(`/${orgId}/dashboard/marketing/campaigns/${campaignId}`);
        router.refresh();
      } else {
        setGlobalError(result?.error || result?.message || "An error occurred while saving");
      }
    } catch (err) {
      setGlobalError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200" dir="ltr">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Content" : "Create New Content"}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditing ? "Update existing content details" : "Add new piece of content to this campaign"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              Content Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Promo Video Script"
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.title ? "border-red-300 bg-red-50/30" : "border-slate-200"
              }`}
            />
            {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Content Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`border rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${
                errors.type ? "border-red-300 bg-red-50/30" : "border-slate-200"
              }`}
            >
              <option value="">Select type...</option>
              {CONTENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.type && <span className="text-red-500 text-xs">{errors.type}</span>}
          </div>
        </div>

        {/* Channel & Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                errors.channelId ? "border-red-300 bg-red-50/30" : "border-slate-200"
              }`}
            >
              <option value="">Select channel...</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.channelId && <span className="text-red-500 text-xs">{errors.channelId}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Estimated Cost ($)
            </label>
            <input
              type="number"
              name="cost"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              placeholder="1500"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Status & Published At */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Published At
            </label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this content item..."
            className="border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Script Toolbar */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Script (Markdown Format)</span>
          </label>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-100/70 flex-wrap">
              <button
                type="button"
                onClick={() => applyFormatting("**", "**")}
                className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("*", "*")}
                className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("### ")}
                className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all"
                title="Heading"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("- ")}
                className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all"
                title="List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("```\n", "\n```")}
                className="p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 rounded-md transition-all"
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              name="script"
              rows={6}
              value={formData.script}
              onChange={handleChange}
              placeholder="Write advertisement copy or script in markdown..."
              className="w-full p-3 text-xs font-mono bg-transparent outline-none text-slate-800"
            />
          </div>
        </div>

        {globalError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {globalError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{loading ? "Saving..." : isEditing ? "Update Content" : "Save Content"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}