import { model } from "@/lib/core/llm";
import { vectorStore } from "@/lib/core/vectorStore";
import { followUpSystemPrompt, } from "@/lib/systemPrompt";
import prisma from "@/prisma/dbClient";
import { NextRequest, NextResponse } from "next/server";

interface Conversation {
    query: string;
    id: string;
    created_at: Date;
    updated_at: Date;
    threadId: string;
    llmResponce: string;
}

export async function POST(req: NextRequest){

    try {
        const authorization = req.headers.get("authorization")
        const apiKey = authorization?.split(" ")[1]

        // Fixed: Use OR instead of AND, and !== instead of ==
        if(!apiKey || typeof(apiKey) !== "string"){
            return NextResponse.json({
                success: false,
                message: "api key not found"
            }, { status: 401 })
        }

        const { query, threadId, } = await req.json()
        if(!query || query.trim() == '' ){
            return NextResponse.json({
                success: false,
                message: "all params are required"
            }, { status: 400 })
        }

        // Validate threadId
        if(!threadId || typeof(threadId) !== "string"){
            return NextResponse.json({
                success: false,
                message: "valid threadId is required"
            }, { status: 400 })
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
            }, { status: 401 })
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
            }, { status: 404 })
        }
        console.log(project,'sucessfully got project db')

        //fetch thread 
        const thread = await prisma.thread.findUnique({
            where: {
                id: threadId
            },
            include: {
                conversations: true
            }
        })
        if(!thread){
            return NextResponse.json({
                success: false,
                message: "no thread found"
            }, { status: 404 })
        }

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
        let context;
        try {
            context = await vectorStore.similaritySearch(query, 2, filter)
        } catch (error) {
            console.log(error,'error in similarity search vector store')
        }
        console.log(context,'geting context..........')
        //prepare the conversation
        const conversationHistory = thread.conversations.map(( x: Conversation ) => {
            return {
                user: x.query,
                ai: x.llmResponce
            }
        })
        console.log(conversationHistory,'prepared conversation history..........')
        //provide most similar data with conversation(if present) to llm
        const generatedLlmRes = await model.invoke(followUpSystemPrompt(JSON.stringify(context), JSON.stringify(conversationHistory), query))
        console.log(generatedLlmRes,'getting generated raw ...........')
        //parce the llm res
        const parcedRes = JSON.parse(generatedLlmRes.content as string)
        console.log(parcedRes,'getting parced............')
        //store it in db
        //create new conversation 
        const dbConversation = await prisma.conversation.create({
            data: {
                query,
                threadId: thread.id,
                llmResponce: parcedRes.text
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
        //update the usage details
        const updatedUsage = await prisma.usage.update({
            where: {
                projectId: project.id
            },
            data: {
                totalApiCalls: {
                    increment: 1
                },
                totalMessages: {
                    increment: 1
                },
                totalTokensUsed: {
                    increment: generatedLlmRes.usage_metadata?.total_tokens || 0
                }
            },
        })
        console.log(updatedUsage,'updated usage.......')
        //return res
        return NextResponse.json({
            success: true,
            answer: parcedRes
        })
    } catch (error) {
        console.log(error,'getting error in chat route')
        return NextResponse.json({
            success: false,
            message: 'internal server error'
        }, { status: 500 })
    }
}