export type TaskStatus = 'pending'| 'in_progress' | 'Missed' | 'completed' ;
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITaskMember {
  id: string;
  name: string;
} 

export interface IEmployee {
  id: number; 
  organization_id: number; 
  name: string;
  email: string;
  phone?: string;
  position: string;
  cost_per_hour?: string | number; 
  houres_per_point?: string | number; 
  department?: string;
  avatar_url?: string;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  organization_id: string;
  category_id?: string;
  category_name?: string;
  member_id?: string;
  member_name?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  assigned_by? : ITaskMember;
  created_at?: string;
  updated_at?: string;
}

export interface ICreateTaskPayload {
  organization_id: string;
  project_id?: string;
  assignee_id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface ICreateEmployeePayload {
  organization_id: number | string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  cost_per_hour?: string | number;   
  houres_per_point?: string | number; 
}