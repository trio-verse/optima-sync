"use client";
import { WorkSpaceStatus } from "@/types/workspaceTypes";
import { Check, CalendarX, CircleDot, X } from "lucide-react";
interface ItemCardProps {
  title: string;
  description: string;
  deadline: Date;
  status?: WorkSpaceStatus;
}
const ItemCard = (props: ItemCardProps) => {
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
  const activeStatusClass =
    statusVariants[props.status] || statusVariants.active;
  const activeStatusIcon =
    statusIconVariants[props.status] || statusIconVariants.active;
  return (
    <div className="flex flex-row items-center p-4 w-full rounded-xl hover:shadow-md cursor-pointer  bg-gray-50 text-gray-700 border-2 transition-colors duration-500">
      <div className={`p-2 me-2 rounded-2xl ${activeStatusClass}`}>
        {activeStatusIcon}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row gap-6">
          <h2 className="font-bold">{props.title}</h2>
          <p>{props.deadline.toLocaleDateString()}</p>
        </div>
        <p className="my-2">{props.description}</p>
      </div>
    </div>
  );
};

export default ItemCard;
