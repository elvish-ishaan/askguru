"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Example interface you mentioned
interface Project {
  id: string;
  title: string;
  sourceUrl: string;
  excludePaths: string;
  allowedOrigin: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectPage() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        console.log(data, "getting project data");
        if (!data.success) {
          return;
        }
        setProject(data?.project);
      } catch (error) {
        console.log(error, "error in fetching porject-id data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--foreground)]">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--foreground)]">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-3xl border bg-[var(--card)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{project?.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Source URL:</p>
            <a
              href={project?.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline"
            >
              {project?.sourceUrl}
            </a>
          </div>

          <div>
            <p className="font-semibold">Exclude Paths:</p>
            <p>{project?.excludePaths || "None"}</p>
          </div>

          <div>
            <p className="font-semibold">Allowed Origin:</p>
            <p>{project?.allowedOrigin || "Not specified"}</p>
          </div>

          <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
            <span>
              Updated: {new Date(project?.created_at).toLocaleString()}
            </span>
            <span>
              Updated: {new Date(project?.updated_at).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
