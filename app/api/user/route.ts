import prisma from "@/prisma/dbClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {userId, name, email, password} = await req.json()
    console.log(password,'getting password......')
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
            //check user with correct password
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: email
                }
            })
            if(!existingUser){
              //if not then create one
              const newUser = await prisma.user.create({
                data: {
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
            //compare the password
            if(password !== existingUser.password){
                return NextResponse.json({
                    success: false,
                    message: "invalid password"
                })
            }
            //else return the res
            return NextResponse.json({
                success: true,
                message: "logged in",
                user: existingUser
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