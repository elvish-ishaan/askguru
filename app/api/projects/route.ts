import { authOptions } from "@/lib/authOptions";
import prisma from "@/prisma/dbClient"
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server"
export async function GET() {

    //@ts-expect-error fix types
     const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({
                success: false,
                message: 'user unauthenticated'
            })
        }
    try {
        const projects = await prisma.project.findMany({
            where: {
                //@ts-expect-error fix types
                userId: session.user?.id
            }
        })
        if(!projects || projects.length == 0){
            return NextResponse.json({
                success: false,
                message: "no projects found"
            })
        }
        return NextResponse.json({
            success: true,
            projects
        })
    } catch (error) {
        console.log(error,'getting error in projects route')
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        })
    }
}