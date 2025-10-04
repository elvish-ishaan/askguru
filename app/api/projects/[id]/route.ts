import prisma from "@/prisma/dbClient"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
 try {
    const projectId = req.url.split('/')[5]
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    })
    if(!project){
        return NextResponse.json({
            success: false,
            message: 'no project found'
        })
    }
    return NextResponse.json({
        success: true,
        message: 'project fetched',
        project
    })
 } catch (error) {
    console.log(error,'error in project-id route')
    return NextResponse.json({
        success: false,
        message: 'internal server error'
    })
 }
}
