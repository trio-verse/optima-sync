// @/actions/mockProjectActions.js
"use server";

const MOCK_PROJECTS = [{
        id: "proj-101",
        title: "E-Commerce Mobile Application",
        clientName: "Apex Logistics Corp",
        clientEmail: "contact@apexlogistics.com",
        status: "in_progress",
        budget: "$12,500",
        deadline: "2026-11-15",
        submittedAt: "2026-08-28",
        attachmentsCount: 3,
        description: "Full-stack mobile app development for logistics tracking.",
    },
    {
        id: "proj-102",
        title: "Enterprise ERP Dashboard Redesign",
        clientName: " Tech Solutions",
        clientEmail: "trioverse@techsolutions.com",
        status: "pending",
        budget: "$8,000",
        deadline: "2026-10-30",
        submittedAt: "2026-09-01",
        attachmentsCount: 1,
        description: "UI/UX refresh with Next.js, Tailwind CSS, and React Query.",
    },
];

export async function getCompanyProjectsMock() {
    await new Promise((resolve) => setTimeout(resolve, 600)); // محاكاة تأخير الشبكة
    return {
        success: true,
        data: MOCK_PROJECTS
    };
}

export async function generateIntakeTokenMock() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
        success: true,
        token: "mock_token_9f8a3b7c2e1d"
    };
}