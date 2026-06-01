"use client"

import { fetchUsageData } from "@/app/actions/usage"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, AlertTriangle, MessageSquare, GitBranch, Cpu } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Usage {
  id: string
  projectId: string
  totalApiCalls: number
  errorCalls: number
  totalTokensUsed: number
  totalMessages: number
  totalThreads: number
}

export default function UsageStats() {
  const { id: paramsProjectId } = useParams()
  const [usage, setUsage] = useState<Usage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        if(!paramsProjectId) return
        const data = await fetchUsageData(paramsProjectId as string)
        if (!data) {
          setError("Unable to fetch usage")
        }
        setUsage(data)
      } catch (err) {
        console.log(err, "err in fetching usage")
        setError("Error fetching usage")
      } finally {
        setLoading(false)
      }
    }
    fetchUsage()
  }, [paramsProjectId])

  const statCards = [
    {
      title: "API Calls",
      value: usage?.totalApiCalls ?? 0,
      icon: <BarChart3 className="h-5 w-5 text-[var(--primary)]" />,
    },
    {
      title: "Error Calls",
      value: usage?.errorCalls ?? 0,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Tokens Used",
      value: usage?.totalTokensUsed?.toLocaleString() ?? "0",
      icon: <Cpu className="h-5 w-5 text-[var(--primary)]" />,
    },
    {
      title: "Messages",
      value: usage?.totalMessages ?? 0,
      icon: <MessageSquare className="h-5 w-5 text-[var(--primary)]" />,
    },
    {
      title: "Threads",
      value: usage?.totalThreads ?? 0,
      icon: <GitBranch className="h-5 w-5 text-[var(--primary)]" />,
    },
  ]

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-medium mb-8">Usage</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, idx) => (
            <Card
              key={idx}
              className="bg-[var(--card)] border border-[var(--border)] shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20 rounded-md bg-accent" />
                ) : (
                  <p className="text-2xl font-bold">{card.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
