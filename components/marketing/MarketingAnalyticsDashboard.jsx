"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Megaphone,
  Download,
  ChevronRight,
  Target,
  FileText,
  Layers,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

/* ============================================================
   1️⃣ Column Chart - Spent vs Revenue
   ============================================================ */
function ColumnComparisonChart({ data, valueFormatter = (v) => v }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#334155", fontWeight: 600 }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={valueFormatter} width={64} />
          <Tooltip
            formatter={(val) => [valueFormatter(val), ""]}
            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0" }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={64}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================
   2️⃣ Donut Chart - Connections vs Won Deals
   ============================================================ */
function ConnectionsDonutChart({ totalConnections, totalWins }) {
  const remaining = Math.max(totalConnections - totalWins, 0);
  const winRate = totalConnections > 0 ? Math.round((totalWins / totalConnections) * 100) : 0;
  const data = [
    { name: "Won Deals", value: totalWins, fill: "#10b981" },
    { name: "Other Connections", value: remaining, fill: "#e2e8f0" },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="95%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val, name) => [Number(val).toLocaleString("en-US"), name]}
              contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {Number(totalWins).toLocaleString("en-US")}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            of {Number(totalConnections).toLocaleString("en-US")} won
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Won ({Number(totalWins).toLocaleString("en-US")})
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          Other ({Number(remaining).toLocaleString("en-US")})
        </span>
        <span className="text-xs font-bold text-indigo-600">
          {Number(winRate).toLocaleString("en-US")}%
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   3️⃣ Radial Gauge - Win Rate & ROI Gauges
   ============================================================ */
function RadialGauge({ label, value, color, domainMax, subtitle }) {
  const clamped = Math.max(0, Math.min(value, domainMax));
  const data = [{ value: clamped, fill: color }];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[130px] h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, domainMax]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f1f5f9" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-extrabold text-slate-900 tabular-nums">
            {Number(value).toLocaleString("en-US")}%
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      {subtitle && (
        <span className={`text-[11px] font-bold ${color === "#10b981" ? "text-emerald-600" : "text-rose-600"}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

function KpiGauges({ winRate, roi }) {
  const isPositiveRoi = roi >= 0;
  const displayRoi = isPositiveRoi ? roi : roi * -1;
  const roiStatusText = isPositiveRoi ? "Making Money" : "Losing Money";
  const roiColor = isPositiveRoi ? "#10b981" : "#ef4444";
  const roiDomainMax = Math.max(100, Math.abs(displayRoi) + 20);

  return (
    <div className="h-56 flex items-center justify-around">
      <RadialGauge label="Win Rate" value={winRate} color="#8b5cf6" domainMax={100} />
      <RadialGauge
        label="ROI"
        value={displayRoi}
        color={roiColor}
        domainMax={roiDomainMax}
        subtitle={roiStatusText}
      />
    </div>
  );
}

function ChartEmptyState({ text }) {
  return (
    <div className="h-56 w-full flex flex-col items-center justify-center gap-2 text-center">
      <BarChart3 className="w-7 h-7 text-slate-300" />
      <p className="text-slate-400 text-xs font-medium">{text}</p>
    </div>
  );
}

/* ============================================================
   Main Dashboard Component
   ============================================================ */
export default function MarketingAnalyticsDashboard({
  orgId,
  analytics = null,
  initialCampaigns = [],
  effectiveCampaigns = [],
}) {
  const [campaigns] = useState(initialCampaigns || []);
  const [sortBy, setSortBy] = useState("roi");

  const perCampaignMap = useMemo(() => {
    const map = new Map();
    (analytics?.per_campaign || []).forEach((p) => map.set(String(p.id), p));
    return map;
  }, [analytics]);

  const effectiveCampaignIds = useMemo(
    () => new Set(effectiveCampaigns.map((campaign) => String(campaign.id))),
    [effectiveCampaigns]
  );

  const kpiData = useMemo(() => {
    const totalCampaigns = analytics?.total_campaigns ?? campaigns.length;
    const activeCount =
      analytics?.active_campaigns ??
      campaigns.filter((c) => c.status === "active").length;
    const totalSpent = analytics?.total_spent ?? 0;
    const totalConnections = analytics?.total_cnnections ?? 0;
    const totalWins = analytics?.total_wins ?? 0;
    const totalRevenue = analytics?.total_revenue ?? 0;
    const overallCpl = analytics?.overall_CPL ?? 0;
    const totalROI = analytics?.overall_percentage_ROI ?? 0;

    const totalWinRate =
      totalConnections > 0 ? Math.round((totalWins / totalConnections) * 100) : 0;

    const totalExpectedContent = campaigns.reduce(
      (sum, c) => sum + (c.estimated_content_count ?? c.expectedContent ?? 0),
      0
    );

    const effectiveCampaignCount = effectiveCampaigns.length;

    return {
      totalCampaigns,
      totalSpent,
      overallCpl,
      activeCount,
      totalRevenue,
      totalWins,
      totalWinRate,
      totalExpectedContent,
      totalROI,
      totalConnections,
      effectiveCampaignCount,
    };
  }, [analytics, campaigns, effectiveCampaigns]);

  const processedCampaigns = useMemo(() => {
    return campaigns.map((c) => {
      const spent = c.current_spent ?? c.spent ?? c.expected_budget ?? 0;
      const connections = c.connections_count ?? c.connections ?? 0;
      const revenue = c.total_revenue ?? c.revenue ?? 0;
      const expectedContent = c.estimated_content_count ?? c.expectedContent ?? 0;
      const status = c.status ?? "unknown";

      const perCampaign = perCampaignMap.get(String(c.id));

      const winRate =
        perCampaign?.win_rate ??
        (connections > 0 ? Math.round(((c.wonDeals ?? 0) / connections) * 100) : 0);

      const roi = perCampaign?.roi ?? c.roi ?? null;
      const cpl = perCampaign?.cpl ?? c.cpl ?? (connections > 0 ? spent / connections : 0);

      const wonDeals = connections > 0 ? Math.round((winRate / 100) * connections) : 0;
      const hasWonDeals = wonDeals > 0;
      const isEffective = effectiveCampaignIds.has(String(c.id));

      return {
        ...c,
        spent,
        connections,
        revenue,
        wonDeals,
        expectedContent,
        hasWonDeals,
        cpl,
        roi,
        winRate,
        isEffective,
        status,
      };
    });
  }, [campaigns, perCampaignMap, effectiveCampaignIds]);

  const sortedCampaigns = useMemo(() => {
    return [...processedCampaigns].sort((a, b) => {
      if (sortBy === "cpl") return a.cpl - b.cpl;
      if (sortBy === "winRate") return (b.winRate || 0) - (a.winRate || 0);
      return (b.roi || -999) - (a.roi || -999);
    });
  }, [processedCampaigns, sortBy]);

  const spentVsRevenueData = useMemo(
    () => [
      { name: "Total Spent", value: kpiData.totalSpent, fill: "#f43f5e" },
      { name: "Total Revenue", value: kpiData.totalRevenue, fill: "#10b981" },
    ],
    [kpiData.totalSpent, kpiData.totalRevenue]
  );

  const currencyFormatter = (v) => `$${Number(v || 0).toLocaleString("en-US")}`;

  const handleExportCSV = () => {
    const headers = [
      "Campaign Name,Status,Spent,Connections,Wins,Win Rate,Expected Content,CPL,ROI,Effective",
    ];
    const rows = sortedCampaigns.map(
      (c) =>
        `"${c.name}",${c.status},$${c.spent},${c.connections},${c.wonDeals || 0},${c.winRate}%,${c.expectedContent || 0},$${c.cpl.toFixed(2)},${c.roi !== null ? c.roi + "%" : "N/A"},${c.isEffective ? "Yes" : "No"}`
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "marketing_analytics_report.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 text-slate-800">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Marketing Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive performance analytics and real-time financial ROI metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${orgId}/dashboard/marketing/campaigns`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Megaphone className="h-4 w-4" /> Manage Campaigns{" "}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4 text-slate-500" /> Export
          </button>
        </div>
      </div>

      {/* 1. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Total Campaigns
            </span>
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {kpiData.totalCampaigns.toLocaleString("en-US")}
          </div>
          <p className="text-[10px] text-slate-400">All campaigns</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Active
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Megaphone className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {kpiData.activeCount.toLocaleString("en-US")}
          </div>
          <p className="text-[10px] text-slate-400">Running campaigns</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Overall CPL
            </span>
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-cyan-600">
            $
            {Number(kpiData.overallCpl).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-[10px] text-slate-400">Spent ÷ connections</p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-white p-5 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">
              Expected Content
            </span>
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-purple-700">
            {kpiData.totalExpectedContent.toLocaleString("en-US")}
          </div>
          <p className="text-[10px] text-purple-600 font-medium">
            Sum across campaigns
          </p>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spent vs Revenue</h3>
            <p className="text-xs text-slate-500">
              Total marketing spend compared to revenue from won deals
            </p>
          </div>
          {kpiData.totalSpent === 0 && kpiData.totalRevenue === 0 ? (
            <ChartEmptyState text="No spend or revenue recorded yet." />
          ) : (
            <ColumnComparisonChart
              data={spentVsRevenueData}
              valueFormatter={currencyFormatter}
            />
          )}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Connections vs Won Deals
            </h3>
            <p className="text-xs text-slate-500">
              Share of total connections that converted into won deals
            </p>
          </div>
          {kpiData.totalConnections === 0 ? (
            <ChartEmptyState text="No connections recorded yet." />
          ) : (
            <ConnectionsDonutChart
              totalConnections={kpiData.totalConnections}
              totalWins={kpiData.totalWins}
            />
          )}
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Key Performance Indicators
            </h3>
            <p className="text-xs text-slate-500">
              Overall win rate and return on investment
            </p>
          </div>
          {kpiData.totalConnections === 0 && kpiData.totalSpent === 0 ? (
            <ChartEmptyState text="Not enough data yet to calculate KPIs." />
          ) : (
            <KpiGauges
              winRate={kpiData.totalWinRate}
              roi={kpiData.totalROI}
            />
          )}
        </div>
      </div>
    </div>
  );
}