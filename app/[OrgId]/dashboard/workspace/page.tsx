import ProgressBar from "@/components/ui/ProgressBar";
import WorkspaceStateCard from "@/components/workspace/WorkspaceStateCard";
import FileterItem from "@/components/workspace/FilterItem";
import React from "react";
import ItemCard from "@/components/workspace/ItemCard";
import { WorkSpaceStatus } from "@/types/workspaceTypes";

const Workspace = () => {
  return (
    <div className="w-full p-2">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Workspace</h2>
        <button
          className="bg-blue-500 px-4 py-2 text-white rounded shadow-lg text-base cursor-pointer
         hover:bg-blue-600 "
        >
          Add new Workspace
        </button>
      </div>
      <hr className="my-5" />
      <div className="w-full flex flex-row justify-between gap-5">
        <WorkspaceStateCard
          color="blue"
          title="completed"
          value={15}
          percentage={15}
        />
        <WorkspaceStateCard
          color="green"
          title="active"
          value={15}
          percentage={15}
        />
        <WorkspaceStateCard
          color="red"
          title="archived"
          value={15}
          percentage={15}
        />
      </div>
      <ProgressBar value={75} />

      <div className="flex flex-row justify-between gap-6">
        <FileterItem title="All" name="filter" />
        <FileterItem title="Active" name="filter" />
        <FileterItem title="Completed" name="filter" />
        <FileterItem title="Archived" name="filter" />
      </div>
      <div className="w-full space-y-4 mt-5">
        <ItemCard
          deadline={new Date()}
          title="Workspace 1"
          status={WorkSpaceStatus.completed}
          description="This is a description for Workspace 1."
        />
        <ItemCard
          deadline={new Date()}
          title="Workspace 2"
          status={WorkSpaceStatus.archived}
          description="This is a description for Workspace 2."
        />
        <ItemCard
          deadline={new Date()}
          title="Workspace 3"
          status={WorkSpaceStatus.active}
          description="This is a description for Workspace 3."
        />
      </div>
    </div>
  );
};

export default Workspace;
