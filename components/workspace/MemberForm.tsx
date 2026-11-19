"use client";
import React, { useState, useEffect } from "react";
import { OrgMember } from "@/types";
import useOrgMemberStore from "@/hooks/useOrgMemberStore";
import Select from "../ui/Select";
interface MemberFormProps {
  orgId: string;
  initialData?: OrgMember | null;
  onSubmit?: (member: OrgMember) => void;
}
const MemberForm = ({ onSubmit, orgId }: MemberFormProps) => {
  const { orgMembers } = useOrgMemberStore(orgId);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit && selectedMemberId) {
      console.log(selectedMemberId);

      const selected = orgMembers.find((value) => {
        return Number(value.id) === Number(selectedMemberId);
      });
      console.log(selected);
      onSubmit(selected);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 mt-4">
        Add New Member
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          choose member :
        </label>

        <Select
          selectedValue={selectedMemberId}
          onChange={(value) => {
            setSelectedMemberId(value);
          }}
          options={
            orgMembers && orgMembers.length > 0
              ? orgMembers.map((member) => ({
                  key: member.id,
                  value: member.user?.name,
                }))
              : []
          }
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition mt-4"
        >
          Add Member
        </button>
      </form>
    </div>
  );
};

export default MemberForm;
