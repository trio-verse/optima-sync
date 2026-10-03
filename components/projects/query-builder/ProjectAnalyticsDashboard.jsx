"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  Folder,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Layers,
} from "lucide-react";
const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// أداة اختيار الأيقونة المناسبة لكل Metric تلقائياً
const getMetricIcon = (title = "") => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("revenue") || lowerTitle.includes("budget") || lowerTitle.includes("cost") || lowerTitle.includes("amount")) {
    return <DollarSign className="w-5 h-5 text-emerald-600" />;
  }
  if (lowerTitle.includes("project") || lowerTitle.includes("total")) {
    return <Folder className="w-5 h-5 text-blue-600" />;
  }
  if (lowerTitle.includes("completed") || lowerTitle.includes("success") || lowerTitle.includes("win")) {
    return <CheckCircle className="w-5 h-5 text-violet-600" />;
  }
  return <TrendingUp className="w-5 h-5 text-amber-600" />;
};

export default function ProjectAnalyticsDashboard({ analytics, isLoading }) {
  // 1. حالة التحميل
  if (isLoading) {
    return (
      <div className="p-12 text-center text-zinc-500 bg-white rounded-xl border border-zinc-200 animate-pulse">
        <div className="flex flex-col items-center justify-center gap-2">
          <BarChart3 className="w-8 h-8 text-zinc-400 animate-bounce" />
          <p className="text-sm font-medium">Loading project analytics...</p>
        </div>
      </div>
    );
  }

  // 2. حالة عدم وجود بيانات
  if (!analytics) return null;

  const metrics = Array.isArray(analytics?.metrics) ? analytics.metrics : [];
  const charts = analytics?.charts || {};

  const revenueData = Array.isArray(charts?.revenue_by_industry) ? charts.revenue_by_industry : [];
  const statusData = Array.isArray(charts?.projects_by_status) ? charts.projects_by_status : [];

  return (
    <div className="space-y-6 mb-8">
      {/* Metric Cards Grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div
              key={metric.id || idx}
              className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs flex items-center justify-between hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500">{metric.title}</p>
                <p className="text-xl font-bold text-zinc-900">{metric.value ?? 0}</p>
              </div>
              <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center">
                {getMetricIcon(metric.title)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Industry (Bar Chart) */}
        {revenueData.length > 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <h4 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Revenue by Industry
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e4e4e7" }}
                    cursor={{ fill: "#f4f4f5" }}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center text-zinc-400 text-sm flex flex-col justify-center items-center h-80">
            <Layers className="w-8 h-8 mb-2 stroke-1" />
            No industry revenue data available
          </div>
        )}

        {/* Projects by Status (Pie Chart) */}
        {statusData.length > 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <h4 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Projects by Status
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", borderColor: "#e4e4e7" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 p-5 text-center text-zinc-400 text-sm flex flex-col justify-center items-center h-80">
            <Layers className="w-8 h-8 mb-2 stroke-1" />
            No status distribution data available
          </div>
        )}
      </div>
    </div>
  );
}