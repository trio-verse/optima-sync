import { getCampaignAnalytics, getCampaignContents } from "@/actions/campaignDetails";
import ContentKanban from "@/components/campaigns/[id]/ContentKanban";
import CampaignModal from "@/components/campaigns/CampaignModal";
import { Calendar, Target, Clock, ArrowUpRight, DollarSign, PieChart, Layers, Share2 } from "lucide-react";

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // حاسبة النسب
  const budgetUtilization = Math.min(Math.max(analytics.budget_utilization || 0, 0), 100);
  const isOverBudget = (analytics.budget_utilization || 0) > 100;
  const contentProgress =
    analytics.expected_content_count > 0
      ? Math.round(((analytics.current_content_count || 0) / analytics.expected_content_count) * 100)
      : 0;

  const statusCounts = analytics.content_by_status || {};
  const channelCounts = analytics.content_by_channel || [];
  const totalContent = analytics.current_content_count || 1;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      
      {/* 1. Header Card (Hero Section - Light Mode) */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-white via-indigo-50/30 to-white p-8 text-gray-900 shadow-sm">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200/80">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600 border border-indigo-200 uppercase tracking-wider">
                {campaign.status || "draft"}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {campaign.name || `Campaign #${campaignId}`}
              </h1>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              {campaign.description || "No description provided for this campaign."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CampaignModal campaign={campaign} orgId={orgId} />
          </div>
        </div>

        {/* Hero Bottom Stats - Light Mode */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-100">
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="block text-gray-500">Target Audience</span>
              <strong className="text-gray-900 text-sm font-semibold">{campaign.target || "N/A"}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-100">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="block text-gray-500">Start Date</span>
              <strong className="text-gray-900 text-sm font-semibold">{formatDate(campaign.start_date)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-100">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="block text-gray-500">End Date</span>
              <strong className="text-gray-900 text-sm font-semibold">{formatDate(campaign.end_date)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-100">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="block text-gray-500">Last Updated</span>
              <strong className="text-gray-900 text-sm font-semibold">{formatDate(campaign.updatedAt)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual KPI Grid (Charts & Guages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Budget Circular Radial Chart */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Utilization</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-around my-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="8" className="text-gray-100" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={238}
                  strokeDashoffset={238 - (238 * budgetUtilization) / 100}
                  strokeLinecap="round"
                  className={isOverBudget ? "text-red-500" : "text-indigo-600"}
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-gray-800">
                {analytics.budget_utilization}%
              </span>
            </div>
          </div>
          <div className="space-y-1 border-t pt-3 border-gray-100 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Spent:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(analytics.current_spent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Budget:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(analytics.expected_budget)}</span>
            </div>
          </div>
        </div>

        {/* Content Progress Radial Chart */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Content Goal</span>
            <Layers className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-around my-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="8" className="text-gray-100" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={238}
                  strokeDashoffset={238 - (238 * Math.min(contentProgress, 100)) / 100}
                  strokeLinecap="round"
                  className="text-emerald-500"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-gray-800">
                {contentProgress}%
              </span>
            </div>
          </div>
          <div className="space-y-1 border-t pt-3 border-gray-100 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Current:</span>
              <span className="font-semibold text-gray-800">{analytics.current_content_count || 0} Items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target:</span>
              <span className="font-semibold text-gray-800">{analytics.expected_content_count || 0} Items</span>
            </div>
          </div>
        </div>

        {/* Revenue & ROI Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue & ROI</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2 space-y-1">
            <div className="text-2xl font-black text-gray-900">{formatCurrency(analytics.total_revenue)}</div>
            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
              ROI: {analytics.roi !== null ? `${analytics.roi}%` : "0%"}
            </span>
          </div>
          <div className="border-t pt-3 border-gray-100 text-xs flex justify-between">
            <span className="text-gray-500">Cost Per Lead (CPL):</span>
            <span className="font-semibold text-gray-800">{formatCurrency(analytics.cpl)}</span>
          </div>
        </div>

        {/* Conversions Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversions</span>
            <Share2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2 space-y-1">
            <div className="text-2xl font-black text-gray-900">{analytics.win_count || 0} Wins</div>
            <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
              Win Rate: {analytics.win_rate || 0}%
            </span>
          </div>
          <div className="border-t pt-3 border-gray-100 text-xs flex justify-between">
            <span className="text-gray-500">Count Connections:</span>
            <span className="font-semibold text-gray-800">{analytics.connections_count || 0}</span>
          </div>
        </div>

      </div>

      {/* 3. Detailed Visual Analytics (Bar Charts & Channel Distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Horizontal Bar Chart */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-500" />
              Content Status Breakdown
            </h3>
            <span className="text-xs text-gray-400">{analytics.current_content_count || 0} Total</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Draft", count: statusCounts.draft || 0, color: "bg-gray-400" },
              { label: "In Review", count: statusCounts.in_review || 0, color: "bg-amber-400" },
              { label: "Approved", count: statusCounts.approved || 0, color: "bg-emerald-500" },
              { label: "Rejected", count: statusCounts.rejected || 0, color: "bg-rose-500" },
            ].map((st, i) => {
              const pct = Math.round((st.count / totalContent) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">{st.label}</span>
                    <span className="text-gray-800">{st.count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${st.color} transition-all duration-500 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Segment Distribution */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-500" />
              Distribution by Channel
            </h3>
          </div>

          <div className="space-y-3">
            {channelCounts.length > 0 ? (
              channelCounts.map((ch, idx) => {
                const pct = Math.round((ch.count / totalContent) * 100);
                return (
                  <div key={idx} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800 capitalize">{ch.channel || "Unassigned"}</span>
                      <span className="font-bold text-indigo-600">{ch.count} items ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No channel distribution data</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Kanban Pipeline with Scroll Arrows */}
      <ContentKanban
        orgId={orgId}
        campaignId={campaignId}
        initialContents={contents || []}
        campaignChannels={[]}
      />
    </div>
  );
}