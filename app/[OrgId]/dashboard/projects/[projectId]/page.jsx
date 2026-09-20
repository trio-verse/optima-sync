import { getProjectById } from "@/actions/projectDetailsAction"; // مسار ملف الأكشن الخاص بك
import ProjectDetailsView from "@/components/projects/ProjectDeatails"; // مكون الواجهة الرئيسي (Client Component)

export default async function ProjectDetailsPage({ params}) {
    // 1. استخراج الـ params (في Next.js 15+ يتم استخدام await)
    const {OrgId: orgId, projectId } = await params;

    // 2. جلب البيانات عند تحميل الصفحة على الخادم
    const response = await getProjectById(orgId, projectId);

    // في حال حدوث خطأ أو عدم العثور على البيانات
    if (!response.success) {
        return (
            <div className="p-6 text-red-500">
                <p>حدث خطأ أثناء تحميل البيانات: {response.message}</p>
            </div>
        );
    }

    // 3. تمرير البيانات المجلوبة إلى مكون العرض
    return (
        <ProjectDetailsView 
            initialData={response.data} 
            orgId={orgId} 
            projectId={projectId} 
        />
    );
}