"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ArrowRight, FolderIcon } from "lucide-react";

export default function Home() {
  const { data: projects, isLoading } = api.project.getMany.useQuery();

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      {/* Hero Section */}
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>

        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Turn your idea into reality
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create anything, just with a simple prompt
        </p>

      </section>

      {/* Projects Section */}
      <section className="space-y-6 pb-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Your Projects</h2>
          <p className="text-muted-foreground">
            Continue working on your previous projects or create something new
          </p>
        </div>

        {isLoading ? (
          <ProjectsLoadingSkeleton />
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/project/${project.id}`}>
      <Card className="group hover:border-primary/30 transition-all cursor-pointer">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Image src="/logo.svg" alt="logo" width={20} height={20} />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs font-medium text-muted-foreground">
              Open project
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProjectsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
        <FolderIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No projects yet</h3>
      <p className="text-muted-foreground">
        Create your first project by describing your app idea above!
      </p>
    </div>
  );
}
