"use client";

import React, { useState, useEffect } from "react";
import { 
  getProjectQueryBuilderSchema, 
  getProjectQueryResults 
} from "@/actions/projectQueryActions";
import { 
  Plus, 
  X, 
  Filter, 
  RefreshCw, 
  Download, 
  DollarSign, 
  Percent, 
  FolderCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ChevronDown
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";

export default function ProjectAnalyticsDashboard({ orgId }) {
  const [schema, setSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Active Query Builder State
  const [logic, setLogic] = useState("and");
  const [conditions, setConditions] = useState([]);
  
  // Dashboard Results State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [projectsList, setProjectsList] = useState([]);

  // Fetch Filter Schema on Mount
  useEffect(() => {
    async function loadSchema() {
      setLoadingSchema(true);
      const res = await getProjectQueryBuilderSchema(orgId);
      if (res.success && res.data) {
        setSchema(res.data);
        if (res.data.logic_operators?.length > 0) {
          setLogic(res.data.logic_operators[0].value);
        }
      }
      setLoadingSchema(false);
    }
    loadSchema();
  }, [orgId]);

  // Add Condition Row
  const addCondition = () => {
    if (!schema?.fields?.length) return;
    const defaultField = schema.fields[0];
    const defaultOp = defaultField.operators?.[0]?.value || "=";
    
    setConditions([
      ...conditions,
      {
        field: defaultField.key,
        operator: defaultOp,
        value: defaultField.type === "select" ? [] : "",
      },
    ]);
  };

  // Remove Condition
  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Update Condition Field
  const updateCondition = (index, key, val) => {
    const updated = [...conditions];
    updated[index][key] = val;

    // Reset operator/value if field type changes
    if (key === "field") {
      const fieldDef = schema.fields.find((f) => f.key === val);
      updated[index].operator = fieldDef?.operators?.[0]?.value || "=";
      updated[index].value = fieldDef?.type === "select" ? [] : "";
    }

    setConditions(updated);
  };

  // Submit and Fetch Filtered Results
  const handleApplyFilters = async () => {
    setLoadingData(true);
    const queryPayload = {
      logic,
      conditions,
      sort: [{ field: "total_amount", direction: "desc" }],
      pagination: { page: 1, per_page: 20 },
    };

    const res = await getProjectQueryResults(orgId, queryPayload);
    if (res.success && res.data) {
      setAnalyticsData(res.data.analytics || null);
      setProjectsList(res.data.projects || []);
    }
    setLoadingData(false);
  };

  const handleClearAll = () => {
    setConditions([]);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen text-slate-900" dir="ltr">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Analytics / Projects</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze projects, revenue, profitability and project performance using advanced filters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm">
            Last 12 months <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleApplyFilters} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Advanced Filters Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Advanced Filters</h3>
            <p className="text-xs text-slate-500">Build custom filter logic for the project table and analytics components.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleClearAll} className="text-xs font-medium text-red-500 hover:text-red-600">
              Clear All
            </button>
            <button onClick={addCondition} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Filter
            </button>
            <button onClick={handleApplyFilters} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Logic Row */}
        <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
          <span>Match</span>
          <select 
            value={logic} 
            onChange={(e) => setLogic(e.target.value)}
            className="bg-white border border-slate-200 rounded px-2 py-1 font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {schema?.logic_operators?.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            )) || <option value="and">ALL / AND</option>}
          </select>
          <span>of the following conditions:</span>
        </div>

        {/* Dynamic Condition Rows */}
        <div className="space-y-2">
          {conditions.map((cond, idx) => {
            const fieldDef = schema?.fields?.find((f) => f.key === cond.field);
            return (
              <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg text-xs shadow-2xs">
                {/* Field Selector */}
                <select
                  value={cond.field}
                  onChange={(e) => updateCondition(idx, "field", e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 flex-1 outline-none"
                >
                  {schema?.fields?.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>

                {/* Operator Selector */}
                <select
                  value={cond.operator}
                  onChange={(e) => updateCondition(idx, "operator", e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 flex-1 outline-none"
                >
                  {fieldDef?.operators?.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                {/* Value Input / Select */}
                <div className="flex-[2]">
                  {fieldDef?.type === "select" ? (
                    <select
                      value={Array.isArray(cond.value) ? cond.value[0] || "" : cond.value}
                      onChange={(e) => updateCondition(idx, "value", [e.target.value])}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 outline-none"
                    >
                      <option value="">Select Option</option>
                      {fieldDef.source?.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={fieldDef?.type === "number" ? "number" : fieldDef?.type === "date" ? "date" : "text"}
                      value={cond.value}
                      onChange={(e) => updateCondition(idx, "value", e.target.value)}
                      placeholder="Enter value..."
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 outline-none"
                    />
                  )}
                </div>

                {/* Remove Condition Button */}
                <button onClick={() => removeCondition(idx)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Applied Filters Badges */}
        {conditions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400">{conditions.length} filter(s) applied:</span>
            {conditions.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full font-medium">
                {c.field} {c.operator} {Array.isArray(c.value) ? c.value.join(", ") : c.value}
                <X className="w-3 h-3 cursor-pointer hover:text-indigo-900" onClick={() => removeCondition(i)} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Projects" value={analyticsData?.total_projects ?? 10} change="+12.4%" icon={<FolderCheck className="w-4 h-4 text-indigo-600" />} />
        <KpiCard title="Total Revenue" value={`$${analyticsData?.total_revenue?.toLocaleString() ?? "287,210"}`} change="-14.8%" isNegative icon={<DollarSign className="w-4 h-4 text-emerald-600" />} />
        <KpiCard title="Average Profit Margin" value={`${analyticsData?.avg_profit ?? 17.5}%`} change="+3.2%" icon={<Percent className="w-4 h-4 text-purple-600" />} />
        <KpiCard title="Rejection Rate" value={`${analyticsData?.rejection_rate ?? 40.0}%`} change="-2.4%" isNegative icon={<XCircle className="w-4 h-4 text-rose-600" />} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue by Industry" subtitle="Revenue generated by filtered projects">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData?.revenue_by_industry || [
              { name: "Technology", value: 280000 },
              { name: "Healthcare", value: 0 },
              { name: "E-commerce", value: 0 },
              { name: "Finance", value: 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Projects by Status" subtitle="Current status distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={analyticsData?.status_distribution || [
                  { name: "New", value: 2 },
                  { name: "In Progress", value: 3 },
                  { name: "Completed", value: 5 }
                ]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {["#6366f1", "#10b981", "#f59e0b", "#ef4444"].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Filtered Projects</h3>
            <p className="text-xs text-slate-500">{projectsList.length} projects match the current filter criteria.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="p-3 font-medium">Reference</th>
                <th className="p-3 font-medium">Client</th>
                <th className="p-3 font-medium">Industry</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Total Amount</th>
                <th className="p-3 font-medium">Profit %</th>
                <th className="p-3 font-medium">Issue Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {projectsList.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-indigo-600">{row.reference || `PRJ-2026-${100 + i}`}</td>
                  <td className="p-3 font-medium text-slate-900">{row.client_name || "Bright Future Academy"}</td>
                  <td className="p-3">{row.industry || "Technology"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                      {row.status || "Completed"}
                    </span>
                  </td>
                  <td className="p-3 font-medium">${row.total_amount?.toLocaleString() || "17,522"}</td>
                  <td className="p-3">{row.profit_percentage || 18}%</td>
                  <td className="p-3 text-slate-500">{row.issue_date || "2026-07-19"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function KpiCard({ title, value, change, isNegative, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-medium">{title}</span>
        <div className="p-1.5 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div className="mt-3">
        <div className="text-xl font-bold text-slate-900">{value}</div>
        <div className={`text-xs mt-1 font-medium ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
          {change} <span className="text-slate-400 font-normal">compared to previous period</span>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}