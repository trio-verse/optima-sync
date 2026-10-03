"use client";
import ProjectsTable from "@/components/projects/ProjectTableRow";
import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getProjectQueryBuilderStructure,
  executeProjectQuery,
  getProjectAnalytics,
} from "@/actions/projectAnalytics";
import {
  serializeQueryPayload,
  parseQueryParamsToRules,
  buildQuerySearchParams,
} from "@/lib/utils/queryBuilderSerializer";

import ProjectQueryBuilder from "@/components/projects/query-builder/ProjectQueryBuilder";
import ProjectAnalyticsDashboard from "@/components/projects/query-builder/ProjectAnalyticsDashboard";
import ProjectQueryResultsTable from "@/components/projects/query-builder/ProjectQueryResultsTable";
 
export default function ProjectsPage({ params }) {
  const resolvedParams = use(params);
  const orgId = resolvedParams.OrgId;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("all_projects"); // "all_projects" | "analytics"

  // Data States
  const [structure, setStructure] = useState(null);
  const [queryResults, setQueryResults] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // Restore rules & logic from URL
  const { rules: initialRules, logic: initialLogic } = parseQueryParamsToRules(searchParams);

  // Load Structure once
  useEffect(() => {
    async function fetchStructure() {
      const res = await getProjectQueryBuilderStructure(orgId);
      if (res.success) {
        setStructure(res.data);
      }
    }
    fetchStructure();
  }, [orgId]);

  // Execute Query
  const handleApplyQuery = async (rules, logic, page = 1) => {
    setIsLoading(true);

    // Update URL Search Params
    const urlParams = buildQuerySearchParams(rules, logic);
    router.push(`?${urlParams.toString()}`, { scroll: false });

    const payload = serializeQueryPayload(rules, logic);

    const [queryRes, analyticsRes] = await Promise.all([
      executeProjectQuery(orgId, payload, page),
      getProjectAnalytics(orgId, payload),
    ]);

    if (queryRes.success) setQueryResults(queryRes.data);
    if (analyticsRes.success) setAnalytics(analyticsRes.data);

    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Projects</h1>
          <p className="text-sm text-zinc-500">Manage and analyze organization projects</p>
        </div>

        {/* Navigation Tabs */}
        <div className="inline-flex p-1 bg-zinc-100 rounded-xl">
          <button
            onClick={() => setActiveTab("all_projects")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "all_projects"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "analytics"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Advanced Query & Analytics
          </button>
        </div>
      </div>
       {/* Tab 1*/}
      {activeTab === "all_projects" && (
        <div>
          <ProjectsTable orgId={orgId} />
        </div>
      )}

      {/* Tab 2*/}
      {activeTab === "analytics" && (
        <div>
          <ProjectQueryBuilder
            structure={structure}
            onApplyQuery={handleApplyQuery}
            initialRules={initialRules}
            initialLogic={initialLogic}
          />

          <ProjectAnalyticsDashboard analytics={analytics} isLoading={isLoading} />

          <ProjectQueryResultsTable
            projects={queryResults?.data}
            meta={queryResults?.meta}
            onPageChange={(page) => handleApplyQuery(initialRules, initialLogic, page)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}