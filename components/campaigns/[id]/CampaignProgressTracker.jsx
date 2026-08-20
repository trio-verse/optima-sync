"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

export default function CampaignProgressTracker({
  initialPublishedCount = 0,
  targetCount = 1,
  spentBudget = 0,
  totalBudget = 1,
  onLogContent,
}) {
  const [publishedCount, setPublishedCount] = useState(initialPublishedCount);

  // 1. حساب نسبة تقدم المحتوى
  const contentPercentage = useMemo(() => {
    if (!targetCount || targetCount === 0) return 0;
    const calculated = Math.round((publishedCount / targetCount) * 100);
    return Math.min(calculated, 100);
  }, [publishedCount, targetCount]);

  // 2. حساب نسبة تقدم الميزانية
  const budgetPercentage = useMemo(() => {
    if (!totalBudget || totalBudget === 0) return 0;
    return Math.round((spentBudget / totalBudget) * 100);
  }, [spentBudget, totalBudget]);

  // ألوان شريط المحتوى حسب التقدم
  const getContentColor = (percent) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 50) return "bg-blue-600";
    if (percent >= 25) return "bg-amber-500";
    return "bg-slate-400";
  };

  // لون شريط الميزانية (أحمر إذا تم تجاوز الميزانية)
  const getBudgetColor = (percent) => {
    if (percent > 100) return "bg-red-500";
    if (percent >= 85) return "bg-amber-500";
    return "bg-emerald-600";
  };

  // زيادة المحتوى المنشور فورياً
  const handleAddContent = () => {
    const newCount = publishedCount + 1;
    setPublishedCount(newCount);
    if (onLogContent) {
      onLogContent(newCount); // استدعاء دالة تحديث السيرفر إذا وُجدت
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 1. Content Progress Card */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Content Publishing Progress
            </h3>
            <p className="text-xs text-gray-500">
              {publishedCount} of {targetCount} pieces published
            </p>
          </div>
          <span className="text-lg font-bold text-gray-800">
            {contentPercentage}%
          </span>
        </div>

        {/* Content Bar */}
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${getContentColor(
              contentPercentage
            )}`}
            style={{ width: `${contentPercentage}%` }}
          />
        </div>

        {/* Actions & Remaining */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-400">
            {Math.max(0, targetCount - publishedCount)} Remaining
          </span>
          <button
            onClick={handleAddContent}
            disabled={publishedCount >= targetCount}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" /> Log Content
          </button>
        </div>
      </div>

      {/* 2. Budget Progress Card */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Budget Utilization
            </h3>
            <p className="text-xs text-gray-500">
              ${spentBudget.toLocaleString()} of ${totalBudget.toLocaleString()} spent
            </p>
          </div>
          <span
            className={`text-lg font-bold ${
              budgetPercentage > 100 ? "text-red-600" : "text-gray-800"
            }`}
          >
            {budgetPercentage}%
          </span>
        </div>

        {/* Budget Bar */}
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${getBudgetColor(
              budgetPercentage
            )}`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>

        {/* Remaining Budget Status */}
        <div className="flex justify-between text-xs text-gray-400 pt-1">
          <span>
            {totalBudget - spentBudget >= 0
              ? `$${(totalBudget - spentBudget).toLocaleString()} Remaining`
              : `Over budget by $${Math.abs(totalBudget - spentBudget).toLocaleString()}`}
          </span>
          <span>Target: ${totalBudget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}