"use client";
//components/campaign/[id]/ContentKanban
import { useState } from "react";
import { updateContent} from "@/actions/campaignDetails";
import ContentModal from "./ContentForm";
import Link from "next/link";
const COLUMNS = [
  { id: "draft", label: "Draft" },
  { id: "in_review", label: "In Review" },
  { id: "published", label: "Published" },
];

export default function ContentKanban({
  orgId,
  campaignId,
  initialContents,
  campaignChannels,
}) {
  const [contents, setContents] = useState(initialContents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleStatusChange = async (contentId, newStatus) => {
    setLoadingId(contentId);
    const res = await updateContent(contentId, campaignId, newStatus);
    if (res.success) {
      setContents((prev) =>
        prev.map((c) =>
          c.id === contentId
            ? {
                ...c,
                status: newStatus,
                published_at:
                  newStatus === "published"
                    ? new Date().toISOString()
                    : c.published_at,
              }
            : c,
        ),
      );
    }
    setLoadingId(null);
  };

  const handleConfirmCost = async (contentId) => {
    setLoadingId(contentId);
    const res = await confirmContentCost(contentId, campaignId);
    if (res.success) {
      setContents((prev) =>
        prev.map((c) =>
          c.id === contentId
            ? {
                ...c,
                cost_confirmed_by: "Authorized User",
                cost_confirmed_at: new Date().toISOString(),
              }
            : c,
        ),
      );
    } else {
      alert(res.error);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Campaign Content Pipeline
        </h2>
        <Link
        href={`/${orgId}/dashboard/marketing/campaigns/${campaignId}/content`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Content
        </Link>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colContents = contents.filter((c) => c.status === col.id);
          return (
            <div
              key={col.id}
              className="rounded-xl bg-gray-50 p-4 border border-gray-200 min-h-[500px]"
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
                    className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {item.title}
                      </h4>
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                        {item.channel}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Cost Badge Section */}
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <span className="font-medium text-gray-700">
                        ${item.cost || 0}
                      </span>
                      {item.cost_confirmed_by ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          ✓ Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmCost(item.id)}
                          disabled={loadingId === item.id}
                          className="rounded bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100"
                        >
                          Confirm Cost
                        </button>
                      )}
                    </div>

                    {/* Status Move Dropdown */}
                    <div className="pt-2">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
                        }
                        disabled={loadingId === item.id}
                        className="w-full rounded border border-gray-200 p-1 text-xs outline-none bg-gray-50"
                      >
                        <option value="draft">Move to Draft</option>
                        <option value="in_review">Move to In Review</option>
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
  );
}
