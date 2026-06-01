"use client"

import { userUsage } from "@/app/actions/usage/user-usage.ts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, AlertTriangle, MessageSquare, GitBranch, Cpu } from "lucide-react"
import { useEffect, useState } from "react"

interface ProjectUsage {
  id: string
  title: string
  totalApiCalls: number
  errorCalls: number
  totalTokensUsed: number
  totalMessages: number
  totalThreads: number
}

interface UsageData {
  totalApiCalls: number
  errorCalls: number
  totalTokensUsed: number
  totalMessages: number
  totalThreads: number
  projects: ProjectUsage[]
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const usage = await userUsage()
        setData(usage)
      } catch (err) {
        console.error("Error loading usage data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const usage = data

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold tracking-tight mb-8">Usage Overview</h1>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => <StatCardSkeleton key={idx} />)
          ) : (
            <>
              <StatCard 
                title="Total API Calls" 
                value={usage?.totalApiCalls || 0} 
                icon={<BarChart3 className="h-5 w-5 text-[var(--primary)]" />} 
              />
              <StatCard 
                title="Error Calls" 
                value={usage?.errorCalls || 0} 
                icon={<AlertTriangle className="h-5 w-5 text-red-500" />} 
              />
              <StatCard 
                title="Total Tokens Used" 
                value={usage?.totalTokensUsed || 0} 
                icon={<Cpu className="h-5 w-5 text-[var(--primary)]" />} 
              />
              <StatCard 
                title="Total Messages" 
                value={usage?.totalMessages || 0} 
                icon={<MessageSquare className="h-5 w-5 text-[var(--primary)]" />} 
              />
              <StatCard 
                title="Total Threads" 
                value={usage?.totalThreads || 0} 
                icon={<GitBranch className="h-5 w-5 text-[var(--primary)]" />} 
              />
            </>
          )}
        </div>

        {/* Project Breakdown */}
        <h2 className="text-2xl font-semibold mb-4">Per Project Usage</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <ProjectSkeletonCard key={idx} />
              ))
            : usage?.projects?.map((project) => (
                <Card key={project?.id} className="bg-[var(--card)] border border-[var(--border)] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <UsageRow label="API Calls" value={project?.totalApiCalls} />
                    <UsageRow label="Error Calls" value={project?.errorCalls} />
                    <UsageRow label="Tokens Used" value={project?.totalTokensUsed} />
                    <UsageRow label="Messages" value={project?.totalMessages} />
                    <UsageRow label="Threads" value={project?.totalThreads} />
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="bg-[var(--card)] border border-[var(--border)] shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value ?? "-"}</p>
      </CardContent>
    </Card>
  )
}


function UsageRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="bg-[var(--card)] border border-[var(--border)] shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  )
}

function ProjectSkeletonCard() {
  return (
    <Card className="bg-[var(--card)] border border-[var(--border)] shadow-sm">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
