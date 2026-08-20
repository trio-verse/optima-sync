"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    DollarSign,
    TrendingUp,
    Target,
    Megaphone,
    Download,
    ArrowUpRight,
    ChevronRight,
    Trophy,
    Users,
    FileText,
    Layers,
    Sparkles,
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

// بيانات تجريبية تستخدم فقط إذا ما وصلت initialCampaigns (fallback محلي للتطوير)
const FALLBACK_CAMPAIGNS = [
    { id: "1", name: "Summer Promo 2026", status: "active", spent: 12000, connections: 650, revenue: 29400, hasWonDeals: true, wonDeals: 45, expectedContent: 80 },
    { id: "2", name: "Black Friday Push", status: "active", spent: 20000, connections: 1200, revenue: 62000, hasWonDeals: true, wonDeals: 89, expectedContent: 120 },
];

/* ============================================================
   1️⃣ Column chart — لمقارنة رقمين إجماليين بالفلوس (Spent vs
   Revenue). عمودي لأنه أوضح لعين المستخدم لمقارنة قيمتين بسيطة.
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
   2️⃣ Donut chart — Connections vs Won Deals. بدّلناها من Funnel
   لدونات: بتبين مباشرة "قد إيش من إجمالي الـ connections تحول
   لصفقة رابحة" بنظرة وحدة، مع الرقمين وسط الدائرة.
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
                            formatter={(val, name) => [Number(val).toLocaleString(), name]}
                            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e2e8f0" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalWins}</span>
                    <span className="text-[10px] font-semibold text-slate-400">of {totalConnections} won</span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Won ({totalWins})
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Other ({remaining})
                </span>
                <span className="text-xs font-bold text-indigo-600">{winRate}%</span>
            </div>
        </div>
    );
}

/* ============================================================
   3️⃣ Radial gauge — Win Rate و ROI هوي مؤشرات أداء (%) مش أرقام
   للمقارنة، فعداد دائري أوضح بكتير من bar عادي.
   ============================================================ */
function RadialGauge({ label, value, color, domainMax }) {
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
                    <span className="text-lg font-extrabold text-slate-900 tabular-nums">{value}%</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">{label}</span>
        </div>
    );
}

function KpiGauges({ winRate, roi }) {
    const roiDomainMax = Math.max(100, Math.abs(roi) + 20);
    return (
        <div className="h-56 flex items-center justify-around">
            <RadialGauge label="Win Rate" value={winRate} color="#8b5cf6" domainMax={100} />
            <RadialGauge label="ROI" value={roi} color={roi >= 0 ? "#10b981" : "#ef4444"} domainMax={roiDomainMax} />
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

export default function MarketingAnalyticsDashboard({
    orgId,
    analytics = null,
    initialCampaigns = [],
    effectiveCampaigns = [],
}) {
    console.log("📦 Raw analytics:", analytics);
    console.log("📦 Raw campaigns:", initialCampaigns);

    const [campaigns] = useState(
        initialCampaigns.length > 0 ? initialCampaigns : FALLBACK_CAMPAIGNS
    );
    const [sortBy, setSortBy] = useState("roi");

    // خريطة أداء كل حملة لحالها (win_rate / roi / cpl) الجايي من
    // GET /marketing/analytics ضمن analytics.per_campaign — حقيقي
    // من الباك، بنطابقها بالـ id مع كل حملة.
    const perCampaignMap = useMemo(() => {
        const map = new Map();
        (analytics?.per_campaign || []).forEach((p) => map.set(String(p.id), p));
        return map;
    }, [analytics]);

    const effectiveCampaignIds = useMemo(
        () => new Set(effectiveCampaigns.map((campaign) => String(campaign.id))),
        [effectiveCampaigns]
    );

    // 1. بطاقات الـ KPIs العلوية — كلها من GET /marketing/analytics
    const kpiData = useMemo(() => {
        const totalCampaigns = analytics?.total_campaigns ?? campaigns.length;
        const activeCount =
            analytics?.active_campaigns ??
            campaigns.filter((c) => c.status === "active").length;
        const totalSpent = analytics?.total_spent ?? 0;
        // ملاحظة: الباك عندهم typo بالاسم "total_cnnections" (ناقصة حرف o) - خليناها متل ما هي بالـ response
        const totalConnections = analytics?.total_cnnections ?? 0;
        const totalWins = analytics?.total_wins ?? 0;
        const totalRevenue = analytics?.total_revenue ?? 0;
        const overallCpl = analytics?.overall_CPL ?? 0;
        const totalROI = analytics?.overall_percentage_ROI ?? 0;

        // ✅ مشتقة من أرقام الباك نفسها (total_wins / total_cnnections)
        const totalWinRate =
            totalConnections > 0 ? Math.round((totalWins / totalConnections) * 100) : 0;

        // ✅ صارت حقيقية: مجموع estimated_content_count الحقيقي لكل
        // حملة راجعة من GET /marketing/analytics/effective-campaigns
        // (كانت static placeholder، هلق بتحسب من initialCampaigns فعلياً)
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

    // 2. معالجة كل حملة — الأسماء هلق مطابقة تماماً لـ GET
    // /marketing/analytics/effective-campaigns (current_spent,
    // connections_count, total_revenue, estimated_content_count,
    // status...)، وwin_rate/roi/cpl الحقيقيين ماخوذين من
    // analytics.per_campaign عن طريق الـ id.
    const processedCampaigns = useMemo(() => {
        return campaigns.map((c) => {
            const spent = c.current_spent ?? c.spent ?? c.expected_budget ?? 0;
            const connections = c.connections_count ?? c.connections ?? 0;
            const revenue = c.total_revenue ?? c.revenue ?? 0;
            const expectedContent = c.estimated_content_count ?? c.expectedContent ?? 0;
            const status = c.status ?? "unknown";

            const perCampaign = perCampaignMap.get(String(c.id));

            // win_rate الحقيقي من analytics.per_campaign إذا موجود،
            // وإلا fallback لحساب محلي لو كان في wonDeals جاهزة (موك بيئة التطوير)
            const winRate =
                perCampaign?.win_rate ??
                (connections > 0 ? Math.round(((c.wonDeals ?? 0) / connections) * 100) : 0);

            // roi و cpl الحقيقيين من analytics.per_campaign (ممكن يكونوا null
            // من الباك لو الحملة بعدها ما إلها إنفاق أو صفقات - هيك خليناهم)
            const roi = perCampaign?.roi ?? c.roi ?? null;
            const cpl = perCampaign?.cpl ?? c.cpl ?? (connections > 0 ? spent / connections : 0);

            // wonDeals مش حقل راجع مباشرة من الباك، فبنشتقها من win_rate
            // الحقيقي × عدد connections الحقيقي (مش قيمة موك)
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

    // 3. ترتيب الحملات
    const sortedCampaigns = useMemo(() => {
        return [...processedCampaigns].sort((a, b) => {
            if (sortBy === "cpl") return a.cpl - b.cpl;
            if (sortBy === "winRate") return (b.winRate || 0) - (a.winRate || 0);
            return (b.roi || -999) - (a.roi || -999);
        });
    }, [processedCampaigns, sortBy]);

    /* ============================================================
       4. بيانات مخطط Spent vs Revenue الإجمالي — من kpiData مباشرة
       (نفسه مبني من الـ analytics الجاي من الباك).
       ============================================================ */
    const spentVsRevenueData = useMemo(
        () => [
            { name: "Total Spent", value: kpiData.totalSpent, fill: "#f43f5e" },
            { name: "Total Revenue", value: kpiData.totalRevenue, fill: "#10b981" },
        ],
        [kpiData.totalSpent, kpiData.totalRevenue]
    );

    const currencyFormatter = (v) => `$${Number(v || 0).toLocaleString()}`;

    // تصدير CSV
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
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing Overview</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Executive performance analytics and real-time financial ROI metrics.
                    </p>
                </div>

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

            {/* 1. KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-5">
                {/* Total Campaigns ✅ Backend */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Total Campaigns</span>
                        <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
                            <Layers className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpiData.totalCampaigns}</div>
                    <p className="text-[10px] text-slate-400">All campaigns</p>
                </div>

                {/* Active ✅ Backend */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Active</span>
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                            <Megaphone className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">{kpiData.activeCount}</div>
                    <p className="text-[10px] text-slate-400">Running campaigns</p>
                </div>

                {/* Total Spent ✅ Backend */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Total Spent</span>
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <DollarSign className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900">
                        ${kpiData.totalSpent.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-400">Total approved expenses</p>
                </div>

                {/* Revenue ✅ Backend */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Revenue</span>
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-emerald-600">
                        ${kpiData.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" /> Won deals
                    </p>
                </div>

                {/* Total Wins ✅ Backend */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Total Wins</span>
                        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                            <Trophy className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-rose-600">
                        {kpiData.totalWins.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-400">Won deals total</p>
                </div>

                {/* Overall CPL ✅ Backend */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Overall CPL</span>
                        <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
                            <Target className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-cyan-600">
                        ${kpiData.overallCpl.toFixed(2)}
                    </div>
                    <p className="text-[10px] text-slate-400">Spent ÷ connections</p>
                </div>

                {/* Effective Campaigns ✅ من GET /marketing/analytics/effective-campaigns */}
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                            Effective Campaigns
                        </span>
                        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                            <Sparkles className="h-3.5 w-3.5" />
                        </div>
                    </div>
                    <div className="text-xl font-extrabold text-emerald-700">
                        {kpiData.effectiveCampaignCount} / {kpiData.totalCampaigns}
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium">From effective-campaigns endpoint</p>
                </div>

                {/* Expected Content ✅ مجموع حقيقي من estimated_content_count */}
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
                        {kpiData.totalExpectedContent.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-purple-600 font-medium">Sum across campaigns</p>
                </div>
            </div>

            {/* 2. Charts Section — أرقام إجمالية (Aggregate) من kpiData، مش لكل حملة لحالها */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1️⃣ إجمالي المصروفات والإيرادات */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Spent vs Revenue</h3>
                        <p className="text-xs text-slate-500">Total marketing spend compared to revenue from won deals</p>
                    </div>
                    {kpiData.totalSpent === 0 && kpiData.totalRevenue === 0 ? (
                        <ChartEmptyState text="No spend or revenue recorded yet." />
                    ) : (
                        <ColumnComparisonChart data={spentVsRevenueData} valueFormatter={currencyFormatter} />
                    )}
                </div>

                {/* 2️⃣ إجمالي الكونيكشنز والصفقات الرابحة */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Connections vs Won Deals</h3>
                        <p className="text-xs text-slate-500">Share of total connections that converted into won deals</p>
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

                {/* 3️⃣ مؤشرات الأداء الرئيسية: Win Rate & ROI */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Key Performance Indicators</h3>
                        <p className="text-xs text-slate-500">Overall win rate and return on investment</p>
                    </div>
                    {kpiData.totalConnections === 0 && kpiData.totalSpent === 0 ? (
                        <ChartEmptyState text="Not enough data yet to calculate KPIs." />
                    ) : (
                        <KpiGauges winRate={kpiData.totalWinRate} roi={kpiData.totalROI} />
                    )}
                </div>
            </div>

            {/* 3. Campaign Cards */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Campaigns Performance</h3>
                        <p className="text-xs text-slate-500">
                            {kpiData.effectiveCampaignCount} effective campaigns out of {kpiData.totalCampaigns} total
                        </p>
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
                            <option value="winRate">Highest Win Rate</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedCampaigns.map((c) => (
                        <div
                            key={c.id}
                            className={`group rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 ${c.isEffective
                                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white"
                                    : "border-slate-200/80 bg-white"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/${orgId}/dashboard/marketing/campaigns/${c.id}`}
                                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                                    >
                                        {c.name}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.status === "active"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${c.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                                                    }`}
                                            />
                                            {c.status}
                                        </span>
                                        {c.isEffective && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                                <Sparkles className="h-3 w-3" /> Effective
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ROI</div>
                                    {c.roi !== null ? (
                                        <span className={`text-lg font-extrabold ${c.roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                            {c.roi >= 0 ? "+" : ""}{c.roi}%
                                        </span>
                                    ) : (
                                        <span className="text-sm text-slate-400">N/A</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Spent</p>
                                    <p className="text-sm font-bold text-slate-900">${c.spent.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Connections</p>
                                    <p className="text-sm font-bold text-slate-900">{c.connections}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Wins</p>
                                    <p className="text-sm font-bold text-rose-600">{c.wonDeals || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Win Rate</p>
                                    <p
                                        className={`text-sm font-bold ${c.winRate >= 50
                                                ? "text-emerald-600"
                                                : c.winRate >= 25
                                                    ? "text-amber-600"
                                                    : "text-slate-500"
                                            }`}
                                    >
                                        {c.winRate}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">CPL</p>
                                    <p className="text-sm font-bold text-cyan-600">${c.cpl.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Content</p>
                                    <p className="text-sm font-bold text-purple-600">{c.expectedContent || 0}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                    <span>Conversion Rate</span>
                                    <span className="font-semibold">{c.winRate}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${c.winRate >= 50
                                                ? "bg-emerald-500"
                                                : c.winRate >= 25
                                                    ? "bg-amber-500"
                                                    : "bg-slate-400"
                                            }`}
                                        style={{ width: `${Math.min(c.winRate, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}