import { OrgMember } from "./organization";

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}
export enum TaskStatus {
  pending = "pending",
  inProgress = "inProgress",
  completed = "completed"
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

export type WorkSpaceStatus = "active" | "completed" | "archived";
export interface WorkSpace {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  status: WorkSpaceStatus;
  members: OrgMember[];
  tasks: TaskType[];
}
export interface WorkSpaceMembers {
  id: number;
  userId: number;
  workspaceId: number;
  name: string;
  email:string;
  role: string;
}
