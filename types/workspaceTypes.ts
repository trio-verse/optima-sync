import { OrgMember } from "./organization";

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}
export enum TaskStatus {
  completed = "completed",
  inProgress = "inProgress",
  pending = "pending",
}
export interface TaskType {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  workspaceId: number;
  assigneee: OrgMember;
  assigneeId: number;
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

export interface WorkSpace {
  id?: number;
  name: string;
  description: string;
  limit?: number;
  deadline: string;
  status?: WorkSpaceStatus;
  members?: OrgMember[];
  tasks?: TaskType[];
}

export interface WorkspaseState {
  all_tasks: number;//100
  completed_tasks: number;//50
  workspace_per_status: { status: WorkSpaceStatus; count: number }[];
//   status:archived,count:100,
}


