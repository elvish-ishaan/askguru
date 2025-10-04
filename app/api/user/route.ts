import prisma from "@/prisma/dbClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {userId, name, email, password} = await req.json()
    // if(!userId){
    //     return NextResponse.json({
    //         success: false,
    //         message: "user id not found"
    //     })
    // }
    try {
        if(userId){
            const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if(user){
            //remove password
            user.password = null;
            return NextResponse.json({
                success: true,
                message: "user already present",
                user
            })
        }
        }

        //if user is created through credentials
        if(password){
            //if not then create one
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email,
                    password
                }
            })
            //remove the password
            newUser.password = null;
            return NextResponse.json({
                success: true,
                message: "user created by credentails",
                user: newUser
            })
        }
        //if not then create one
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                name: name,
                email
            }
        })
        return NextResponse.json({
            success: true,
            message: "user created",
            user: newUser
        })
    } catch (error) {
        console.log(error,'error in user route')
        return NextResponse.json({
            success: false,
            message: "internal server error"
        })
    }
}