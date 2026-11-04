import React from "react";
import KanbanItem from "@/components/workspace/KanbanItem";
import { TaskPriority, TaskStatus, TaskType } from "@/types/workspaceTypes";
import TaskItem from "@/components/workspace/TaskItem";
import { OrgMember } from "@/types/organization";
import TaskTab from "@/components/workspace/TaskTab";

const WorkspaceDetails = () => {
  const orgMember: OrgMember = {
    id: "2",
    organization_id: "3",
    user: {
      id: "1",
      name: "ghazal",
      email: "ghazalalabe13@gmil.com",
    },
    role: "admin",
  };
  const tasks: TaskType[] = [
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 1,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
  ];

  return (
    <div className="h-screen">
      <div>
        <TaskTab tasks={tasks} />
      </div>
    </div>
  );
};

export default WorkspaceDetails;
