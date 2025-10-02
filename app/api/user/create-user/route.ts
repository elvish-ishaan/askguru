import prisma from "@/prisma/dbClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { email, name } = await req.json()
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
            }
        })
        return NextResponse.json({
            success: true,
            message: "user created",
            user
        })
    } catch (error) {
        console.log(error,'error in create-user route')
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}