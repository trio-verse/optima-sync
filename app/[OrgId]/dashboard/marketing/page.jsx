"use client";

import { useState, useMemo , use} from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Target,
  Megaphone,
  Download,
  ArrowUpRight,
  ChevronRight,
  Search,
  Bell,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// بيانات أولية ديناميكية لتجربة التفاعل المباشر
const INITIAL_CAMPAIGNS = [
  { id: "1", name: "Summer Promo 2026", status: "active", spent: 12000, connections: 650, revenue: 29400, hasWonDeals: true },
  { id: "2", name: "Black Friday Push", status: "active", spent: 20000, connections: 1200, revenue: 62000, hasWonDeals: true },
  { id: "3", name: "Brand Awareness Q2", status: "active", spent: 5000, connections: 180, revenue: 0, hasWonDeals: false },
  { id: "4", name: "B2B Lead Generation", status: "active", spent: 8200, connections: 320, revenue: 15170, hasWonDeals: true },
  { id: "5", name: "Influencer Outreach", status: "paused", spent: 3000, connections: 95, revenue: 0, hasWonDeals: false },
];

export default function MarketingAnalyticsDashboard({ params  }) {
  const resolvedParams = use(params);
  const orgId = resolvedParams.OrgId || resolvedParams.orgId;
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [sortBy, setSortBy] = useState("roi");

  // 1. حساب بطاقات الـ KPIs ديناميكياً 100% بناءً على أرقام الحملات
  const kpiData = useMemo(() => {
    const totalSpent = campaigns.reduce((acc, curr) => acc + curr.spent, 0);
    const totalConnections = campaigns.reduce((acc, curr) => acc + curr.connections, 0);
    const totalRevenue = campaigns.reduce((acc, curr) => acc + curr.revenue, 0);
    const activeCount = campaigns.filter((c) => c.status === "active").length;

    // حساب متوسط CPL العام
    const averageCpl = totalConnections > 0 ? totalSpent / totalConnections : 0;

    return { totalSpent, averageCpl, activeCount, totalRevenue };
  }, [campaigns]);

  // 2. معالجة الحملات مع حساب CPL و ROI لكل حملة ديناميكياً
  const processedCampaigns = useMemo(() => {
    return campaigns.map((c) => {
      const cpl = c.connections > 0 ? c.spent / c.connections : 0;
      // ROI = ((Revenue - Spent) / Spent) * 100
      const roi = c.hasWonDeals && c.spent > 0 ? Math.round(((c.revenue - c.spent) / c.spent) * 100) : null;
      return { ...c, cpl, roi };
    });
  }, [campaigns]);

  // 3. ترتيب الحملات للجدول
  const sortedCampaigns = useMemo(() => {
    return [...processedCampaigns].sort((a, b) => {
      if (sortBy === "cpl") return a.cpl - b.cpl;
      return (b.roi || -999) - (a.roi || -999);
    });
  }, [processedCampaigns, sortBy]);

  // 4. بيانات رسم الـ ROI (تستبعد الحملات التي لا تملك صفقات ناجحة Win)
  const winningRoiData = useMemo(() => {
    return processedCampaigns
      .filter((c) => c.hasWonDeals && c.roi !== null)
      .map((c) => ({ name: c.name, roi: c.roi }));
  }, [processedCampaigns]);

  // تصدير البيانات إلى CSV
  const handleExportCSV = () => {
    const headers = ["Campaign Name,Status,Spent,Connections,CPL,ROI"];
    const rows = sortedCampaigns.map(
      (c) => `"${c.name}",${c.status},$${c.spent},${c.connections},$${c.cpl.toFixed(2)},${c.roi !== null ? c.roi + "%" : "N/A"}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "marketing_analytics_report.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 text-slate-800">
      {/* Top Header Section (Light Mode) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive performance analytics and real-time financial ROI metrics.
          </p>
        </div>

        {/* Quick Access to Campaigns Page & Export */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${orgId}/dashboard/marketing/campaigns`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Megaphone className="h-4 w-4" /> Manage Campaigns <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4 text-slate-500" /> Export
          </button>
        </div>
      </div>

      {/* 1. KPI Summary Cards (Light Theme with Slate Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Spent */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Spent</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ${kpiData.totalSpent.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400">Total approved expenses</p>
        </div>

        {/* Average CPL */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Average CPL</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ${kpiData.averageCpl.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400">Cost per lead across campaigns</p>
        </div>

        {/* Active Campaigns */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Campaigns</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Megaphone className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpiData.activeCount}</div>
          <p className="text-xs text-slate-400">Currently running initiatives</p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            ${kpiData.totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> Won deals revenue
          </p>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connections Acquired Bar Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Connections Acquired</h3>
            <p className="text-xs text-slate-500">Acquired connections per marketing campaign</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedCampaigns}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0" }}
                />
                <Bar dataKey="connections" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Comparison Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Campaign ROI Performance (%)</h3>
            <p className="text-xs text-slate-500">Won deals campaigns only (Excludes N/A campaigns)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winningRoiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val) => [`+${val}%`, "ROI"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0" }}
                />
                <Bar dataKey="roi" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Effective Campaigns Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Effective Campaigns Performance</h3>
            <p className="text-xs text-slate-500">Real-time ranked marketing efficiency</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Rank by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700 outline-none font-semibold"
            >
              <option value="roi">Highest ROI</option>
              <option value="cpl">Lowest CPL</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Spent</th>
                <th className="px-6 py-3">Connections</th>
                <th className="px-6 py-3">CPL</th>
                <th className="px-6 py-3">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <Link href={`/${orgId}/dashboard/marketing/campaigns/${c.id}`} className="hover:underline hover:text-blue-600">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        c.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">${c.spent.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold">{c.connections}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">${c.cpl.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {c.roi !== null ? (
                      <span className="font-extrabold text-emerald-600">+{c.roi}%</span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-400">
                        N/A
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}