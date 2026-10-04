export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface ICampaign {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  budget: number;
  spent?: number;
  status: CampaignStatus;
  start_date: string;
  end_date?: string;
  channel_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface ICampaignContent {
  id: string;
  campaign_id: string;
  title: string;
  content_type: 'image' | 'video' | 'copy' | 'link';
  status: 'idea' | 'in_production' | 'approved' | 'published';
  media_url?: string;
  scheduled_at?: string;
  created_at: string;
}

export interface IMarketingAnalytics {
  total_campaigns: number;
  active_campaigns: number;
  total_budget: number;
  total_spent: number;
  total_connections: number;
  total_wins: number;
  total_revenue: number;
  cpl: number; // Cost Per Lead
  roi: number; // Return On Investment
  win_rate: number;
}

export interface ICreateCampaignPayload {
  organization_id: string;
  name: string;
  description?: string;
  budget: number;
  status?: CampaignStatus;
  start_date: string;
  end_date?: string;
  channel_id?: string;
}