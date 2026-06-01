"use server"

import { authOptions } from "@/lib/authOptions"
import prisma from "@/prisma/dbClient"
import { getServerSession } from "next-auth/next"

export const userUsage = async () => {
  //@ts-expect-error fix next-auth types if needed
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("User unauthenticated")
  }

  try {
    const userData = await prisma.user.findFirst({
      where: {
        email: session.user?.email || "",
      },
      select: {
        projects: {
          select: {
            id: true,
            title: true,
            usage: true,
          },
        },
      },
    })

    // ✅ If no projects, return fully typed empty structure
    if (!userData || userData.projects.length === 0) {
      return {
        totalApiCalls: 0,
        errorCalls: 0,
        totalTokensUsed: 0,
        totalMessages: 0,
        totalThreads: 0,
        projects: [] as {
          id: string
          title: string
          totalApiCalls: number
          errorCalls: number
          totalTokensUsed: number
          totalMessages: number
          totalThreads: number
        }[],
      }
    }

    // ✅ Define exact return type (matches your frontend)
    type AggregatedUsage = {
      totalApiCalls: number
      errorCalls: number
      totalTokensUsed: number
      totalMessages: number
      totalThreads: number
      projects: {
        id: string
        title: string
        totalApiCalls: number
        errorCalls: number
        totalTokensUsed: number
        totalMessages: number
        totalThreads: number
      }[]
    }

    const aggregated = userData.projects.reduce<AggregatedUsage>(
      (acc, project) => {
        const usage = project.usage

        acc.projects.push({
          id: project.id,
          title: project.title,
          totalApiCalls: usage?.totalApiCalls ?? 0,
          errorCalls: usage?.errorCalls ?? 0,
          totalTokensUsed: usage?.totalTokensUsed ?? 0,
          totalMessages: usage?.totalMessages ?? 0,
          totalThreads: usage?.totalThreads ?? 0,
        })

        acc.totalApiCalls += usage?.totalApiCalls ?? 0
        acc.errorCalls += usage?.errorCalls ?? 0
        acc.totalTokensUsed += usage?.totalTokensUsed ?? 0
        acc.totalMessages += usage?.totalMessages ?? 0
        acc.totalThreads += usage?.totalThreads ?? 0

        return acc
      },
      {
        totalApiCalls: 0,
        errorCalls: 0,
        totalTokensUsed: 0,
        totalMessages: 0,
        totalThreads: 0,
        projects: [],
      }
    )

    return aggregated
  } catch (error) {
    console.log(error, "error in fetching user-usage in action")
    return null
  }
}
