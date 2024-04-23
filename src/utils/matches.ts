import { PineconeClient, ScoredVector } from "@pinecone-database/pinecone";

import { env } from "@/config/env.mjs";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
};

const getMatchesFromEmbeddings = async (
  embeddings: number[],
  pinecone: PineconeClient,
  topK: number,
): Promise<ScoredVector[]> => {
  if (!env.PINECONE_INDEX_NAME) {
    throw (new Error("PINECONE_INDEX_NAME is not set"));
  }

  const index = pinecone!.Index(env.PINECONE_INDEX_NAME);
  const queryRequest = {
    namespace: 'electoral-commission',
    vector: embeddings,
    topK,
    includeMetadata: true,
  };

  try {
    const queryResult = await index.query({
      queryRequest,
    });
    // console.log("Matches:", queryResult.matches);

    return queryResult.matches?.map((match) => ({
      ...match,
      metadata: match.metadata ? match.metadata as Metadata : { url: '', text: '', chunk: '' },
    })) || [];
  } catch (e) {
    console.log("Error querying embeddings: ", e);
    throw (new Error(`Error querying embeddings: ${e}`));
  }
};

export { getMatchesFromEmbeddings };
