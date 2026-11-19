import { OrgMember } from "./organization";

export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
}
export enum TaskStatus {
  pending = "pending",
  in_progress = "in_progress",
  completed = "completed"
}
export interface TaskType {
  id: number;
  title: string;
  description: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  workspaceId?: number;
  assigneee?: OrgMember;
  organization_member_id   ?: number;
}

export interface WorkSpace {
  id?: number;
  name: string;
  description: string;
  deadline?: string;
  status?: WorkSpaceStatus;
  members?: OrgMember[];
  tasks?: TaskType[];
  limit?:number;
}
export interface WorkSpaceMembers {
  id: number;
  userId: number;
  workspaceId: number;
  name: string;
  email:string;
  role: string;
}
export enum WorkSpaceFilter {
  all = "all",
  active = "active",
  completed = "complete",
  archived = "archived",
}
export enum WorkSpaceStatus {
  active = "active",
  completed = "complete",
  archived = "archived",
}


export interface WorkspaseState {
  all_tasks: number;//100
  completed_tasks: number;//50
  workspace_per_status: { status: WorkSpaceStatus; count: number }[];
//   status:archived,count:100,
}
