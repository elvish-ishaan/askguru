import prisma from "@/prisma/dbClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        //get the projectid
        const { projectId } = await req.json()
        try {
            const apiKey = await prisma.apiKey.create({
                data: {
                    projectId,
                    secret: "99s8dfs8fa98fdsa98ufs8d8uasf9d8u"
                }
            })
            //return res
            return NextResponse.json({
                success: true,
                message: 'api key generated',
                apiKey
            })
        } catch (error) {
            console.log(error,'error in creating api key for project')
        }
    } catch (error) {
        console.log(error,'getting error in apikey-route')
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        })
    }
}