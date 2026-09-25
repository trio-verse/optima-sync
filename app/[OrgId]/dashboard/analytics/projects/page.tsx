"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Plus,
  X,
  Filter,
  Search,
  DollarSign,
  Briefcase,
  Percent,
  XCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// --- Types ---
export type FilterOperator =
  | "in"
  | "not_in"
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "contains";

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | string[];
}

export interface Project {
  id: number;
  reference_id: string;
  client: string;
  industry: string;
  city: string;
  status:
    | "new"
    | "under_review"
    | "accepted"
    | "in_progress"
    | "on_hold"
    | "completed"
    | "rejected"
    | "failed"
    | "delivered";
  source: string;
  total_amount: number;
  profit_percentage: number;
  issue_date: string;
  valid_until: string;
  caused_by?: string;
  created_by: string;
  employees: number;
  costs: number;
}

// --- Mock Data ---
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "E-commerce",
  "Education",
  "Finance",
  "Real Estate",
];
const STATUSES = [
  "new",
  "under_review",
  "accepted",
  "in_progress",
  "on_hold",
  "completed",
  "rejected",
  "failed",
  "delivered",
];
const STATUS_COLORS: Record<string, string> = {
  new: "#f59e0b",
  under_review: "#d97706",
  accepted: "#3b82f6",
  in_progress: "#2563eb",
  on_hold: "#6b7280",
  completed: "#10b981",
  rejected: "#ef4444",
  failed: "#dc2626",
  delivered: "#059669",
};

const MOCK_PROJECTS: Project[] = Array.from({ length: 48 }, (_, i) => {
  const id = i + 1;
  const status = STATUSES[i % STATUSES.length] as Project["status"];
  const total_amount = 8000 + ((i * 1930) % 45000);
  const profit_percentage = 15 + ((i * 7) % 30);
  return {
    id,
    reference_id: `PRJ-2026-${String(id).padStart(3, "0")}`,
    client: [
      "Acme Corp",
      "Nova Health",
      "BlueCart",
      "Vertex Labs",
      "Atlas Finance",
      "UrbanSpace",
    ][i % 6],
    industry: INDUSTRIES[i % INDUSTRIES.length],
    city: ["Dubai", "Riyadh", "Abu Dhabi", "Doha", "Sharjah"][i % 5],
    status,
    source: ["internal", "referral", "website", "partner"][i % 4],
    total_amount,
    profit_percentage,
    issue_date: `2026-0${(i % 8) + 1}-15`,
    valid_until: `2026-0${(i % 8) + 2}-15`,
    caused_by: status === "rejected" ? "Client Budget" : undefined,
    created_by: "Omar Admin",
    employees: 3 + (i % 5),
    costs: Math.round(total_amount * (1 - profit_percentage / 100)),
  };
});

export default function ProjectAnalyticsPage() {
  // State
  const [filters, setFilters] = useState<FilterCondition[]>([
    { id: "1", field: "industry", operator: "in", value: ["Technology"] },
  ]);
  const [logic, setLogic] = useState<"and" | "or">("and");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      if (filters.length === 0) return true;

      const results = filters.map((f) => {
        const val = p[f.field as keyof Project];
        if (Array.isArray(f.value)) {
          if (f.operator === "in")
            return f.value.includes(String(val));
          if (f.operator === "not_in")
            return !f.value.includes(String(val));
        } else {
          if (f.operator === "contains")
            return String(val).toLowerCase().includes(f.value.toLowerCase());
          if (f.operator === "=") return String(val) === f.value;
          if (f.operator === ">=") return Number(val) >= Number(f.value);
          if (f.operator === "<=") return Number(val) <= Number(f.value);
        }
        return true;
      });

      return logic === "and"
        ? results.every(Boolean)
        : results.some(Boolean);
    });
  }, [filters, logic]);

  // Search & Pagination
  const searchedProjects = useMemo(() => {
    return filteredProjects.filter(
      (p) =>
        p.reference_id.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase()) ||
        p.industry.toLowerCase().includes(search.toLowerCase())
    );
  }, [filteredProjects, search]);

  const totalPages = Math.ceil(searchedProjects.length / perPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * perPage;
    return searchedProjects.slice(start, start + perPage);
  }, [searchedProjects, page]);

  // KPIs
  const kpis = useMemo(() => {
    const count = filteredProjects.length;
    const revenue = filteredProjects.reduce((s, p) => s + p.total_amount, 0);
    const avgProfit = count
      ? filteredProjects.reduce((s, p) => s + p.profit_percentage, 0) / count
      : 0;
    const rejected = filteredProjects.filter((p) => p.status === "rejected").length;
    return {
      count,
      revenue,
      avgProfit,
      rejectionRate: count ? (rejected / count) * 100 : 0,
    };
  }, [filteredProjects]);

  // Chart Data Preparation
  const chartIndustryData = useMemo(() => {
    return INDUSTRIES.map((ind) => ({
      name: ind,
      revenue: filteredProjects
        .filter((p) => p.industry === ind)
        .reduce((s, p) => s + p.total_amount, 0),
    }));
  }, [filteredProjects]);

  const chartStatusData = useMemo(() => {
    return STATUSES.map((st) => ({
      name: st.replace("_", " ").toUpperCase(),
      value: filteredProjects.filter((p) => p.status === st).length,
      color: STATUS_COLORS[st],
    })).filter((d) => d.value > 0);
  }, [filteredProjects]);

  const handleAddFilter = () => {
    setFilters((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        field: "status",
        operator: "in",
        value: ["completed"],
      },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Analytics / Projects
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Project Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Analyze projects, revenue, profitability and project performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Advanced Filter Builder */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-semibold">Advanced Filters</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters([])}
              className="text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline"
            >
              Clear All
            </button>
            <button
              onClick={handleAddFilter}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Filter
            </button>
          </div>
        </div>

        {/* Logic selector */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Match</span>
          <select
            value={logic}
            onChange={(e) => setLogic(e.target.value as "and" | "or")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-semibold focus:outline-none"
          >
            <option value="and">ALL (AND)</option>
            <option value="or">ANY (OR)</option>
          </select>
          <span className="text-slate-500">of the following conditions:</span>
        </div>

        {/* Dynamic Rows */}
        <div className="space-y-2">
          {filters.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center gap-2 bg-slate-50/50 dark:bg-slate-800/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs"
            >
              <select
                value={f.field}
                onChange={(e) => {
                  const field = e.target.value;
                  setFilters((prev) =>
                    prev.map((item) =>
                      item.id === f.id
                        ? {
                            ...item,
                            field,
                            value: field === "industry" ? ["Technology"] : "",
                          }
                        : item
                    )
                  );
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5"
              >
                <option value="industry">Industry</option>
                <option value="status">Status</option>
                <option value="total_amount">Total Amount</option>
                <option value="client">Client</option>
              </select>

              <select
                value={f.operator}
                onChange={(e) => {
                  const operator = e.target.value as FilterOperator;
                  setFilters((prev) =>
                    prev.map((item) =>
                      item.id === f.id ? { ...item, operator } : item
                    )
                  );
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5"
              >
                <option value="in">Is In</option>
                <option value="not_in">Is Not In</option>
                <option value="contains">Contains</option>
                <option value=">=">Greater Than / Equal</option>
              </select>

              {f.field === "industry" && (
                <div className="flex gap-1 flex-wrap">
                  {INDUSTRIES.map((ind) => {
                    const active = (f.value as string[]).includes(ind);
                    return (
                      <button
                        key={ind}
                        onClick={() => {
                          const current = (f.value as string[]) || [];
                          const next = active
                            ? current.filter((x) => x !== ind)
                            : [...current, ind];
                          setFilters((prev) =>
                            prev.map((item) =>
                              item.id === f.id ? { ...item, value: next } : item
                            )
                          );
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border transition ${
                          active
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              )}

              {f.field !== "industry" && (
                <input
                  type="text"
                  placeholder="Value..."
                  value={String(f.value)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters((prev) =>
                      prev.map((item) =>
                        item.id === f.id ? { ...item, value: val } : item
                      )
                    );
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 focus:outline-none"
                />
              )}

              <button
                onClick={() => handleRemoveFilter(f.id)}
                className="ml-auto text-slate-400 hover:text-rose-500 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Filtered Projects"
          value={kpis.count.toLocaleString()}
          trend="+12.4% vs last month"
          isUp={true}
          icon={<Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <KpiCard
          title="Total Revenue"
          value={`$${kpis.revenue.toLocaleString()}`}
          trend="+18.6% vs last month"
          isUp={true}
          icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <KpiCard
          title="Avg Profit Margin"
          value={`${kpis.avgProfit.toFixed(1)}%`}
          trend="+3.2% vs last month"
          isUp={true}
          icon={<Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <KpiCard
          title="Rejection Rate"
          value={`${kpis.rejectionRate.toFixed(1)}%`}
          trend="-2.4% vs last month"
          isUp={false}
          icon={<XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-semibold mb-1">Revenue by Industry</h3>
          <p className="text-xs text-slate-500 mb-4">Financial volume distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartIndustryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-semibold mb-1">Projects Status Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Filtered status proportions</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold">Filtered Projects List</h3>
            <span className="text-xs text-slate-500">
              Showing {searchedProjects.length} projects matching your scope
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reference, client..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 font-semibold">Reference</th>
                <th className="p-3 font-semibold">Client</th>
                <th className="p-3 font-semibold">Industry</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Total Amount</th>
                <th className="p-3 font-semibold">Profit %</th>
                <th className="p-3 font-semibold">Issue Date</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedProjects.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition"
                >
                  <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">
                    {p.reference_id}
                  </td>
                  <td className="p-3 font-medium">{p.client}</td>
                  <td className="p-3 text-slate-500">{p.industry}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor: `${STATUS_COLORS[p.status]}20`,
                        color: STATUS_COLORS[p.status],
                      }}
                    >
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 font-medium">${p.total_amount.toLocaleString()}</td>
                  <td className="p-3">{p.profit_percentage}%</td>
                  <td className="p-3 text-slate-500">{p.issue_date}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm">
                Project Snapshot: {selectedProject.reference_id}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Client</span>
                <span className="font-semibold">{selectedProject.client}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Industry</span>
                <span className="font-semibold">{selectedProject.industry}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Budget</span>
                <span className="font-semibold">${selectedProject.total_amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Costs</span>
                <span className="font-semibold">${selectedProject.costs.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Card
function KpiCard({
  title,
  value,
  trend,
  isUp,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className={`text-[11px] font-medium flex items-center gap-1 ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {trend}
      </div>
    </div>
  );
}