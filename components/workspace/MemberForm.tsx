"use client";
import React, { useState, useEffect } from "react";
import { OrgMember } from "@/types";
interface MemberFormProps {
  members?: OrgMember[];
  initialData?: OrgMember | null;
  onSubmit?: (member: OrgMember) => void;
}
const MemberForm = ({
  members = [],
  onSubmit,

}: MemberFormProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit && selectedMemberId) {
      onSubmit(members.find((value)=>{return value.id===selectedMemberId}));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 mt-4">Add New Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          choose member :
        </label>
        <select
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          required
          className=" w-full bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-500 text-slate-700"
        >
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.user.name} ({member.user.email}) - ({member.role})
            </option>
          ))}
        </select>
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
