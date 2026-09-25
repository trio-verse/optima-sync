"use server";

import { apiFetch } from "@/lib/api/client";

/**
 * 1. Fetch available filter fields, sources, operators, and logic operators
 */
export async function getProjectQueryBuilderSchema(orgId) {
  try {
    const response = await apiFetch("/projects/query-builder", {
      method: "GET",
      orgId,
    });
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    console.error("Error fetching project query builder schema:", error);
    return {
      success: false,
      message: error.message || "Failed to load filter schema",
    };
  }
}

/**
 * 2. Save / Apply filters state (if saving active filter preset or registering query state)
 */
export async function applyProjectFilters(orgId, queryPayload) {
  try {
    const response = await apiFetch("/projects/query-builder/apply", {
      method: "POST",
      orgId,
      body: JSON.stringify({ query: queryPayload }),
    });
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    console.error("Error applying project filters:", error);
    return {
      success: false,
      message: error.message || "Failed to apply filters",
    };
  }
}

/**
 * 3. Get filtered projects list & analytics results based on active query
 */
export async function getProjectQueryResults(orgId, queryPayload) {
  try {
    const response = await apiFetch("/projects/query-builder/results", {
      method: "POST",
      orgId,
      body: JSON.stringify({ query: queryPayload }),
    });
    return {
      success: true,
      data: response.data || response,
    };
  } catch (error) {
    console.error("Error fetching filtered project results:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch filter results",
    };
  }
}