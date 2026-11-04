import React from "react";
import { User, MoreVertical, Edit2 } from "lucide-react";
import { MemberItem } from "@/components/workspace/MemberItem";
import { OrgMember } from "@/types/organization";

const WorkspaceMember = () => {
  
  const orgMemberProps: OrgMember = {
    id: "2",
    organization_id: "3",
    user: {
      id: "1",
      name: "ghazal",
      email: "ghazalalabe13@gmail.com",
    },
    role: "admin",
  };
  const orgMemberProps2: OrgMember = {
    id: "2",
    organization_id: "4",
    user: {
      id: "1",
      name: "jhjhj",
      email: "ghazalalabe13@gmail.com",
    },
    role: "admin",
  };
  const orgMemberProps3: OrgMember = {
    id: "2",
    organization_id: "6",
    user: {
      id: "1",
      name: "oooo",
      email: "ghazalalabe13@gmail.com",
    },
    role: "admin",
  };

  return (
    <div className="w-full min-w-75 bg-gray-100 h-screen rounded-xl mt-4 p-2">
      <h1 className="font-bold text-lg">Existing Members</h1>

      <MemberItem member={orgMemberProps} />
      <MemberItem member={orgMemberProps2} />
      <MemberItem member={orgMemberProps3} />
    </div>
  );
};

export default WorkspaceMember;
