"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import {
  Users,
  Link2,
  TrendingUp,
  Package,
  MapPin,
  Building2,
  Loader2,
  ArrowUpRight,
  Clock,
  DollarSign,
} from "lucide-react";

import { getClients } from "@/actions/clientActions";
import { getAllConnections } from "@/actions/connectionActions";
import { getCity } from "@/actions/services/cityService";
import { getIndustry } from "@/actions/services/industryService";
import { getProducts } from "@/actions/services/productsService";

/* ============================================================
   Design tokens — kept consistent with the app's existing
   identity (blue-600 / zinc / slate), extended with a soft
   blue→indigo gradient for the "signature" moments only.
   ============================================================ */

const STAGES = {
  lead: { label: "Lead", badge: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-400" },
  conected: { label: "Contacted", badge: "bg-blue-100 text-blue-700 border-blue-200", bar: "bg-blue-500" },
  missing_info: { label: "Missing Info", badge: "bg-purple-100 text-purple-700 border-purple-200", bar: "bg-purple-400" },
  intrested: { label: "Interested", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" },
  not_intrested: { label: "Not Interested", badge: "bg-gray-100 text-gray-700 border-gray-200", bar: "bg-gray-400" },
  win: { label: "Won", badge: "bg-green-100 text-green-700 border-green-200", bar: "bg-green-500" },
  closed: { label: "Closed", badge: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-400" },
};

const RANK_BADGE = [
  "bg-gradient-to-br from-amber-400 to-amber-500 text-white",
  "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  "bg-gradient-to-br from-orange-300 to-orange-400 text-white",
];

const AVATAR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];
function avatarColor(name = "") {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

/* ============================================================
   Signature element — the conversion ring.
   ============================================================ */
function ConversionRing({ percentage }) {
  const size = 152;
  const stroke = 13;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#eef2ff" strokeWidth={stroke} fill="none" />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-zinc-900 tabular-nums tracking-tight">
          {Number(percentage).toLocaleString("en-US")}%
        </span>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
          Win rate
        </span>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-zinc-200/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 motion-reduce:transform-none flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-extrabold text-zinc-900 tabular-nums leading-tight">{Number(value || 0).toLocaleString("en-US")}</p>
        <p className="text-[11px] text-zinc-500 font-semibold truncate">{label}</p>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, eyebrow, title, action, children, className = "", style }) {
  return (
    <div
      style={style}
      className={`bg-white rounded-3xl border border-zinc-200/70 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                {eyebrow}
              </p>
            )}
            <h2 className="text-sm font-bold text-zinc-800 truncate">{title}</h2>
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function BreakdownBar({ label, count, total, barClass }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-700">{label}</span>
        <span className="text-zinc-400 font-medium tabular-nums">
          {Number(count).toLocaleString("en-US")} <span className="text-zinc-300">·</span> {Number(pct).toLocaleString("en-US")}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ProductRow({ rank, name, count, clientsCount, price, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const badgeClass = RANK_BADGE[rank - 1] || "bg-zinc-100 text-zinc-500";
  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${badgeClass}`}>
        {Number(rank).toLocaleString("en-US")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
          <span className="font-semibold text-zinc-700 truncate">
            {name}
            {price > 0 && (
              <span className="ml-1.5 font-medium text-emerald-600">${Number(price).toLocaleString("en-US")}</span>
            )}
          </span>
          <span className="text-zinc-400 font-medium tabular-nums shrink-0">
            {Number(count).toLocaleString("en-US")} deals · {Number(clientsCount).toLocaleString("en-US")} clients
          </span>
        </div>
        <div className="w-full h-2 bg-indigo-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <Icon className="w-7 h-7 text-zinc-300" />
      <p className="text-zinc-400 text-xs font-medium">{text}</p>
    </div>
  );
}

/* ============================================================
   Skeleton — shown while data loads, mirrors the real layout
   so the page doesn't "jump" once content arrives.
   ============================================================ */
function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-6 animate-pulse" dir="ltr">
      <div className="h-24 bg-white/70 rounded-3xl border border-zinc-200/60" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-40 bg-white/70 rounded-3xl border border-zinc-200/60 lg:col-span-1" />
        <div className="h-40 bg-white/70 rounded-3xl border border-zinc-200/60 lg:col-span-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-white/70 rounded-3xl border border-zinc-200/60" />
        <div className="h-64 bg-white/70 rounded-3xl border border-zinc-200/60" />
      </div>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function SalesDashboardPage({ params: paramsPromise }) {
  const params = paramsPromise ? use(paramsPromise) : null;
  const orgId = params?.OrgId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [cities, setCities] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");

    const [clientsRes, connectionsRes, citiesRes, industriesRes, productsRes] = await Promise.all([
      getClients({}, orgId),
      getAllConnections(orgId),
      getCity(orgId),
      getIndustry(orgId),
      getProducts(orgId),
    ]);

    if (clientsRes?.success) setClients(clientsRes.data || []);
    if (connectionsRes?.success) setConnections(connectionsRes.data || []);
    if (citiesRes?.success) setCities(citiesRes.data || []);
    if (industriesRes?.success) setIndustries(industriesRes.data || []);
    if (productsRes?.success) setProducts(productsRes.data || []);

    if (!connectionsRes?.success) {
      setError(connectionsRes?.message || "Couldn't load connections data. Try refreshing the page.");
    }

    setLoading(false);
  }, [orgId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* ---------- derived stats (all from real data, nothing fabricated) ---------- */
  const totalClients = clients.length;
  const totalConnections = connections.length;

  const stageCounts = connections.reduce((acc, c) => {
    const key = c.stage ? String(c.stage).toLowerCase() : "lead";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const wonCount = stageCounts.win || 0;
  const conversionRate = totalConnections > 0 ? Math.round((wonCount / totalConnections) * 100) : 0;

  // Real catalog totals — from getProducts(orgId), not derived from connections.
  const totalCatalogProducts = products.length;

  // Price lookup: match a connection's product by id first, name as fallback,
  // since not every connection payload is guaranteed to carry the price.
  const priceById = new Map(products.map((p) => [String(p.id), parseFloat(p.price) || 0]));
  const priceByName = new Map(products.map((p) => [p.name, parseFloat(p.price) || 0]));
  const resolvePrice = (conn) => {
    const pid = conn.product?.id;
    if (pid !== undefined && pid !== null && priceById.has(String(pid))) {
      return priceById.get(String(pid));
    }
    const name = conn.product?.name;
    return name && priceByName.has(name) ? priceByName.get(name) : 0;
  };

  const productStats = connections.reduce((acc, c) => {
    const name = c.product?.name || "Unspecified";
    if (!acc[name]) acc[name] = { count: 0, clients: new Set(), price: resolvePrice(c) };
    acc[name].count += 1;
    if (c.client?.id) acc[name].clients.add(c.client.id);
    return acc;
  }, {});
  const topProducts = Object.entries(productStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([name, info]) => ({
      name,
      count: info.count,
      clientsCount: info.clients.size,
      price: info.price,
    }));

  const wonRevenue = connections
    .filter((c) => (c.stage ? String(c.stage).toLowerCase() : "lead") === "win")
    .reduce((sum, c) => sum + resolvePrice(c), 0);

  const cityCounts = clients.reduce((acc, c) => {
    const name = c.address?.city?.name || c.city?.name || "Unspecified";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const citiesCovered = Object.keys(cityCounts).length;

  const industryCounts = clients.reduce((acc, c) => {
    const name = c.industry?.name || "Unspecified";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const topIndustries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const recentConnections = [...connections]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 6);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-7 rounded-3xl border border-zinc-200/70 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div>
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1">
              Sales Overview
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Here's how the pipeline looks
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm mt-1.5 font-medium">
              Clients, connections and product performance, all in one place.
            </p>
          </div>
          <Link
            href={`/${orgId}/dashboard/sales`}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/20 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Link2 className="w-4 h-4" />
            <span>View All Connections</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Hero row: signature ring + stat chips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-1 bg-white rounded-3xl border border-zinc-200/70 shadow-sm p-6 flex items-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: "60ms" }}
          >
            <ConversionRing percentage={conversionRate} />
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-zinc-900 tabular-nums">
                {Number(wonCount).toLocaleString("en-US")} / {Number(totalConnections).toLocaleString("en-US")}
              </p>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                connections closed as{" "}
                <span className="font-semibold text-green-600">Won</span>
              </p>
              {wonRevenue > 0 && (
                <p className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {Number(wonRevenue).toLocaleString("en-US")} in won revenue
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div style={{ animationDelay: "100ms" }} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatChip icon={Users} label="Total Clients" value={totalClients} accent="bg-blue-50 text-blue-600 border-blue-100" />
            </div>
            <div style={{ animationDelay: "140ms" }} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatChip icon={Link2} label="Total Connections" value={totalConnections} accent="bg-indigo-50 text-indigo-600 border-indigo-100" />
            </div>
            <div style={{ animationDelay: "180ms" }} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatChip icon={Package} label="Total Products" value={totalCatalogProducts} accent="bg-violet-50 text-violet-600 border-violet-100" />
            </div>
            <div style={{ animationDelay: "220ms" }} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatChip icon={MapPin} label="Cities Covered" value={citiesCovered} accent="bg-emerald-50 text-emerald-600 border-emerald-100" />
            </div>
          </div>
        </div>

        {/* Pipeline by stage + Top products */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <SectionCard
            icon={TrendingUp}
            eyebrow="Pipeline"
            title="Connections by stage"
            className="lg:col-span-3"
            style={{ animationDelay: "80ms" }}
          >
            {totalConnections === 0 ? (
              <EmptyState icon={TrendingUp} text="No connections yet — add one to see the pipeline take shape." />
            ) : (
              <div className="space-y-4">
                {Object.entries(STAGES).map(([key, info]) => (
                  <BreakdownBar
                    key={key}
                    label={info.label}
                    count={stageCounts[key] || 0}
                    total={totalConnections}
                    barClass={info.bar}
                  />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={Package}
            eyebrow="Demand"
            title="Top products"
            className="lg:col-span-2"
            style={{ animationDelay: "120ms" }}
          >
            {topProducts.length === 0 ? (
              <EmptyState icon={Package} text="No product activity yet — it will rank here once connections come in." />
            ) : (
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <ProductRow
                    key={p.name}
                    rank={i + 1}
                    name={p.name}
                    count={p.count}
                    clientsCount={p.clientsCount}
                    price={p.price}
                    total={topProducts[0]?.count || 1}
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Cities + Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard icon={MapPin} eyebrow="Coverage" title="Clients by city" style={{ animationDelay: "100ms" }}>
            {topCities.length === 0 ? (
              <EmptyState icon={MapPin} text="No clients yet — cities will appear here as clients are added." />
            ) : (
              <div className="space-y-4">
                {topCities.map(([name, count]) => (
                  <BreakdownBar key={name} label={name} count={count} total={totalClients} barClass="bg-emerald-500" />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard icon={Building2} eyebrow="Segments" title="Clients by industry" style={{ animationDelay: "140ms" }}>
            {topIndustries.length === 0 ? (
              <EmptyState icon={Building2} text="No clients yet — industries will appear here as clients are added." />
            ) : (
              <div className="space-y-4">
                {topIndustries.map(([name, count]) => (
                  <BreakdownBar key={name} label={name} count={count} total={totalClients} barClass="bg-violet-500" />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Recent connections */}
        <SectionCard
          icon={Clock}
          eyebrow="Latest activity"
          title="Recent connections"
          style={{ animationDelay: "160ms" }}
          action={
            <Link
              href={`/${orgId}/dashboard/sales`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {recentConnections.length === 0 ? (
            <EmptyState icon={Link2} text="No connections recorded yet — new ones will show up here first." />
          ) : (
            <div className="flex flex-col divide-y divide-zinc-100">
              {recentConnections.map((conn) => {
                const rawStage = conn.stage ? String(conn.stage).toLowerCase() : "lead";
                const stageInfo = STAGES[rawStage] || STAGES.lead;
                const clientName = conn.client?.name || "Unknown Client";

                return (
                  <div
                    key={conn.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-zinc-50/70 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${avatarColor(clientName)}`}
                      >
                        {clientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-zinc-800 text-sm truncate">{clientName}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${stageInfo.badge}`}>
                            {stageInfo.label}
                          </span>
                        </div>
                        {conn.product?.name && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                            <Package className="w-3 h-3 text-zinc-400" />
                            {conn.product.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0 tabular-nums">
                      {conn.created_at
                        ? new Date(conn.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}