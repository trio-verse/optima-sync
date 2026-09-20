// @/actions/projectDetailsActions.js
"use server";

// بيانات الموظفين/الأعضاء في المنظمة
const MOCK_ORGANIZATION_MEMBERS = [{
        id: "mem-1",
        name: "mohamed Admin",
        email: "mohamed@trioverse.com",
        role: "Frontend Developer",
        defaultRatePerPoint: 25
    },
    {
        id: "mem-2",
        name: "Sara Ahmad",
        email: "sara@trioverse.com",
        role: "UI/UX Designer",
        defaultRatePerPoint: 20
    },
    {
        id: "mem-3",
        name: "Karem Omar",
        email: "karem@trioverse.com",
        role: "Backend Developer",
        defaultRatePerPoint: 30
    },
    {
        id: "mem-4",
        name: "Lina Hassan",
        email: "lina@trioverse.com",
        role: "QA Engineer",
        defaultRatePerPoint: 18
    },
];

// بيانات مشروع افتراضية مع التفاصيل
const MOCK_PROJECT_DETAILS = {
    id: "proj-101",
    title: "E-Commerce Mobile Application",
    description: "Full-stack mobile app development for logistics tracking, order management, and payment integration.",
    status: "in_progress",
    clientName: "Apex Logistics Corp",
    clientEmail: "contact@apexlogistics.com",
    budget: "$12,500",
    startDate: "2026-08-01",
    deadline: "2026-11-15",

    // 2- Features
    features: [{
            id: "ft-1",
            title: "Real-time Order Tracking",
            description: "GPS integration to monitor active drivers on live map.",
            status: "completed"
        },
        {
            id: "ft-2",
            title: "Stripe & Local Webhook Payment",
            description: "Secure credit card and regional gateway checkout.",
            status: "in_progress"
        },
        {
            id: "ft-3",
            title: "Push Notifications",
            description: "Instant alerts for order status changes and promos.",
            status: "pending"
        }
    ],

    // 3- The Team
    team: [{
            id: "tm-1",
            memberId: "mem-1",
            name: "mohamed Admin",
            role: "Frontend Developer",
            points: 40,
            ratePerPoint: 25,
            totalCost: 1000
        },
        {
            id: "tm-2",
            memberId: "mem-2",
            name: "Sara Ahmad",
            role: "UI/UX Designer",
            points: 20,
            ratePerPoint: 20,
            totalCost: 400
        }
    ],

    // 4- Costs / Expenses
    expenses: [{
            id: "exp-1",
            category: "Infrastructure",
            description: "AWS Cloud Hosting & Database",
            amount: 150,
            isRecurring: true,
            date: "2026-08-05"
        },
        {
            id: "exp-2",
            category: "Licenses",
            description: "Third-party Map API Subscription",
            amount: 80,
            isRecurring: true,
            date: "2026-08-10"
        },
        {
            id: "exp-3",
            category: "Design",
            description: "Stock Asset & Icon Pack",
            amount: 45,
            isRecurring: false,
            date: "2026-08-02"
        }
    ]
};

export async function getProjectDetails(projectId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
        success: true,
        data: {
            ...MOCK_PROJECT_DETAILS,
            id: projectId
        }
    };
}

export async function getOrganizationMembers() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
        success: true,
        data: MOCK_ORGANIZATION_MEMBERS
    };
}