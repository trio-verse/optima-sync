"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { use, useEffect } from "react";
import { useState } from "react";
import MembersPage from "../../member/page";
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
        {activeTab === "tasks" ? (
          <button className="bg-blue-500 text-white px-5 py-2 rounded-md text-base hover:bg-blue-600">
            Add Task
          </button>
        ) : (
          <button className="bg-blue-500 text-white px-5 py-2 rounded-md text-base hover:bg-blue-600">
            Add Member
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default TabbedworkSpsce;
