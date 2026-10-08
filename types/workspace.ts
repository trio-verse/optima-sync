export type TaskStatus = 'pending'| 'in_progress' | 'missed' | 'completed' ;
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskMember {
  id: string;
  name: string;
} 

export interface Employee {
  id: number; 
  organization_id?: number; 
  name: string;
  email: string;
  phone: string;
  position: string;
  cost_per_hour:  number; 
  houres_per_point?:  number; 
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  organization_id?: string;
  category_id: string;
  category_name: string;
  member_id: string;
  member_name: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assigned_by : TaskMember;
}

export interface CreateTaskPayload {
  organization_id?: string;
  project_id?: string;
  assignee_id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface CreateEmployeePayload {
  organization_id?: number | string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  cost_per_hour?: string | number;   
  houres_per_point?: string | number; 
}