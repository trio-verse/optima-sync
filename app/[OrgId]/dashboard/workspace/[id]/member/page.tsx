import React from "react";
import { User, MoreVertical, Edit2 } from "lucide-react";
import { MemberItem } from "@/components/workspace/MemberItem";
import { OrgMember } from "@/types/organization";
import { MemberList } from "@/components/workspace/MemberList";

const WorkspaceMember = () => {
  
  const initialData: OrgMember[] = [{
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
    organization_id: "4",
    user: {
      id: "1",
      name: "jhjhj",
      email: "ghazalalabe13@gmail.com",
    },
    role: "admin",
  },
{
    id: "5",
    organization_id: "6",
    user: {
      id: "1",
      name: "oooo",
      email: "ghazalalabe13@gmail.com",
    },
    role: "admin",
  },
  {
    id: "7",
    organization_id: "8",
    user: {
      id: "6", 
      name: "oooo",
      email: "ghazalalabe13@gmail.com",
    },
    role: "admin",
  }
  ]
  return (
    <>
      <MemberList members={initialData}/>

    </>
  );
};

export default WorkspaceMember;
