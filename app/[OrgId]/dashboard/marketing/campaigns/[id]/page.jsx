// marketing/campaign/[id]/page.jsx
import {
  getCampaignById,
  getCampaignContents,
  updateCampaign,
} from "@/actions/campaigns";
import { updateContent ,createContent} from "@/actions/campaignDetails";
import CampaignProgressTracker from "@/components/campaigns/[id]/CampaignProgressTracker";
import ContentKanban from "@/components/campaigns/[id]/ContentKanban";
import CampaignModal from "@/components/campaigns/CampaignModal";

export default async function CampaignDetailsPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const [detailsRes, contentsRes] = await Promise.all([
    getCampaignById(id),
    getCampaignContents(id),
  ]);

  const campaign = detailsRes.success ? detailsRes.data : {};
  const contents = contentsRes.success ? contentsRes.data : [];

  const expectedBudget = Number(campaign.expected_budget || 0);
  const currentSpent = Number(campaign.current_spent || 0);

  const spentPercentage = Math.min(
    100,
    Math.round((currentSpent / (expectedBudget || 1)) * 100)
  );

  async function handleLogContent(contentId, newCount) {
    "use server";
    await updateContent(contentId, { published_count: newCount }, id);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Campaign Overview Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {campaign.name || "Unnamed Campaign"}
              </h1>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
                {campaign.status || "draft"}
              </span>
              {campaign.is_overdue && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                  Overdue
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {campaign.description || "No description provided."}
            </p>
          </div>

          {/* Unified Edit Modal Button */}
          <CampaignModal campaign={campaign} orgId={orgId} />
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Target Audience</p>
            <p className="text-sm font-semibold text-gray-800">
              {campaign.target || "N/A"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Est. Content Count</p>
            <p className="text-sm font-semibold text-gray-800">
              {campaign.estimated_content_count || 0}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Content Progress</p>
            <p className="text-sm font-semibold text-gray-800">
              {campaign.content_progress || 0}%
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Days Remaining</p>
            <p className="text-sm font-semibold text-gray-800">
              {campaign.days_remaining || 0} Days
            </p>
          </div>
        </div>

        {/* Timeline Details */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 pt-2">
          <div>
            <span>Start Date: </span>
            <strong className="text-gray-700">{formatDate(campaign.start_date)}</strong>
          </div>
          <div>
            <span>End Date: </span>
            <strong className="text-gray-700">{formatDate(campaign.end_date)}</strong>
          </div>
          <div>
            <span>Duration: </span>
            <strong className="text-gray-700">{campaign.duration || "N/A"}</strong>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Spent: <strong>${currentSpent}</strong>
            </span>
            <span className="text-gray-600">
              Formatted Budget: <strong>{campaign.formatted_budget || `$${expectedBudget}`}</strong>
            </span>
          </div>
          <div className="w-full rounded-full bg-gray-100 h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Connected Channels / Connections */}
        {campaign.connections && campaign.connections.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>Connections:</span>
            {campaign.connections.map((conn, idx) => (
              <span
                key={idx}
                className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-700"
              >
                {conn}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Kanban Board */}
      <ContentKanban
        orgId={orgId}
        campaignId={id}
        initialContents={contents}
        campaignChannels={campaign.connections || []}
      />

      {/* Campaign Progress Tracker */}
      <CampaignProgressTracker
        initialPublishedCount={campaign.published_content_count || 0}
        targetCount={campaign.estimated_content_count || 0}
        spentBudget={currentSpent}
        totalBudget={expectedBudget}
        onLogContent={handleLogContent}
      />
    </div>
  );
}