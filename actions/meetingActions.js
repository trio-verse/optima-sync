"use server";
import { api } from "@/lib/api/client";
import { cookies } from "next/headers";


export async function getProjectMeetings(projectId, orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };
    if (!orgId) return { success: false, message: "Organization ID is missing." };

    try {
        const response = await api.get(`projects/${projectId}/meetings`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": orgId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching project meetings:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function createProjectMeeting(projectId, orgId, meetingData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };
    if (!orgId) return { success: false, message: "Organization ID is missing." };

    try {
        const response = await api.post(
            `projects/${projectId}/meetings`,
            {
                title: meetingData.title,
                description: meetingData.description || "",
                meeting_date: meetingData.meeting_date, // متوقع بصيغة ISO أو Date String
                meeting_url: meetingData.meeting_url || "",
                stakeholders: meetingData.stakeholders || [],
                team_members: meetingData.team_members || [],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating project meeting:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function updateProjectMeeting(projectId, meetingId, orgId, meetingData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };
    if (!orgId) return { success: false, message: "Organization ID is missing." };

    try {
        const response = await api.patch(
            `projects/${projectId}/meetings/${meetingId}`,
            {
                title: meetingData.title,
                description: meetingData.description || "",
                meeting_date: meetingData.meeting_date,
                meeting_url: meetingData.meeting_url || "",
                stakeholders: meetingData.stakeholders || [],
                team_members: meetingData.team_members || [],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Organization-Id": orgId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating project meeting:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}


export async function deleteProjectMeeting(projectId, meetingId, orgId) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, message: "Unauthorized" };
    if (!orgId) return { success: false, message: "Organization ID is missing." };

    try {
        const response = await api.delete(`projects/${projectId}/meetings/${meetingId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Organization-Id": orgId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting project meeting:", error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
}