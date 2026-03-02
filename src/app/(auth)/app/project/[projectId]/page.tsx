import { ProjectView } from "@/components/projects/project-view";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import { createQueryClient } from "@/trpc/query-client";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const queryClient = createQueryClient();

  // Prefetch data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [["message", "getMany"], { input: { projectId }, type: "query" }],
      queryFn: () => api.message.getMany({ projectId }),
    }),
    queryClient.prefetchQuery({
      queryKey: [["project", "getOne"], { input: { id: projectId }, type: "query" }],
      queryFn: () => api.project.getOne({ id: projectId }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading project...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
}
