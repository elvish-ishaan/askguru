import { model } from "@/lib/core/llm";
import { vectorStore } from "@/lib/core/vectorStore";
import { systemPrompt } from "@/lib/systemPrompt";
import prisma from "@/prisma/dbClient";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    
    try {
        const authorization = req.headers.get("authorization")
        const apiKey = authorization?.split(" ")[1]

        if(!apiKey && typeof(apiKey) == "string"){
            return NextResponse.json({
                success: false,
                message: "api key not found"
            })
        }
        const { query } = await req.json()

        if(!query || query.trim() == '' ){
            return NextResponse.json({
                success: false,
                message: "all params are required"
            })
        }
        //fetch the apikey metadata 
        const apiKeyDetails = await prisma.apiKey.findFirst({
            where: {
                secret: apiKey
            }
        })
        console.log(apiKeyDetails,'getting api key details')
        if(!apiKeyDetails){
            return NextResponse.json({
                success: false,
                message: 'invalid api-key'
            })
        }
        //fetch the project info using projectid
        const project = await prisma.project.findFirst({
            where: {
                id: apiKeyDetails.projectId
            }
        })
        if(!project){
            return NextResponse.json({
                success: false,
                message: 'no project found'
            })
        }

        //check if req is comming from allowedOrigin of project
        const host = req.headers.get('hostname');
        const url = new URL(project.allowedOrigin);
        const  allowedHost = url.hostname
        console.log("host:", host, "allowedHost:",allowedHost)
        // const allowedHostWithPort = url.host
        // if(host !== allowedHost){
        //     return NextResponse.json({
        //         success: false,
        //         message: 'host does not match with allowed origin'
        //     })
        // }

        console.log(project,'sucessfully got project db')
        // Define the filter
        const filter = {
          must: [
            {
              key: "metadata.projectId", // Filter by a metadata field named 'source'
              match: {
                value: project.id, 
              },
            },
          ],
        };
        //use similarity search to fetch similiar data(context)
        const context = await vectorStore.similaritySearch(query, 2, filter)
        console.log(context,'geting context..........')
        //provide most similar data with conversation(if present) to llm
        const generatedLlmRes = await model.invoke(systemPrompt(JSON.stringify(context), query))
        console.log(generatedLlmRes.content as string,'getting generated raw ...........')
        //parce the llm res
        const parcedRes = JSON.parse(generatedLlmRes.content as string)
        console.log(parcedRes,'getting parced text.............')
        //store it in db
        //create new thread
        const thread = await prisma.thread.create({
            data: {
                projectId: project.id,
            },
            include: {
                conversations: true
            }
        })
        
        console.log(thread,'thread created..........')
        //create new conversation 
        const dbConversation = await prisma.conversation.create({
            data: {
                query,
                threadId: thread.id,
                llmResponce: parcedRes?.text
            }
        })
        console.log(dbConversation, 'conversation created')
        //append this conversation to thread
        await prisma.thread.update({
            where:{
                id: thread.id
            },
            data: {
                conversations: {
                    connect: {
                        id: dbConversation.id
                    }
                }
            }
        })
        //return res
        return NextResponse.json({
            success: true,
            answer: parcedRes,
            threadId: thread.id,
    })
        
    } catch (error) {
        console.log(error,'getting error in chat route')
        return NextResponse.json({
            success: false,
            message: 'internal server error'
        })
    }
}