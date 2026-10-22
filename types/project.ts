// types/project.ts

import { Client } from "./crm";

export type ProjectStatus =
  | "new"
  | "under_review"
  | "pending"
  | "in_progress"
  | "completed";

export type FeatureStatus = "new" | "in_progress" | "completed"| "on_hold";
export interface ProjectVersionUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  is_member: boolean;
}
export interface ProjectVersion {
  id: number;
  project_id: number;
  based_on_version_id: number | null;
  version_number: number;
  title: string;
  description: string | null;
  change_description: string | null;
  start_date: string | null;
  end_date: string | null;
  duration: string | null;
  freeze: boolean;
  is_editable: boolean;
  
  features_snapshot?: ProjectFeature[];
  costs_snapshot?: ProjectCost[];
  employees_snapshot?: ProjectEmployee[];

  created_by: number;
  created_by_user: ProjectVersionUser;
  created_at: string;
  updated_at: string;
}
// --- Quotation Interfaces ---
// --- Query Builder Interfaces ---

export interface QueryOption {
    value: string | number;
    label: string;
}

// export interface QuerySource {
//     type: "relation" | "enum" | "column" | "relation_count";
//     relation?: string;
//     options?: QueryOption[];
// }

export interface QueryOperator {
    value: string;
    label: string;
}

export interface QueryFieldSchema {
    key: string;
    label: string;
    type: "select" | "number" | "date";
    operators: QueryOperator[];
}

export interface QueryLogicOperator {
    value: "and" | "or";
    label: string;
}

export interface QueryBuilderSchema {
    fields: QueryFieldSchema[];
    logic_operators: QueryLogicOperator[];
}

export interface QueryCondition {
    field?: string;
    operator?: string;
    value?: [] |string;
    //logic?: "and" | "or";
    //conditions?: QueryCondition[];
}

export interface QueryPayload {
    logic: "and" | "or";
    conditions: QueryCondition[];
}

export interface ChartMetricItem {
    label: string;
    value: number;
}

export interface ProjectAnalyticsMetrics {
    total_projects: number;
    total_revenue: number;
    average_profit_margin: number;
    rejection_rate: number;
}

export interface ProjectAnalyticsCharts {
    revenue_by_industry: ChartMetricItem[];
    projects_by_status: ChartMetricItem[];
    delivered_by_industry: ChartMetricItem[];
}

export interface ProjectAnalyticsData {
    metrics: ProjectAnalyticsMetrics;
    charts: ProjectAnalyticsCharts;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    next_page: string | null;
    prev_page: string | null;
    path: string;
}

export interface QueryResultsResponse {
    success: boolean;
    message?: string;
    data: Project[]; // مصفوفة المشاريع الناتجة
    meta: PaginationMeta;
}
export interface QuotationMeta {
    quotation_id: number ;
    quotation_number: string;
    project_title: string;
    client_name: string;
    total: string ;
}

export interface QuotationPreviewData {
    html: string;
    meta?: QuotationMeta;
}

export interface QuotationPdfData {
    success?: boolean;
    message?: string;
    pdf_url: string;
}
export interface ProjectFeature{
  id: number;
  name: string;
  description?: string ;
  status?: FeatureStatus; 
  project_id: number;
  project_version_id: number;
  created_at?: string;
  updated_at?: string;

}
export interface CreateFeatureInput {
  name: string;
  description?: string;
  status?: FeatureStatus;
}
export type UpdateFeatureInput = Partial<CreateFeatureInput>;

export interface ProjectCost {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  quantity: number;
  amount: number;
  line_total: number;
  formatted_amount: string;
  formatted_line_total: string;
  created_at: string;
  updated_at: string;
}


export interface CreateCostInput {
  name: string;
  description?: string;
  quantity?: number; 
  amount: number;    
}


export type UpdateCostInput = Partial<CreateCostInput>;


export interface ProjectEmployee {
  employee_id: number;
  name: string;
  email: string;
  position: string;
  total_points: number;
  cost_per_hour: number;
  calculated_cost: number;
  calculated_hours: number;
  houres_per_point: number;
}
export interface CreateProjectEmployeeInput {
  employee_id: number;
  total_points: number;
}


export type UpdateProjectEmployeeInput = Partial<CreateProjectEmployeeInput>;

export interface ProjectMeeting {
  id: number;
  project_id: number;
  organization_id: number;
  title: string;
  meeting_date: string;
  meeting_url?: string | null;
  description?: string | null;
  stakeholders?: string[] | null;
  team_members?: string[] | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingInput {
  title: string;        
  meeting_date: string;   
  meeting_url?: string;   
  description?: string; 
  stakeholders?: string[]; 
  team_members?: string[];
}

export type UpdateMeetingInput = Partial<CreateMeetingInput>;

export interface Project {
  id: number;
  organization_id: string;
  reference_id?: string;
  client_id: number | string;
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  sub_total?: number | string;
  profit_percentage?: number | string;
  total_amount?: number | string;
  discount?: number | string;
  tax?: number | string;
  issue_date?: string;
  valid_until?: string;
  payment_terms ?: string;
  status: ProjectStatus;
  development_fees?: number | string;
  added_costs_total?: number | string;
  
  client?: Client;
  current_version?: ProjectVersion;
  current_version_id?: number | string;
  
  deadline?: string;
  valid_until_days?: string | number;
  budget?: string | number;
  formatted_total_amount?: string;
  clientName?: string;
  clientEmail?: string;
  attachments_count?: number;
  attachmentsCount?: number;
  attachments?: any[];
  submittedAt?: string;

  created_by?: number | string;
  created_by_user?: {
    id: number | string;
    name: string;
    email: string;
  };
  
  created_at?: string;
  updated_at?: string;
}


export interface CreateProjectInput {
  title: string;
  client_id: number;
  description?: string;
  start_date?: string;
  end_date?: string;
  duration?: string;
  sub_total?: number ;
  profit_percentage?: number ;
  total_amount?: number ;
  discount?: number;
  tax?: number ;
  issue_date?: string;
  valid_until?: string;
  payment_terms?: string;
  status?: ProjectStatus;

}

export type UpdateProjectInput = Partial<CreateProjectInput>;
