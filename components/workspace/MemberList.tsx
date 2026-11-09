"use client";
import React from "react";
import { OrgMember } from "@/types/organization";
import MemberItem from "./MemberItem";
import MemberForm from "./MemberForm";
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
interface MemberListProps {
  members: OrgMember[];
}
export const MemberList = ({ members: initialMembers }: MemberListProps) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<OrgMember[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<OrgMember | null>(null);
  const handleAddMember = () => {
    setSelectedMember(null);
    setIsMemberModalOpen(true);
  };
  const handleOpenDeleteModal = (member: OrgMember) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      setMembers((prevMembers) =>
        prevMembers.filter((m) => m.id !== memberToDelete.id),
      );
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };
  const handleFormSubmit = (formData: OrgMember) => {
    const newMember: OrgMember = {
      id: Date.now().toString(),
      organization_id: "1",
      user: {
        id: formData.user.id,
        name: formData.user.name,
        email: formData.user.email,
      },
      role: (formData.role || "employee") as OrgMember["role"],
    };

    console.log(newMember);
    setMembers((prev) => [newMember, ...prev]);
    setIsMemberModalOpen(false);
  };
  return (
    <>
      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-col w-[70%]">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl font-bold capitalize my-2 me-4">
              Workspace title
            </h1>
            {/* <p className="text-gray-900 font-bold text-base ">11-12-2026</p> */}
          </div>

          <p className="text-gray-500 text-sm text-wrap ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum
            cupiditate officia eos veritatis? Facilis libero soluta dolore a,
            iusto asperiores suscipit incidunt, repellendus aliquid magnam sit
            voluptatem illo recusandae quaerat?
          </p>
        </div>

        <button
          onClick={handleAddMember}
          className="bg-blue-500 text-white px-5 py-2 rounded-md text-base hover:bg-blue-600"
        >
          Add Member
        </button>
      </div>
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <MemberForm
                members={members}
                initialData={selectedMember}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-xl mt-4 p-2">
        <h1 className="font-bold text-lg mb-2">Existing Members</h1>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Member
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {memberToDelete?.user.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {members.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            handleDelete={() => handleOpenDeleteModal(member)}
          />
        ))}
      </div>
    </>
  );
};
