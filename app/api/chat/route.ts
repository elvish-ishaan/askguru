import { model } from "@/lib/core/llm";
import { vectorStore } from "@/lib/core/vectorStore";
import { systemPrompt } from "@/lib/systemPrompt";
import prisma from "@/prisma/dbClient";
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
        const host = req.headers.get('host');
        console.log(host,'getting origin host.........')
        const url = new URL(project.allowedOrigin?.trim());
        console.log(url.host,'getting project saved host.........')
        const  allowedHost = url.host
        if(host !== allowedHost){
            console.log(host,allowedHost,'getting host and allowed host')
            return NextResponse.json({
                success: false,
                message: 'host does not match with allowed origin'
            })
        }

        console.log(project,'sucessfully got project db')
        
        //use similarity search to fetch similiar data(context)
        let context;
        try {
          context = await vectorStore.similaritySearch(query, 2, {
            projectId: project.id,
          })
        } catch (error) {
            console.log(error,'error in fetching context from vector store')
        }
        if(!context){
            console.log("no context found");
            return NextResponse.json({
                success: false,
                message: 'no context found, please add data to your project'
            })
        }
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
        //update usage if not present create new and set value
        const usage = await prisma.usage.upsert({
            where: {
                projectId: project.id
            },
            update: {
                totalApiCalls: {
                    increment: 1
                },
                totalMessages: {
                    increment: 1
                },
                totalTokensUsed: {
                    increment: generatedLlmRes.usage_metadata?.total_tokens
                },
                totalThreads: {
                    increment: 1
                }
            },
            create: {
                projectId: project.id,
                totalApiCalls: 1,
                totalMessages: 1,
                totalTokensUsed: 1,
                totalThreads: 1
            }
        })
        console.log(usage,'usage created......')
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