// app/[OrgId]/dashboard/marketing/campaigns/[id]/page.jsx
import { getCampaignAnalytics, getCampaignContents, updateContent } from "@/actions/campaignDetails";
import ContentKanban from "@/components/campaigns/[id]/ContentKanban";
import CampaignModal from "@/components/campaigns/CampaignModal";

export default async function CampaignDetailsPage({ params }) {
  const resolvedParams = await params;
  const campaignId = resolvedParams?.id;
  const orgId = resolvedParams?.OrgId;

  const [analyticsRes, contentsRes] = await Promise.all([
    getCampaignAnalytics(campaignId, orgId),
    getCampaignContents(campaignId, orgId),
  ]);

  const rawData = analyticsRes.data || {};
  const campaign = rawData.campaign || {};
  const analytics = rawData.analytics || {};
  const contents = contentsRes.data || [];
  const formatCurrency = (val) =>
    val !== null && val !== undefined ? `$${Number(val).toLocaleString()}` : "N/A";

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not set";

  const budgetUtilization = analytics.budget_utilization || 0;
  const contentProgress =
    analytics.expected_content_count > 0
      ? Math.round((analytics.current_content_count / analytics.expected_content_count) * 100)
      : 0;

  async function handleLogContent(contentId, newCount) {
    "use server";
    await updateContent(contentId, { published_count: newCount }, campaignId);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Top Header Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {campaign.name || `Campaign #${campaignId}`}
              </h1>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
                {campaign.status || "draft"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {campaign.description || "No description provided for this campaign."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CampaignModal campaign={campaign} orgId={orgId} />
          </div>
        </div>

        {/* Campaign Meta Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div>
            <span className="block text-gray-400">Target Audience</span>
            <strong className="text-gray-800 text-sm">{campaign.target || "N/A"}</strong>
          </div>
          <div>
            <span className="block text-gray-400">Start Date</span>
            <strong className="text-gray-800 text-sm">{formatDate(campaign.start_date)}</strong>
          </div>
          <div>
            <span className="block text-gray-400">End Date</span>
            <strong className="text-gray-800 text-sm">{formatDate(campaign.end_date)}</strong>
          </div>
          <div>
            <span className="block text-gray-400">Last Updated</span>
            <strong className="text-gray-800 text-sm">{formatDate(campaign.updatedAt)}</strong>
          </div>
        </div>
      </div>



      {/* 3. Analytics KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Budget Overview
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(analytics.current_spent)}
            </span>
            <span className="text-xs text-gray-500">
              of {formatCurrency(analytics.expected_budget)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-right">{budgetUtilization}% Utilized</p>
          </div>
        </div>

        {/* Content Progress Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Content Progress
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {analytics.current_content_count || 0}
            </span>
            <span className="text-xs text-gray-500">
              / {analytics.expected_content_count || 0} Items
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, contentProgress)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-right">{contentProgress}% Completed</p>
          </div>
        </div>

        {/* Revenue & ROI Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Revenue & ROI
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(analytics.total_revenue)}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              ROI: {analytics.roi !== null ? `${analytics.roi}%` : "N/A"}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Cost Per Lead (CPL): <strong>{formatCurrency(analytics.cpl)}</strong>
          </p>
        </div>

        {/* Conversions Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Conversions
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {analytics.win_count || 0} Wins
            </span>
            <span className="text-xs text-gray-500">
              Win Rate: {analytics.win_rate || 0}%
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Active Connections: <strong>{analytics.connections_count || 0}</strong>
          </p>
        </div>
      </div>

      {/* 4. Content Kanban Board (Now at the bottom) */}
      <ContentKanban
        orgId={orgId}
        campaignId={campaignId}
        initialContents={contents||[]}
        campaignChannels={[]}
      />
    </div>
  );
}