"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    sourceUrl: "",
    allowedOrigin: "",
  })
  const [excludePaths, setExcludePaths] = useState< string[] | []>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleExcludePathsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value  // "/api, /private"
    //split the value on comma based
    const splittedValues = value.split(",")    // ["/api", "/private"]
    //set the state 
    const trimmedValues = splittedValues.map(x => x.trim()) //trim the whitespce
    setExcludePaths(trimmedValues)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/projects/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData, excludePaths}),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.message || "Failed to create project")
      }

      // Project created successfully
      router.push("/projects")
    } catch (err) {
      console.error("Error creating project:", err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-2xl border bg-[var(--card)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className="bg-[var(--background)] text-[var(--foreground)]"
                required
              />
            </div>

            {/* Source URL */}
            <div className="grid gap-2">
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="bg-[var(--background)] text-[var(--foreground)]"
                required
              />
            </div>

            {/* Exclude Paths */}
            <div className="grid gap-2">
              <Label htmlFor="excludePaths">Exclude Paths</Label>
              <Input
                id="excludePaths"
                name="excludePaths"
                
                onChange={handleExcludePathsChange}
                placeholder="/admin, /private"
                className="bg-[var(--background)] text-[var(--foreground)]"
              />
            </div>

            {/* Allowed Origin */}
            <div className="grid gap-2">
              <Label htmlFor="allowedOrigin">Allowed Origin</Label>
              <Input
                id="allowedOrigin"
                name="allowedOrigin"
                value={formData.allowedOrigin}
                onChange={handleChange}
                placeholder="https://yourapp.com"
                className="bg-[var(--background)] text-[var(--foreground)]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-[var(--destructive)]">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-4 mt-5">
            <Button
              type="button"
              variant="outline"
              className="border-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              onClick={() => router.push("/projects")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
