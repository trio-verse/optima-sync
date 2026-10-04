export type ProjectStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  duration?: number;
  sub_total: number;
  profit_percentage: number;
  total_amount: number;
  status: ProjectStatus;
  organization_id: string;
}