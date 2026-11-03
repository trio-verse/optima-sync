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
