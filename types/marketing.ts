export type CampaignStatus = 'active' |'draft' | 'paused' | 'completed' | 'cancelled';

export interface ICampaign {
  id: string;
  organization_id?: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  expected_budget?: number;
  estimated_content_count?: number;
  status: CampaignStatus;
  target: string;
}

export interface ICampaignContent {
  id: string;
  campaign_id: string;
  channel_id: string;
  title: string;
  type:  string ;
  script: string;
  cost: number;      
  status: 'draft' | 'in_review' | 'approved' |'rejected'| 'published';
  published_at?: string;
  description?: string;
  assigned_by?: number;
}

export interface IMarketingAnalytics {
  total_campaigns: number;
  active_campaigns: number;
  total_spent: number;
  total_connections: number;
  total_revenue: number;
  overall_CPL: number; // Cost Per Lead
  overall_percentage_ROI: number; // Return On Investment
  total_wins: number;
}

export interface ICreateCampaignPayload {
  organization_id?: string;
  name: string;
  description?: string;
  budget: number;
  status?: CampaignStatus;
  start_date: string;
  end_date?: string;
  channel_id?: string;
}