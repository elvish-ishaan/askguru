'use server'

import { authOptions } from "@/lib/authOptions"
import prisma from "@/prisma/dbClient"
import { getServerSession } from "next-auth/next"

export type UsageData = {
  id: string
  projectId: string
  totalApiCalls: number
  errorCalls: number
  totalTokensUsed: number
  totalMessages: number
  totalThreads: number
  threads?: {
    id: string
  }[]
}

export async function fetchUsageData(projectId: string): Promise<UsageData | null> {
    console.log(projectId,'getting projectid..........')
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions)
    if(!session){
        throw new Error('user unauthenticated')

    }
  try {
    const usage = await prisma.usage.findFirst({
      where: {
        projectId: projectId
      },
      include: {
        threads: false
      }
    })
    console.log(usage,'getting usage.........')
    if (!usage) {
      return null
    }

    return {
      id: usage.id,
      projectId: usage.projectId,
      totalApiCalls: usage.totalApiCalls,
      errorCalls: usage.errorCalls,
      totalTokensUsed: usage.totalTokensUsed,
      totalMessages: usage.totalMessages,
      totalThreads: usage.totalThreads,
    }
  } catch (error) {
    console.error('Error fetching usage data:', error)
    throw new Error('Failed to fetch usage data')
  }
}
