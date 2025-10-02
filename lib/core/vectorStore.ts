import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddings } from "./embedings";

export const vectorStore = new MemoryVectorStore(embeddings);