import { vectorStore } from "@/lib/core/vectorStore";
import prisma from "@/prisma/dbClient";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { compile } from "html-to-text";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, sourceUrl, excludePaths, allowedOrigin } = await req.json()
        try {
            const project = await prisma.project.create({
                data: {
                    title,
                    sourceUrl,
                    excludePaths,
                    allowedOrigin,
                    userId: "f62b9b3b-f0f6-4214-983b-d3c9796122e5"
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
                const vectorData = await vectorStore.addDocuments(allSplits);
            console.log(vectorData,'getting vector data stored........')
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