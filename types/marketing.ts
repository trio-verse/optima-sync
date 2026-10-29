import { PaginationMeta } from "./api";
import { Connection } from "./Connection";

export type CampaignStatus = 'active' |'draft' | 'paused' | 'completed' | 'cancelled';

export type ContentStatus = 'draft' | 'in_review' | 'approved' |'rejected'| 'published';

export interface CampaignRequest {
  id?: string;
  organization_id?: string;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  expected_budget?: number;
  estimated_content_count?: number;
  status: CampaignStatus;
  target: string;
}

export interface Campaign{
  id:string;
  name:string;
  description:string;
  target:string;
  status:ContentStatus;
  starts_at:string;
  end_date: string;
  expected_budget: number;
  estimated_content_count: number;
  created_at:string;
  updated_at:string;
  duration:string|number;
  content_progress:number;
  content_performance:number;
  is_overdue:boolean;
  days_remaining:number;
  formatted_budget:string;
  connections?:Connection[];
  createdAt?:string;
  updatedAt?:string;
}


export interface CampaignContent {
  [x: string]: any;
  id?: string|number;
  campaign_id?: string;
  channel_id?: string;
  title: string;
  type:  string ;
  script: string;
  cost?: number;      
  status?:ContentStatus;
  published_at?: string;
  description?: string;
  assigned_by?: number;
}
export type CampaignContentRequest = Omit<CampaignContent , "id">;

export interface CampaignAnalytics{
  expected_budget:number;
  current_spent:number;
  remaining_budget:number;
  budget_utilization:number;
  connections_count:number;
  win_count:number;
  win_rate:number;
  total_revenue:number;
  cpl:number;
  roi:number;
  expected_content_count:number;
  current_content_count:number;
  content_by_status:ContentStatus;
}

export interface CampaignStats{
  campaign?:Campaign;
  analytics?:CampaignAnalytics;
  content_by_channel:{channel:string,count:number}[];
}

export interface MarketingAnalytics {
  total_campaigns: number;
  active_campaigns: number;
  total_spent: number;
  total_connections: number;
  total_wins: number;
  total_revenue: number;
  overall_CPL: number; // Cost Per Lead
  overall_percentage_ROI: number; // Return On Investment
}

export interface EffectiveCampaigns{
  id: number,
  name: string,
  status: CampaignStatus,
  onnections_count: number,
  total_revenue: number,
  current_spent: number,
  cpl: number,
  roi: number,
}

export interface ComfirmCost{
  campaign_id:number;
  content_id:number;
  cost?:number;
}