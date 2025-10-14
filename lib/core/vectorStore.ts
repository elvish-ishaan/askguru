// import { embeddings } from "./embedings";
// import { QdrantVectorStore } from "@langchain/qdrant";


// export const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
//   url: process.env.QDRANT_URL!,
//   apiKey: process.env.QDRANT_API_KEY!,
//   collectionName: "askguru-testing",
// });


import { PineconeStore } from "@langchain/pinecone";

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { embeddings } from "./embedings";

const pinecone = new PineconeClient();
// Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  maxConcurrency: 5,
  // You can pass a namespace here too
  // namespace: "foo",
});