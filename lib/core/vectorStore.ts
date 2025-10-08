import { embeddings } from "./embedings";
import { QdrantVectorStore } from "@langchain/qdrant";


export const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
  collectionName: "askguru-testing",
});