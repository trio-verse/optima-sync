"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  FileText,
  Users,
  Trophy,
  PieChart,
  Share2,
  Calendar,
} from "lucide-react";

export default function CampaignAnalyticsView({ analyticsData }) {
  if (!analyticsData) return null;

  const { campaign, analytics } = analyticsData;

  // حساب نسبة إنجاز المحتوى
  const contentProgress = analytics.expected_content_count > 0
    ? Math.min(Math.round((analytics.current_content_count / analytics.expected_content_count) * 100), 100)
    : 0;

  return (
    <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80">
      
      {/* 1. Header: Campaign Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{campaign?.name}</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 capitalize">
              {campaign?.status || "Draft"}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">{campaign?.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Target: {campaign?.target || "N/A"}</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{campaign?.start_date ? new Date(campaign.start_date).toLocaleDateString() : "No start date"}</span>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent & Remaining */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Spent</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">${analytics?.current_spent ?? 0}</div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-slate-400">Budget: ${analytics?.expected_budget ?? 0}</span>
              <span className={`font-semibold ${analytics?.remaining_budget < 0 ? "text-red-500" : "text-emerald-600"}`}>
                ${analytics?.remaining_budget ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">ROI</span>
            <div className={`p-2 rounded-lg ${analytics?.roi >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {analytics?.roi >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${analytics?.roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {analytics?.roi ?? 0}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Return on Investment</p>
          </div>
        </div>

        {/* CPL (Cost Per Lead) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cost Per Lead (CPL)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">${analytics?.cpl ?? 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">{analytics?.connections_count ?? 0} Total Connections</p>
          </div>
        </div>

        {/* Total Revenue & Win Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">${analytics?.total_revenue ?? 0}</div>
            <div className="flex items-center justify-between text-[11px] mt-1 text-slate-400">
              <span>{analytics?.win_count ?? 0} Wins</span>
              <span className="text-purple-600 font-semibold">{analytics?.win_rate ?? 0}% Win Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Content Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Content Production
            </span>
            <span className="text-xs font-bold text-slate-900">
              {analytics?.current_content_count} / {analytics?.expected_content_count}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Goal Completion</span>
              <span>{contentProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${contentProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Status Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-500" /> Status Distribution
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-400 font-medium">Draft</div>
              <div className="text-base font-bold text-slate-700 mt-1">
                {analytics?.content_by_status?.draft || 0}
              </div>
            </div>
            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-600 font-medium">Approved</div>
              <div className="text-base font-bold text-blue-700 mt-1">
                {analytics?.content_by_status?.approved || 0}
              </div>
            </div>
            <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <div className="text-xs text-emerald-600 font-medium">Published</div>
              <div className="text-base font-bold text-emerald-700 mt-1">
                {analytics?.content_by_status?.published || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-500" /> Distribution Channels
            </span>
          </div>

          <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
            {analytics?.content_by_channel?.map((ch, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700 capitalize">{ch.channel}</span>
                <span className="px-2 py-0.5 rounded-md bg-white font-bold text-slate-900 border border-slate-200">
                  {ch.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}