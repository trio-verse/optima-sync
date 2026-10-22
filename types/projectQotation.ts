export interface ProjectFeature {
  name: string;
  description: string;
}

export interface ProjectCost {
  title: string;
  description: string;
  amount: number;
}
export interface ProjectPricing {
  development_fee: number;
  costs: ProjectCost[];
}
export interface SignaturesProps {
  organization_name: string;
  client_name: string;
}
export interface SignatureBlockProps {
  label: string; // مثال: Authorized Signature — Optima Sync
}
export interface PricingTotalsAndTermsType {
  subtotal: number;
  tax?: number | null;
  discount?: number | null;
  total: number;
  currency: string;
  payment_terms: string;
  valid_until: string;
}
export interface ProjectQota {
  organaization_name: string;
  org_location: string;
  quo_number: string;
  issue_date: string;
  client_name: string;
  quotation_base_version_id: string;
  vaild_until: string;
  project_title: string;
  project_description: string;
  project_feature: ProjectFeature[];
  development_fee: number;
  subtotal: number;
  costs: ProjectCost[];
  tax?: number;
  discount?: number;
  total: number;
  currency: string;
  payment_terms: string;
}
export interface QuotationHeaderType {
  organization_name: string;
  org_location: string;
  quo_number: string;
}

export interface ContractDetailsType {
  issue_date: string;
  client_name: string;
  quotation_based_version_id: number | string;
  valid_until: string;
  project_title: string;
  project_description: string;
}
