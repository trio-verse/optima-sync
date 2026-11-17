import React from "react";
import { User, MoreVertical, Edit2 } from "lucide-react";
import { MemberItem } from "@/components/workspace/MemberItem";
import { OrgMember } from "@/types/organization";
import { MemberList } from "@/components/workspace/MemberList";
import { getMembers } from "@/actions/services/membersAction";
import { getWorkspaceMembers } from "@/actions/workspaceMember";

const WorkspaceMember = async ({ params }) => {
 
  const { OrgId ,id} = await params;
  const res = await getWorkspaceMembers(OrgId,id);
  console.log(OrgId);
  const members = res.data ? res.data : [];
  return (
    <>
      <MemberList members={members} />
    </>
  );
};

export default WorkspaceMember;
