import { authOptions } from "@/lib/authOptions"
import prisma from "@/prisma/dbClient";
import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import crypto from 'crypto';


export async function GET(req: NextRequest) {
    //@ts-expect-error fix later types
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            success: false,
            message: 'user unauthenticated'
        })
    }
    const projectId = req.url.split('/')[5]
    try {
        //get the apikey from
        const apikeys = await prisma.apiKey.findMany({
            where: {
              projectId: projectId
            }
        });
        console.log(apikeys,'getting api key................')
        if(!apikeys){
            return NextResponse.json({
                success: false,
                message: 'no api keys found'
            })
        }
        return NextResponse.json({
            success: true,
            apikeys
        })
    } catch (error) {
        console.log(error,'getting error in apikey-route')
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export async function POST(req: NextRequest) {
    try {
        //get the projectid
        const { projectId } = await req.json()
        try {
            const apiKey = await prisma.apiKey.create({
                data: {
                    projectId,
                    secret: crypto.randomBytes(32).toString('hex')
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