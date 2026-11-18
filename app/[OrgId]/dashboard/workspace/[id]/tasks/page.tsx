import React from "react";
import KanbanItem from "@/components/workspace/KanbanItem";
import { TaskPriority, TaskStatus, TaskType } from "@/types/workspaceTypes";
import TaskItem from "@/components/workspace/TaskItem";
import { OrgMember } from "@/types/organization";
import TaskTab from "@/components/workspace/TaskTab";
import { use } from "react";
import { getTasks } from "@/actions/taskActions";
import { getWorkspaceMembers } from "@/actions/workspaceMember";

const WorkspaceDetails = async ({ params }) => {
  const { OrgId, id } = await params;

  return (
    <div className="h-screen">
      <div>
        <TaskTab orgId={OrgId} workSpaceId={id} />
      </div>
    </div>
  );
};

export default WorkspaceDetails;
