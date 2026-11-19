"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { use, useEffect } from "react";
import { useState } from "react";
import MembersPage from "../../member/page";
import MemberForm from "@/components/workspace/MemberForm";
import { X } from "lucide-react";
const TabbedworkSpsce = ({ children, params }) => {
  const Pathname = usePathname();
  const [activeTab, setActiveTabe] = useState("tasks");

  const resolveId: any = params ? use(params) : null;
  const orgId = resolveId?.OrgId;
  const id = resolveId?.id;
  console.log(id, orgId);
  const router = useRouter();
  useEffect(() => {
    if (Pathname.includes("/tasks")) {
      setActiveTabe("tasks");
    } else if (Pathname.includes("/member")) {
      setActiveTabe("member");
    }
  }, [Pathname]);

  
  return (
    <div>

      <div className="flex flex-row  bg-gray-300 rounded-2xl mx-auto w-50 items-center justify-center">
        <Link
          href={`/${orgId}/dashboard/workspace/${id}/tasks`}
          className={`p-2 w-30 border-r border-black text-center rounded-s-2xl ${
            activeTab === "tasks" ? "bg-blue-900 text-white shadow-sm" : ""
          }`}
        >
          <p>Tasks</p>
        </Link>

        <Link
          href={`/${orgId}/dashboard/workspace/${id}/member`}
          className={`p-2 w-30 text-center rounded-e-2xl ${
            activeTab === "member" ? "bg-blue-900 text-white shadow-sm" : ""
          }`}
        >
          <p>Members</p>
        </Link>
      </div>




      {children}
    </div>
  );
};

export default TabbedworkSpsce;
