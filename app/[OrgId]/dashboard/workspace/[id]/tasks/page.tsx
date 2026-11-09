import React from "react";
import KanbanItem from "@/components/workspace/KanbanItem";
import { TaskPriority, TaskStatus, TaskType } from "@/types/workspaceTypes";
import TaskItem from "@/components/workspace/TaskItem";
import { OrgMember } from "@/types/organization";
import TaskTab from "@/components/workspace/TaskTab";
import { use } from "react";
const WorkspaceDetails = ({ params }) => {
  const resolveId: any = params ? use(params) : null;
  const orgId = resolveId?.OrgId;
  const workSpaceId = resolveId?.id;
  console.log(workSpaceId, orgId);
  const members: OrgMember[] = [
    {
      id: "1",
      organization_id: "3",
      user: {
        id: "1",
        name: "ghazal",
        email: "ghazalalabe13@gmail.com",
      },
      role: "admin",
    },
    {
      id: "2",
      organization_id: "3",
      user: {
        id: "2",
        name: "Ahmad",
        email: "ahmad@gmail.com",
      },
      role: "member",
    },
  ];
  const orgMember = members[0];
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
      id: 2,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 3,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 4,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 5,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 6,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 7,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 8,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 9,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 10,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 11,
      title: "task 1",
      description: "description",
      priority: TaskPriority.Medium,
      status: TaskStatus.pending,
      workspaceId: 2,
      assigneee: orgMember,
      assigneeId: 1,
    },
    {
      id: 12,
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
        <TaskTab tasks={tasks} members={members} orgId={orgId} workSpaceId={workSpaceId}/>
      </div>
    </div>
  );
};

export default WorkspaceDetails;
