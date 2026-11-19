"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceScema, ZWorkspace } from "@/lib/validations/workspaceScema";
import { WorkSpace } from "@/types/workspaceTypes";
import { createWorkspace, updateWorkspace } from "@/actions/workspaceActions";
import useWorkspaceStore from "@/hooks/useWorkspaceStore";
interface WorkSpaceFormProps {
  initialData?: WorkSpace;
  OrgId: string;
  onSuccessClose?: () => void;
}
const WorkspaceForm = ({
  initialData,
  OrgId,
  onSuccessClose,
}: WorkSpaceFormProps) => {
  console.log(initialData);
  const isEditMode = initialData ? true : false;
  const { addWorkspace, isAdding, updateWorkspace, isUpdate, updateError } =
    useWorkspaceStore(OrgId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZWorkspace>({
    resolver: zodResolver(workspaceScema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      deadline: 
        new Date(initialData.deadline).toISOString().split("T")[0] ?? "",
    },
  });

  const onSuccess = async (data: ZWorkspace) => {
    let result;

    if (isEditMode && initialData) {
      updateWorkspace({ ...initialData, ...data });
    } else {
      console.log("create workspace", data);
      addWorkspace(data);
    }
    onSuccessClose();
  };

  return (
    <div className="w-full p-2">
      <form
        onSubmit={handleSubmit(onSuccess)}
        className="flex flex-col w-full space-y-3"
      >
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-1">
            Title:
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="e.g. employee task"
            className={`w-full border p-2.5 rounded-xl text-base focus:outline-none bg-white 
            `}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Additional internal notes..."
            className={`w-full border p-2.5 rounded-xl text-base focus:outline-none bg-white resize-none`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-1">
            Due Date
          </label>
          <input
            {...register("deadline")}
            type="date"
            className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-base outline-none focus:border-blue-500"
          />
          {errors.deadline && (
            <p className="text-red-500 text-xs mt-1">
              {errors.deadline.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="w-full rounded-xl bg-blue-600 text-white p-2.5 font-semibold disabled:opacity-50"
        >
          {isAdding
            ? "Saving..."
            : isEditMode
              ? "Update Workspace"
              : "Create Workspace"}
        </button>
      </form>
    </div>
  );
};

export default WorkspaceForm;
