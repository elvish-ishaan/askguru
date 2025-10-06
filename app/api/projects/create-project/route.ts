import { authOptions } from "@/lib/authOptions";
import { vectorStore } from "@/lib/core/vectorStore";
import prisma from "@/prisma/dbClient";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { compile } from "html-to-text";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    //@ts-expect-error fix type here
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            success: false,
            message: 'user unauthenticated'
        })
    }
    try {
        const { title, sourceUrl, excludePaths, allowedOrigin } = await req.json()
        try {
            const project = await prisma.project.create({
                data: {
                    title,
                    sourceUrl,
                    excludePaths: excludePaths,
                    allowedOrigin,
                    //@ts-expect-error fix the typo error
                    userId: session.user?.id
                }
            })
            console.log(project,'project created successfully')
            console.log("starting main operations........")
            const compiledConvert = compile({ wordwrap: 130 });
                    
            const loader = new RecursiveUrlLoader(sourceUrl, {
              extractor: compiledConvert,
              maxDepth: 1,
              excludeDirs: excludePaths,
            });
    
            const docs = await loader.load();
            //split in chunks
            const textSplitter = new RecursiveCharacterTextSplitter({
              chunkSize: 1000,
              chunkOverlap: 200,
            });
    
            const allSplits = await textSplitter.splitDocuments(docs);
            console.log(allSplits[0],'getting one splits.....')
            //map every doc with projectId metadata included
            for(let i=0; i <= docs.length; i++){
                allSplits[i].metadata.projectId = project.id
            }
            console.log(allSplits,'getting mapped result....')
            try {
                await vectorStore.addDocuments(allSplits);
            } catch (error) {
                console.log(error,'error in saving vector to db..........')
            }

            //return the response
            return NextResponse.json({
                success: true,
                message: 'project created',
                project
            })

        } catch (error) {
            console.log(error,'error in creating project in db')
        }
    } catch (error) {
        console.log(error, 'error in create-project route')
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}