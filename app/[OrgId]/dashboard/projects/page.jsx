import ProjectsTable from "@/components/projects/ProjectTableRow";
import { use } from "react";
export default async function ProjectsPage({ params }) {
    const resolvedParams = await params;
    const orgId = resolvedParams?.OrgId;

    return <ProjectsTable orgId={orgId} />;
}