import { NextRequest, NextResponse } from "next/server";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
// import { vectorStore } from "@/lib/core/vectorStore";
// import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { compile } from 'html-to-text'




export async function POST(req: NextRequest) {
    try {
        const { sourceUrl, excludeDirs }  = await req.json()
        console.log(sourceUrl,'getting url......')

        const compiledConvert = compile({ wordwrap: 130 });
        
        const loader = new RecursiveUrlLoader(sourceUrl, {
          extractor: compiledConvert,
          maxDepth: 1,
          excludeDirs: excludeDirs,
        });

        const docs = await loader.load();
        //split in chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const allSplits = await textSplitter.splitDocuments(docs);
        console.log(allSplits,'geting splits')

    } catch (error) {
        console.log(error,'error in add-source route')
        return NextResponse.json({
            success: true,
            message: 'Internal Server Error'
        })
    }
}