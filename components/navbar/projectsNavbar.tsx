"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Project = {
  id: string
  title: string
  sourceUrl: string
  excludePaths: string[]
  allowedOrigin: string
  created_at: string
  updated_at: string
}

export default function ProjectsNavbar() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects")
        const data = await res.json()
        setProjects(data.projects || [])
        if (data.projects?.length) {
          setSelectedId(data.projects[0].id)
          router.push(`/projects/${data.projects[0].id}/general`)
        }
      } catch (err) {
        console.error("Failed to fetch projects", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [router])

  useEffect(() => {
    if (selectedId) {
      router.push(`/projects/${selectedId}/general`)
    }
  }, [selectedId, router])

  if (loading) {
    return (
      <div className="w-full px-4 py-2 border-b flex items-center gap-2">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-48 rounded" />
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="w-full px-4 py-2 border-b text-gray-500">
        No projects found
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-2 border-b flex items-center gap-4">
      <span className="font-semibold text-[var(--foreground)]">Select Project:</span>
      <Select value={selectedId || ""} onValueChange={(val) => setSelectedId(val)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
