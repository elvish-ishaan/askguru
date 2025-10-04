"use client"

import { Plus, Folder, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Project {
  id: string; // UUID format
  title: string;
  userId: string; // Numeric string, likely a unique identifier
  sourceUrl: string; // URL format
  allowedOrigin: string; // URL format
  excludePaths: string[]; // Array of path strings
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | []>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', {
          method: "GET"
        })
        const data = await res.json()
        console.log(data, 'getting projects.......')
        if(!data.success){
          return
        }
        setProjects(data?.projects)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] px-6 py-10">
      {/* Header */}
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button className="flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90">
          <Plus className="h-4 w-4" />
          Create New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="mx-auto mt-10 max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="bg-[var(--card)] border shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-[var(--primary)]" />
                <CardTitle className="text-lg font-semibold">{project?.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">{project?.created_at}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/projects/${project?.id}`)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
