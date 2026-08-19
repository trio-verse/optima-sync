"use client";

import { useState } from "react";
import { createContent } from "@/actions/campaignDetails";
import { getChannels } from "@/actions/services/channelService";


const CLIENT_TYPES = [
  { value: "image", label: "Image" },
  { value: "reel", label: "Reel" },
  { value: "article", label: "Article" },
];

export default function ContentModal({ isOpen, onClose, campaignId, orgId, allowedType = [] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channels, setChannels] = useState([]);

    const [formData, setFormData] = useState({
    type: "article",
    channelId: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const result = await createContent(campaignId, formData);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">Add New Content</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Content Title</label>
            <input
              type="text"
              name="title"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="e.g. Promo Video Script"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
            >
              {allowedType.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Cost ($)</label>
            <input
              type="number"
              name="cost"
              step="0.01"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows="2"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Script (Markdown)</label>
            <textarea
              name="script"
              rows="4"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none font-mono text-xs focus:border-blue-500"
              placeholder="Write advertisement copy or script in markdown..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}