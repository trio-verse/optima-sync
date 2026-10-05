// Project Types

export type ProjectStatus =
  | "new"
  | "under_review"
  | "accepted"
  | "in_progress"
  | "completed"
  | "on_hold"
  | "rejected"
  | "fail"
  | "deliverd";

export type ProjectSource = "internal" | "Client";

export type PaymentTerms = "due_on_receipt" | "net_60" | "net_90";

// Project User

export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_admin?: boolean;
  is_member?: boolean;
}

// Project Version

export interface ProjectVersion {
  id: number;
  project_id: number;
  based_on_version_id: number | null;

  version_number: number;

  title: string;
  description: string;
  change_description: string | null;

  start_date: string;
  end_date: string;
  duration: string;

  freeze: boolean;
  is_editable: boolean;

  has_generated_quotation: boolean;
  quotation_number: string | null;
  quotation_pdf_path: string | null;
  quotation_pdf_url: string | null;
  quotation_generated_at: string | null;

  features_snapshot: unknown | null;
  costs_snapshot: unknown | null;
  employees_snapshot: unknown | null;

  created_by: number;
  created_by_user: ProjectUser;

  created_at: string;
  updated_at: string;
}

// Project API Response

export interface Project {
  id: number;
  reference_id: string;

  current_version_id: number;

  status: ProjectStatus;
  source: ProjectSource;

  client_id: number;

  sub_total: string;
  profit_percentage: string;
  development_fee: string;
  discount: string;
  tax: string;
  added_costs_total: string;
  total_amount: string;

  issue_date: string;
  valid_until: string;

  payment_terms: PaymentTerms;

  client: unknown | null;

  current_version: ProjectVersion;

  created_by: number;
  created_by_user: ProjectUser;

  created_at: string;
  updated_at: string;
}

// Project UI Model
//
// This represents the normalized object used by the UI after
// the API response has been transformed by the DTO.

export interface ProjectView {
  id: number;
  reference_id: string;

  client_id: number;

  title: string;
  description: string;

  start_date?: string;
  end_date?: string;
  duration?: string;

  sub_total?: number;
  profit_percentage?: number;
  development_fee?: number;
  discount?: number;
  tax?: number;
  added_costs_total?: number;
  total_amount?: number;

  issue_date?: string;
  valid_until?: string;

  payment_terms?: PaymentTerms;

  status: ProjectStatus;
  source: ProjectSource;

  current_version_id?: number;

  created_by?: number;
  created_by_user?: ProjectUser;

  created_at?: string;
  updated_at?: string;
}
