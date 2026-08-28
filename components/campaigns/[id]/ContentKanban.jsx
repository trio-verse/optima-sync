"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateContentStatus, confirmContentCost } from "@/actions/campaignDetails";

const COLUMNS = [
  { id: "draft", label: "Draft" },
  { id: "in_review", label: "In Review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "published", label: "Published" },
];

export default function ContentKanban({
  orgId,
  campaignId,
  initialContents,
}) {
  const router = useRouter();
  const [contents, setContents] = useState(initialContents || []);
  const [loadingId, setLoadingId] = useState(null);

  /* ── التغيير عبر الـ Endpoint الجديد ── */
  const handleStatusChange = async (contentId, newStatus) => {
    setLoadingId(contentId);

    const res = await updateContentStatus(contentId, campaignId, orgId, newStatus);

    if (res.success) {
      setContents((prev) =>
        prev.map((c) =>
          c.id === contentId
            ? {
                ...c,
                status: res.data?.status || newStatus,
                published_at: res.data?.published_at || c.published_at,
              }
            : c
        )
      );
    } else {
      alert(res.error || "Failed to update status");
    }
    setLoadingId(null);
  };

  /* ── تأكيد التكلفة ── */
  const handleConfirmCost = async (contentId) => {
    setLoadingId(contentId);
    const res = await confirmContentCost(contentId, campaignId, orgId);

    if (res.success) {
      setContents((prev) =>
        prev.map((c) =>
          c.id === contentId
            ? {
                ...c,
                cost_confirmed_at:
                  res.data?.cost_confirmed_at || new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      alert(res.error || "Failed to confirm cost");
    }
    setLoadingId(null);
  };

  /* ── الانتقال لصفحة التعديل (نفس صفحة الإنشاء مع query param) ── */
  const handleCardClick = (contentId) => {
    router.push(
      `/${orgId}/dashboard/marketing/campaigns/${campaignId}/content?contentId=${contentId}`
    );
  };

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Campaign Content Pipeline
        </h2>
        {/* رابط الإنشاء الذهاب لنفس الصفحة بدون contentId */}
        <Link
          href={`/${orgId}/dashboard/marketing/campaigns/${campaignId}/content`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm"
        >
          + Add Content
        </Link>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="flex gap-6 min-w-[1800px]">
          {COLUMNS.map((col) => {
            const colContents = contents.filter((c) => c.status === col.id);
            return (
              <div
                key={col.id}
                className="flex-1 min-w-[260px] rounded-xl bg-gray-50 p-4 border border-gray-200 min-h-[500px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">{col.label}</h3>
                  <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-700">
                    {colContents.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {colContents.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.id)}
                      className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 space-y-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {item.title}
                        </h4>
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                          {item.channel?.name || "no channel"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>

                      <div
                        className="flex items-center justify-between pt-2 border-t text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-medium text-gray-700">
                          ${item.cost || 0}
                        </span>

                        {item.cost_confirmed_at ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            ✓ Confirmed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConfirmCost(item.id)}
                            disabled={loadingId === item.id}
                            className="rounded bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                          >
                            {loadingId === item.id ? "Confirming..." : "Confirm Cost"}
                          </button>
                        )}
                      </div>

                      {/* Dropdown تغيير الحالة بالخارج */}
                      <div
                        className="pt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          disabled={loadingId === item.id}
                          className="w-full rounded border border-gray-200 p-1 text-xs outline-none bg-gray-50 font-medium"
                        >
                          <option value="draft">Move to Draft</option>
                          <option value="in_review">Move to In Review</option>
                          <option value="approved">Move to Approved</option>
                          <option value="rejected">Move to Rejected</option>
                          <option value="published">Move to Published</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}