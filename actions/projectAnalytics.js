"use server";

import { api } from "@/lib/api/client";
import ProjectQueryBuilderDTO from "@/lib/dto/ProjectQueryBuilderDTO";
/**
 * جلب هيكلية الفلاتر والاستعلامات الخاصة بالمشاريع (Query Builder Structure)
 * Endpoint: GET api/v1/project/query-builder
 * s
 * @param {string|number} orgId - معرف المنظمة الحالية
 * @returns {Promise<{success: boolean, data?: object, message?: string, errors?: object}>}
 */
export async function getProjectQueryBuilderStructure(orgId) {
  try {
    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is required",
      };
    }

    const response = await api.get("/projects/query-builder", {
      headers: {
        "X-Organization-ID": orgId,
      },
    });
    const innerData = response?.data?.data || response?.data || {};
    console.log("Project Query Builder Structure Response:", response);

    // Backend response → UI DTO
    const data = new ProjectQueryBuilderDTO(innerData);
     console.log(
      "Project Query Builder DTO:",
      data
    );

    return {
      success: response?.data?.success ?? true,
       data: data.toObject(),
      message: response.data.message || "Query structure retrieved successfully",
     
    };
  } catch (error) {
    console.error("Error fetching project query builder structure:", error);
    return {
     success: false, data: null, fields: [], logicOperators: [],  
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch project query builder structure",
    };
  }
  
}

/**
 * تنفيذ الاستعلام الفعلي المخصص للمشاريع بناءً على الشروط (Execute Projects Query)
 * Endpoint: POST api/v1/projects/query
 * 
 * @param {string|number} orgId - معرف المنظمة
 * @param {object} queryPayload - كائن الشروط والمنطق، مثل: { query: { logic: "and", conditions: [...] } }
 * @returns {Promise<{success: boolean, data?: object, message?: string, errors?: object}>}
 */
export async function executeProjectQuery(orgId, queryPayload) {
  try {
    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is required",
      };
    }

    const response = await api.post("/projects/query", queryPayload, {
      headers: {
        "X-Organization-ID": orgId,
      },
    });
    console.log("Execute Project Query Response:**************", response);
    return {
      success: true,
      message: response.message || "Projects query executed successfully",
      data: response.data || null,
    };
  } catch (error) {
    console.error("Error executing project query:", error);
    return {
      success: false,
      message: error.message || "Failed to execute projects query",
      errors: error.data || null,
    };
  }
}

/**
 * جلب التحليلات والإحصائيات الخاصة بالمشاريع (Project Analytics)
 * Endpoint: POST api/v1/projects/analytics
 * 
 * @param {string|number} orgId - معرف المنظمة
 * @param {object} [payload={}] - الفلاتر أو الشروط الاختيارية لتصفية الإحصائيات
 * @returns {Promise<{success: boolean, data?: object, message?: string, errors?: object}>}
 */
export async function getProjectAnalytics(orgId, payload = {}) {
  try {
    if (!orgId) {
      return {
        success: false,
        message: "Organization ID is required",
      };
    }

    const response = await api.post("/projects/analytics", payload, {
      headers: {
        "X-Organization-ID": orgId,
      },
    });
    console.log("Project Analytics Response:&&&&&&&&&&&&", response);
     return {
      success: response?.data?.success ?? true,
      message:
        response?.data?.message ||
        "Analytics generated successfully",
      data: response?.data?.data || null,
    };
  } catch (error) {
    console.error(
      "Error generating project analytics:",
      error
    );

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to generate project analytics",
      errors: error?.response?.data?.errors || null,
    };
  }
}