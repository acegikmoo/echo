import { ProjectView } from "@/components/project/project-view";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  return <ProjectView projectId={id} />;
}
