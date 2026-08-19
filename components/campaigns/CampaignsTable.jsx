"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCampaign } from "@/actions/campaigns";
import CampaignModal from "./CampaignModal";
import { Eye, Trash2 } from "lucide-react";

export default function CampaignsTable({ initialCampaigns, orgId }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("cpl");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCampaigns = initialCampaigns
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "cpl") return (a.cpl || 0) - (b.cpl || 0);
      if (sortBy === "roi") return (b.roi || 0) - (a.roi || 0);
      return 0;
    });

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      await deleteCampaign(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Marketing Campaigns
          </h1>
          <p className="text-sm text-gray-500">
            Track campaign budgets, CPL, and deal ROI.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Campaign
        </button>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="flex gap-2">
          {["all", "active", "draft", "paused", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                  statusFilter === status
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-1.5 text-xs outline-none"
          >
            <option value="cpl">Lowest CPL</option>
            <option value="roi">Highest ROI</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
            <tr>
              <th className="px-6 py-3">Campaign</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Spent / Budget</th>
              <th className="px-6 py-3">Connections</th>
              <th className="px-6 py-3">CPL</th>
              <th className="px-6 py-3">ROI</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="hover:underline"
                  >
                    {campaign.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 capitalize">
                    {campaign.status || "active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  ${campaign.current_spent || 0} / ${campaign.budget}
                </td>
                <td className="px-6 py-4">{campaign.connections_count || 0}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  ${campaign.cpl ? campaign.cpl.toFixed(2) : "0.00"}
                </td>
                <td className="px-6 py-4">
                  {campaign.roi !== undefined && campaign.roi !== null ? (
                    <span className="font-semibold text-green-600">
                      +{campaign.roi}%
                    </span>
                  ) : (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      N/A
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/${orgId}/dashboard/marketing/campaigns/${campaign.id}`}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete Campaign"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCampaigns.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orgId={orgId}
      />
    </div>
  );
}
