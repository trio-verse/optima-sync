import EmployeeView from "@/components/workspace/EmployeeView";

export default async function WorkspacePage({ params }) {
	const resolvedParams = await params;
	return <EmployeeView orgId={resolvedParams?.OrgId} />;
}
