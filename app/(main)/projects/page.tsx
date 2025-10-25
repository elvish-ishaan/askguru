"use client";

import { Plus, Folder, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface Project {
  id: string;
  title: string;
  userId: string;
  sourceUrl: string;
  allowedOrigin: string;
  excludePaths: string[];
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", { method: "GET" });
        const data = await res.json();
        if (!data.success) return;
        setProjects(data?.projects);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] px-6 py-10">
      {/* Header */}
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <h1 className="text-3xl font-medium text-primary">Projects</h1>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 px-4 py-2 rounded-md">
                <Plus className="h-4 w-4" />
                New
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-[var(--card)] text-[var(--foreground)] rounded-md shadow-lg border border-white/10 p-2 w-48">
                <div className="flex flex-col space-y-2">
                  <NavigationMenuLink asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-sm hover:bg-white/10"
                      onClick={() => router.push("/projects/new")}
                    >
                      Create New Project
                    </Button>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-sm hover:bg-white/10"
                      onClick={() =>
                        (window.location.href =
                          "https://github.com/apps/askguru-ai/installations/new")
                      }
                    >
                      Add Repositories
                    </Button>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Projects Grid */}
      <div className="mx-auto mt-10 max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Skeleton Grid
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[var(--card)] border shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="bg-[var(--card)] border shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-[var(--primary)]" />
                  <CardTitle className="text-lg font-semibold">{project?.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {project?.created_at.toString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => router.push(`/projects/${project?.id}/general`)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No projects found. Create your first project!
          </p>
        )}
      </div>
    </div>
  );
}
