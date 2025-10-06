import { embeddings } from "./embedings";
import { QdrantVectorStore } from "@langchain/qdrant";


export const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL!,
  collectionName: "askguru-testing",
});