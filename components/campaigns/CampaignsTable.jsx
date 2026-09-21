"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery ,useQueryClient} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { deleteCampaign,  getEffectiveCampaigns } from "@/actions/campaigns";
import CampaignModal from "./CampaignModal";

import { Pencil, Trash2 } from "lucide-react";


export default function CampaignsTable({ orgId }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("cpl");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const { ref, inView } = useInView({ threshold: 0.2 });

  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns-infinite"] });
  };
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading: loading,
} = useInfiniteQuery({
  queryKey: ["campaigns-infinite", orgId, statusFilter, sortBy],
  queryFn: ({ pageParam = 1 }) =>
    getEffectiveCampaigns(
      orgId,
      {
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort: sortBy,      
        page: pageParam,
        perPage: 15,         
      },
    ),
  getNextPageParam: (lastPage) => {
    if (Array.isArray(lastPage)) return undefined;
    const meta = lastPage?.meta || {};
    const currentPage = meta.current_page || 1;
    const lastPageNum = meta.last_page || 1;
    return currentPage < lastPageNum ? currentPage + 1 : undefined;
  },
  enabled: !!orgId,
});


  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


  const rawCampaigns =
    data?.pages?.flatMap((page) =>
      Array.isArray(page) ? page : page?.data || []
    ) || [];


  const campaigns = rawCampaigns.map((campaign) => {
    const displayName = campaign?.name || campaign?.title || "Campaign without name";
    const budget = Number(campaign?.expected_budget || campaign?.budget || 0);
    const spent = Number(campaign?.current_spent || campaign?.spent || 0);

    const connectionsCount = Array.isArray(campaign?.connections)
      ? campaign.connections.length
      : Number(campaign?.connections_count || campaign?.leads_count || 0);


    let cpl = 0;
    if (campaign?.cpl !== undefined && campaign?.cpl !== null) {
      cpl = Number(campaign.cpl) || 0;
    } else if (connectionsCount > 0) {
      cpl = spent / connectionsCount;
    }

    const roi =
      campaign?.roi !== undefined && campaign?.roi !== null
        ? Number(campaign.roi)
        : null;

    return {
      ...campaign,
      displayName,
      computedBudget: budget,
      computedSpent: spent,
      computedConnectionsCount: connectionsCount,
      computedCpl: isNaN(cpl) ? 0 : cpl,
      computedRoi: roi,
    };
  });

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (campaign, e) => {
    e.stopPropagation();
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this campaign?")) {
      const res = await deleteCampaign(id, orgId);
      if (res?.success) {
        handleSuccess(); // إعادة جلب البيانات فوراً
      }
    }
  };

  const handleRowClick = (campaignId) => {
    if (!campaignId) return;
    router.push(`/${orgId}/dashboard/marketing/campaigns/${campaignId}`);
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
          onClick={handleOpenCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
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
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-1.5 text-xs outline-none focus:border-blue-500"
          >
            <option value="cpl">Lowest CPL</option>
            <option value="roi">Highest ROI</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          Loading campaigns...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
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
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => {
                    const campaignId = campaign.id || campaign._id;
                    return (
                      <tr
                        key={campaignId}
                        onClick={() => handleRowClick(campaignId)}
                        className="hover:bg-gray-50/80 cursor-pointer transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {campaign.displayName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 capitalize">
                            {campaign.status || "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          ${campaign.computedSpent.toLocaleString()} / $
                          {campaign.computedBudget.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {campaign.computedConnectionsCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          ${campaign.computedCpl.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {campaign.computedRoi !== null &&
                          !isNaN(campaign.computedRoi) ? (
                            <span className="font-semibold text-green-600">
                              +{campaign.computedRoi}%
                            </span>
                          ) : (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button
                            onClick={(e) => handleOpenEdit(campaign, e)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="Edit Campaign"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(campaignId, e)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Infinite Scroll Loader Trigger */}
          {hasNextPage && (
            <div ref={ref} className="p-4 text-center border-t border-gray-100">
              {isFetchingNextPage ? (
                <span className="text-sm text-gray-500">
                  Loading more campaigns...
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  Scroll down to load more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(null);
        }}
        onSuccess={handleSuccess}
        orgId={orgId}
        campaignToEdit={editingCampaign}
      />
    </div>
  );
}