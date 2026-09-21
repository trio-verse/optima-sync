
import ProjectIntakeForm from "@/components/projects/ProjectIntakeForm";
export default async function RequestProjectPage({ params }) {
const { reqId } = await params; 
    return <ProjectIntakeForm token={reqId} />;
}