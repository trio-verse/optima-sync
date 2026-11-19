import React from "react";
import TaskTab from "@/components/workspace/TaskTab";


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
