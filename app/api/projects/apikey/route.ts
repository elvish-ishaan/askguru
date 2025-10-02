import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        //get the apikey from
    } catch (error) {
        console.log(error,'getting error in apikey-route')
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        })
    }
}