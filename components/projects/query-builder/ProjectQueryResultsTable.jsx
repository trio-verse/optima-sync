"use client";

import React from "react";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";

export default function ProjectQueryResultsTable({ projects, meta, onPageChange, isLoading }) {
  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Loading query results...</div>;
  }

  const projectList = projects || [];
//   console.log("ProjectQueryResultsTable - projects:", projectList.title);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900">Query Results ({meta?.total || projectList.length})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-zinc-600">
          <thead className="bg-zinc-50/80 text-xs text-zinc-500 font-medium uppercase border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left">Project Name</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Total Amount</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {projectList.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-zinc-400">
                  No projects match your query filters.
                </td>
              </tr>
            ) : (
              projectList.map((project) => (
                <tr key={project.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-900 flex items-center gap-2">
                    <Folder className="w-4 h-4 text-blue-500" />
                    {project.title || project.name}
                  </td>
                  <td className="px-4 py-3 text-left">{project.client?.name || "N/A"}</td>
                  <td className="px-4 py-3 text-left">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-semibold text-zinc-900">
                    ${project.total_amount?.toLocaleString() || "0"}
                  </td>
                  <td className="px-4 py-3 text-left text-right">
                    <Link
                      href={`./projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}