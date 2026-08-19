import {
  getCampaignDetails,
  getCampaignContents,
} from "@/actions/campaignDetails";
import ContentKanban from "@/components/campaigns/[id]/ContentKanban";
import CampaignProgressTracker from "@/components/campaigns/[id]/CampaignProgressTracker";



export default async function CampaignDetailsPage({ params }) {
  const { id } = params;

  const [detailsRes, contentsRes] = await Promise.all([
    getCampaignDetails(id),
    getCampaignContents(id),
  ]);

  const campaign = detailsRes.success ? detailsRes.data : {};
  const contents = contentsRes.success ? contentsRes.data : [];

  const spentPercentage = Math.min(
    100,
    Math.round(((campaign.current_spent || 0) / (campaign.budget || 1)) * 100),
  );

  async function handleLogContent(newCount) {
    "use server";
    await updateCampaignProgress(id, newCount);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Campaign Overview Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {campaign.name}
            </h1>
            <p className="text-sm text-gray-500">
              Campaign details and cost approvals.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
            {campaign.status}
          </span>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Budget Spent: <strong>${campaign.current_spent}</strong>
            </span>
            <span className="text-gray-600">
              Total Budget: <strong>${campaign.budget}</strong>
            </span>
          </div>
          <div className="w-full rounded-full bg-gray-100 h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Channels List */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Active Channels:</span>
          {campaign.channels?.map((ch) => (
            <span
              key={ch}
              className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-700"
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* Content Kanban Board */}
      <ContentKanban
        campaignId={id}
        initialContents={contents}
        campaignChannels={campaign.channels || []}
      />

      <CampaignProgressTracker
        initialPublishedCount={campaign.published_content_count || 0}
        targetCount={campaign.estimated_content_count || 10}
        spentBudget={campaign.current_spent || 0}
        totalBudget={campaign.expected_budget || 1000}
        onLogContent={handleLogContent}
      />
    </div>
  );
}
