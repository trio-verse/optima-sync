import { User, Trash2 } from "lucide-react";
import React from "react";
import MemberForm from "./MemberForm";
import { OrgMember } from "@/types/organization";
interface WorkspaceMemberProps {
  member: OrgMember;
  handleDelete: () => void;

}
export const MemberItem = ({
  member,
  handleDelete

}: WorkspaceMemberProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 mb-2 mt-2">
      <div className="flex justify-start items-center">
        <div className="flex border-2 border-gray-50 rounded-full w-10 h-10 justify-center items-center text-slate-600">
          <User className="w-5 h-5 " />
        </div>
        <div className="flex flex-col ml-2">
          <h3 className="font-bold">{member.user.name}</h3>
          <p>{member.user.email}</p>
          <p>{member.role}</p>
        </div>
      </div>
      <div className="flex flex-col jusytify-end items-end ">
        <div className="flex items-center gap-2 mr-1">

          <Trash2 
          onClick={handleDelete}
          className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default MemberItem;
