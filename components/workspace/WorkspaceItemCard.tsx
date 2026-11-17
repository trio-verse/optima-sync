"use client";
import { useState } from "react";
import { WorkSpace, WorkSpaceStatus } from "@/types/workspaceTypes";
import { Check, CalendarX, CircleDot, Pencil } from "lucide-react";
import { Model } from "../ui/Model";
import WorkspaceForm from "./WorkspaceForm";
import TruncatedText from "../ui/TruncatedText";
import Select, { SelectOption } from "../ui/Select";
import Link from "next/link";
import useWorkspaceStore from "@/hooks/useWorkspaceStore";
const workspaceStatuses = Object.entries(WorkSpaceStatus).map(
  ([key, value]) => {
    return { key: key, value: value };
  },
);
interface WorkspaceItemCardProps {
  workspace: WorkSpace;
  link: string;
  limit?: number;
  onStatusChange?: (newStatus: WorkSpaceStatus) => void;
  OrgId: string;
  onSubmit: (worrkspace: WorkSpace) => void;
}
const WorkspaceItemCard = (props: WorkspaceItemCardProps) => {
  const { changeWorkspaceStatus } = useWorkspaceStore(props.OrgId);
  const statusVariants: Record<WorkSpaceStatus, string> = {
    [WorkSpaceStatus.completed]: "bg-sky-50/70 text-blue-700 border-blue-200  ",
    [WorkSpaceStatus.archived]: "bg-red-50/70 text-red-700 border-red-200 ",
    [WorkSpaceStatus.active]: "bg-green-50/70 text-green-700 border-green-200 ",
  };
  const statusIconVariants: Record<WorkSpaceStatus, React.ReactNode> = {
    [WorkSpaceStatus.completed]: <Check />,
    [WorkSpaceStatus.archived]: <CalendarX />,
    [WorkSpaceStatus.active]: <CircleDot />,
  };
  const [currentStatus, setCurrentStatus] = useState<WorkSpaceStatus>(
    props.workspace.status || WorkSpaceStatus.active,
  );
  const activeStatusClass =
    statusVariants[props.workspace.status] || statusVariants.active;
  const activeStatusIcon =
    statusIconVariants[props.workspace.status] || statusIconVariants.active;

  const handleStatusChange = (selectedKey: string) => {
    const newStatus =
      WorkSpaceStatus[selectedKey as keyof typeof WorkSpaceStatus];

    if (newStatus) {
      changeWorkspaceStatus({ workspace: props.workspace, status: newStatus });
    }
  };
  const selectedKey =
    workspaceStatuses.find((s) => s.value === currentStatus)?.key || "active";
  return (
    <div className="flex flex-row items-center p-4 w-full rounded-xl hover:shadow-md cursor-pointer  bg-gray-50 text-gray-700 border-2 transition-colors duration-500">
      <div className={`p-2 me-2 rounded-2xl ${activeStatusClass}`}>
        {activeStatusIcon}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row gap-6 ">
          <Link href={props.link}>
            <h2 className="font-bold text-nowrap">{props.workspace.name}</h2>
          </Link>
          <p>{props.workspace.deadline}</p>
          <div className="">
            {" "}
            <Select
              options={workspaceStatuses}
              selectedValue={selectedKey}
              onChange={handleStatusChange}
            />
          </div>
        </div>
        <TruncatedText text={props.workspace.description} limit={props.limit} />
      </div>
      <div className=" flex flex-row w-full justify-end ">
        <Model
          isbackDropClose={false}
          title="Update Workspace"
          buttonText="Update Workspace"
          triggerButton={
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Pencil className="w-5 h-5" />
            </button>
          }
        >
          {(closeModal) => (
            <WorkspaceForm
              initialData={props.workspace}
              OrgId={props.OrgId}
              onSuccessClose={closeModal}
            />
          )}
        </Model>
      </div>
    </div>
  );
};

export default WorkspaceItemCard;
